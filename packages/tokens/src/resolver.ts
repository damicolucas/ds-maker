import type {
  TokenTree,
  TokenGroup,
  DesignToken,
  TokenNode,
  TokenType,
  TokenValue,
  ResolvedToken,
  CubicBezierValue,
  GradientStop,
} from './types.js'

const REFERENCE_RE = /^\{([^}]+)\}$/

function isToken(node: TokenNode): node is DesignToken {
  return '$value' in node
}

function isReference(value: TokenValue): boolean {
  return typeof value === 'string' && REFERENCE_RE.test(value)
}

function getReferenceTarget(value: string): string | undefined {
  return value.match(REFERENCE_RE)?.[1]
}

export function toCssVar(path: string[], prefix: string): string {
  return `--${prefix}-${path.join('-')}`
}

function formatValue(value: TokenValue, type?: TokenType): string {
  if (typeof value === 'string') return value
  if (typeof value === 'number') return String(value)
  if (typeof value === 'boolean') return String(value)

  if (Array.isArray(value)) {
    if (type === 'cubicBezier') {
      return `cubic-bezier(${(value as CubicBezierValue).join(', ')})`
    }
    if (type === 'fontFamily') {
      return (value as unknown as string[])
        .map((f) => (f.includes(' ') ? `"${f}"` : f))
        .join(', ')
    }
    if (type === 'gradient') {
      const stops = value as GradientStop[]
      const stopStr = stops.map((s) => `${s.color} ${s.position * 100}%`).join(', ')
      return `linear-gradient(to right, ${stopStr})`
    }
  }

  // Composite values (shadow, border, typography, transition) kept as JSON for now.
  // Outputs that need special handling should serialize in their own layer.
  return JSON.stringify(value)
}

// ─── Flatten ─────────────────────────────────────────────────────────────────

type FlatEntry = {
  token: DesignToken
  path: string[]
}

export function flatten(
  tree: TokenTree,
  parentPath: string[] = [],
  parentType?: TokenType,
): Map<string, FlatEntry> {
  const flat = new Map<string, FlatEntry>()

  for (const [key, node] of Object.entries(tree)) {
    if (key.startsWith('$') || node === undefined || node === null) continue

    const path = [...parentPath, key]
    const typedNode = node as TokenNode
    const inheritedType = (typedNode as TokenGroup).$type ?? parentType

    if (isToken(typedNode)) {
      flat.set(path.join('.'), {
        token: {
          ...typedNode,
          $type: typedNode.$type ?? inheritedType,
        },
        path,
      })
    } else {
      const nested = flatten(typedNode as TokenGroup, path, inheritedType)
      for (const [name, entry] of nested) {
        flat.set(name, entry)
      }
    }
  }

  return flat
}

// ─── Resolve ─────────────────────────────────────────────────────────────────

export function resolve(tree: TokenTree, prefix: string): ResolvedToken[] {
  const flat = flatten(tree)
  const resolved: ResolvedToken[] = []

  for (const [name, { token, path }] of flat) {
    const rawValue = token.$value
    const ref = isReference(rawValue)
    const referenceTarget = ref ? getReferenceTarget(rawValue as string) : undefined

    let value: string

    if (ref && referenceTarget) {
      const targetEntry = flat.get(referenceTarget)
      if (targetEntry) {
        value = `var(${toCssVar(targetEntry.path, prefix)})`
      } else {
        // Unresolved reference — emit a warning and keep raw
        process.stdout.write(
          `[dsbuilder/tokens] WARN Unresolved reference: ${rawValue} in token "${name}"\n`,
        )
        value = rawValue as string
      }
    } else {
      value = formatValue(rawValue, token.$type)
    }

    resolved.push({
      name,
      path,
      cssVar: toCssVar(path, prefix),
      type: token.$type ?? 'string',
      value,
      rawValue,
      isReference: ref,
      referenceTarget,
      description: token.$description,
      meta: token.$extensions?.dsbuilder,
    })
  }

  return resolved
}

/**
 * Merge a partial token tree (brand/mode override) on top of a resolved base,
 * returning only the tokens that differ.
 */
export function resolveOverride(
  override: TokenTree,
  prefix: string,
  base: Map<string, ResolvedToken>,
): ResolvedToken[] {
  const flat = flatten(override)
  const overrides: ResolvedToken[] = []

  for (const [name, { token, path }] of flat) {
    const rawValue = token.$value
    const ref = isReference(rawValue)
    const referenceTarget = ref ? getReferenceTarget(rawValue as string) : undefined

    let value: string

    if (ref && referenceTarget) {
      const baseToken = base.get(referenceTarget)
      if (baseToken) {
        value = `var(${toCssVar(baseToken.path, prefix)})`
      } else {
        value = rawValue as string
      }
    } else {
      value = formatValue(rawValue, token.$type)
    }

    overrides.push({
      name,
      path,
      cssVar: toCssVar(path, prefix),
      type: token.$type ?? 'string',
      value,
      rawValue,
      isReference: ref,
      referenceTarget,
      description: token.$description,
      meta: token.$extensions?.dsbuilder,
    })
  }

  return overrides
}
