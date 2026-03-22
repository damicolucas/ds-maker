// W3C Design Token Community Group spec
// https://tr.designtokens.org/format/

export type TokenType =
  | 'color'
  | 'dimension'
  | 'fontFamily'
  | 'fontWeight'
  | 'duration'
  | 'cubicBezier'
  | 'number'
  | 'string'
  | 'boolean'
  | 'strokeStyle'
  | 'border'
  | 'transition'
  | 'shadow'
  | 'gradient'
  | 'typography'

export type CubicBezierValue = [number, number, number, number]

export type StrokeStyleValue =
  | 'solid'
  | 'dashed'
  | 'dotted'
  | 'double'
  | 'groove'
  | 'ridge'
  | 'outset'
  | 'inset'

export type ShadowValue = {
  color: string
  offsetX: string
  offsetY: string
  blur: string
  spread: string
  inset?: boolean
}

export type GradientStop = {
  color: string
  position: number
}

export type TypographyValue = {
  fontFamily: string | string[]
  fontSize: string
  fontWeight: number | string
  letterSpacing: string
  lineHeight: string | number
}

export type BorderValue = {
  color: string
  width: string
  style: StrokeStyleValue
}

export type TransitionValue = {
  duration: string
  delay: string
  timingFunction: CubicBezierValue | string
}

export type TokenPrimitiveValue =
  | string
  | number
  | boolean
  | CubicBezierValue
  | ShadowValue
  | GradientStop[]
  | TypographyValue
  | BorderValue
  | TransitionValue

// Reference syntax: {path.to.token}
export type TokenReference = string

export type TokenValue = TokenPrimitiveValue | TokenReference

// DS Builder specific metadata stored in $extensions
export interface DSBuilderMeta {
  category?: string
  deprecated?: boolean
  deprecationMessage?: string
  // component token marker — set automatically by the compiler
  componentToken?: true
  semanticSource?: string
}

export interface DesignToken {
  $value: TokenValue
  $type?: TokenType
  $description?: string
  $extensions?: {
    dsbuilder?: DSBuilderMeta
    [key: string]: unknown
  }
}

export interface TokenGroup {
  $type?: TokenType
  $description?: string
  $extensions?: Record<string, unknown>
  [key: string]: TokenNode | TokenType | string | Record<string, unknown> | undefined
}

export type TokenNode = DesignToken | TokenGroup
export type TokenTree = TokenGroup

// ─── Resolved ────────────────────────────────────────────────────────────────

export interface ResolvedToken {
  /** Full dot-path: 'color.background.primary' */
  name: string
  /** Segments: ['color', 'background', 'primary'] */
  path: string[]
  /** CSS custom property: '--ds-color-background-primary' */
  cssVar: string
  /** Token type (inherited from group if not set on token) */
  type: TokenType
  /**
   * Final CSS-ready value.
   * For references: 'var(--ds-color-background-primary)'
   * For raw values: the formatted value string
   */
  value: string
  /** Original $value from source (may be a {ref}) */
  rawValue: TokenValue
  /** Whether $value was a reference */
  isReference: boolean
  /** Resolved reference target name, if isReference */
  referenceTarget?: string
  description?: string
  meta?: DSBuilderMeta
}

// ─── Compiler config ─────────────────────────────────────────────────────────

export interface CompilerOptions {
  /**
   * CSS custom property prefix.
   * Default: 'ds'
   * Result: '--ds-color-background-primary'
   */
  prefix?: string

  /**
   * Brand overrides. Each key becomes a [data-brand="key"] selector in CSS.
   * Tokens defined here override base tokens for that brand.
   */
  brands?: Record<string, TokenTree>

  /**
   * Mode overrides (e.g. dark mode). Each key becomes a [data-mode="key"] selector.
   */
  modes?: Record<string, TokenTree>

  /**
   * Component token mappings for the hybrid architecture.
   * The compiler generates component tokens as CSS aliases of semantic tokens.
   *
   * Example:
   * {
   *   component: 'button',
   *   mappings: { 'background.default': 'color.background.primary' }
   * }
   * → --ds-button-background-default: var(--ds-color-background-primary)
   */
  componentMappings?: ComponentMapping[]
}

export interface ComponentMapping {
  /** Component name, e.g. 'button', 'input', 'card' */
  component: string
  /**
   * Map of component token path → semantic token name.
   * Key: relative path within component, e.g. 'background.default'
   * Value: full semantic token name, e.g. 'color.background.primary'
   */
  mappings: Record<string, string>
}

export interface CompilerOutput {
  tokens: ResolvedToken[]
  /** CSS custom properties (base + all brands/modes) */
  css: string
  /** ES module with typed token exports */
  js: string
  /** TypeScript declaration file */
  dts: string
}
