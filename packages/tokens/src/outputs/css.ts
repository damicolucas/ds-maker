import type { ResolvedToken, CompilerOptions } from '../types.js'
import { resolve, resolveOverride, toCssVar } from '../resolver.js'

function renderBlock(tokens: ResolvedToken[], selector: string, indent = '  '): string {
  const props = tokens
    .map((t) => `${indent}${t.cssVar}: ${t.value};`)
    .join('\n')
  return `${selector} {\n${props}\n}`
}

export function generateCSS(
  base: ResolvedToken[],
  options: CompilerOptions,
): string {
  const prefix = options.prefix ?? 'ds'
  const blocks: string[] = []

  // ── Base tokens (:root) ──────────────────────────────────────────────────
  blocks.push(renderBlock(base, ':root'))

  // ── Component tokens (hybrid architecture) ───────────────────────────────
  if (options.componentMappings?.length) {
    const baseMap = new Map(base.map((t) => [t.name, t]))
    const componentTokens: ResolvedToken[] = []

    for (const { component, mappings } of options.componentMappings) {
      for (const [tokenPath, semanticName] of Object.entries(mappings)) {
        const semantic = baseMap.get(semanticName)
        if (!semantic) {
          console.warn(
            `[dsbuilder/tokens] Component mapping references unknown token "${semanticName}"`,
          )
          continue
        }

        const path = [component, ...tokenPath.split('.')]
        componentTokens.push({
          name: path.join('.'),
          path,
          cssVar: toCssVar(path, prefix),
          type: semantic.type,
          // Component tokens alias the semantic CSS var
          value: `var(${semantic.cssVar})`,
          rawValue: `{${semanticName}}`,
          isReference: true,
          referenceTarget: semanticName,
          meta: { componentToken: true, semanticSource: semanticName },
        })
      }
    }

    if (componentTokens.length) {
      blocks.push('')
      blocks.push('/* Component tokens — auto-generated aliases */')
      blocks.push(renderBlock(componentTokens, ':root'))
    }
  }

  // ── Brand overrides ──────────────────────────────────────────────────────
  if (options.brands) {
    const baseMap = new Map(base.map((t) => [t.name, t]))

    for (const [brand, tree] of Object.entries(options.brands)) {
      const overrides = resolveOverride(tree, prefix, baseMap)
      if (overrides.length) {
        blocks.push('')
        blocks.push(`/* Brand: ${brand} */`)
        blocks.push(renderBlock(overrides, `[data-brand="${brand}"]`))
      }
    }
  }

  // ── Mode overrides ───────────────────────────────────────────────────────
  if (options.modes) {
    const baseMap = new Map(base.map((t) => [t.name, t]))

    for (const [mode, tree] of Object.entries(options.modes)) {
      const overrides = resolveOverride(tree, prefix, baseMap)
      if (overrides.length) {
        blocks.push('')
        blocks.push(`/* Mode: ${mode} */`)
        blocks.push(renderBlock(overrides, `[data-mode="${mode}"]`))
      }
    }
  }

  return blocks.join('\n')
}

export type { CompilerOptions }
