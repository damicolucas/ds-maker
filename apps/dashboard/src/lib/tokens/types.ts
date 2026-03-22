// ─── Primitive layer ─────────────────────────────────────────────────────────

export type PrimitiveCategory =
  | 'color'
  | 'spacing'
  | 'typography'
  | 'radius'
  | 'shadow'
  | 'duration'

export interface PrimitiveToken {
  id: string
  /** e.g. 'blue-500', 'spacing-4', 'font-sans' */
  name: string
  /** Raw CSS value: '#3b82f6', '16px', 'ui-sans-serif' */
  value: string
  category: PrimitiveCategory
  /** Subgroup within category: 'blue', 'gray', 'font-size'  */
  group: string
  /** Whether this was created by the user (not a built-in) */
  custom?: boolean
}

// ─── Semantic layer ───────────────────────────────────────────────────────────

/**
 * A semantic token slot. Each slot references a primitive for each mode.
 * The full token name is: "{category}.{group}.{name}"
 * e.g. color.background.primary
 */
export interface SemanticToken {
  id: string
  /** Leaf name: 'primary', 'secondary', 'danger' */
  name: string
  category: PrimitiveCategory
  /** Semantic group: 'background', 'text', 'border', 'spacing' */
  group: string
  /** Primitive token id for light/default mode */
  light: string | null
  /** Primitive token id for dark/inverse mode */
  dark: string | null
  description?: string
  /** Whether this token was added by the user (not built-in) */
  custom?: boolean
}

// ─── Global extra tokens (free plan) ─────────────────────────────────────────

export interface GlobalToken {
  id: string
  name: string
  value: string
  category: PrimitiveCategory
  description?: string
}

// ─── Themes ───────────────────────────────────────────────────────────────────

/**
 * A theme is a named set of semantic token overrides.
 * The "base" theme uses the default semantic values.
 * Additional themes override specific tokens for their brand.
 */
export interface Theme {
  id: string
  name: string
  /** Semantic token overrides: semanticId → { light: primitiveId, dark: primitiveId } */
  overrides: Record<string, { light: string | null; dark: string | null }>
}

// ─── Builder state ────────────────────────────────────────────────────────────

export type ActiveTab = 'primitives' | 'semantic' | 'global'
export type ActiveMode = 'light' | 'dark'

export interface TokenBuilderState {
  primitives: PrimitiveToken[]
  semanticTokens: SemanticToken[]
  globalTokens: GlobalToken[]
  themes: Theme[]
  activeTab: ActiveTab
  activeMode: ActiveMode
  activeThemeId: string
  /** Selected primitive group (e.g. 'blue', 'gray') */
  activePrimitiveGroup: string | null
  /** Selected semantic group (e.g. 'background', 'text') */
  activeSemanticGroup: string | null
}

// ─── Actions ─────────────────────────────────────────────────────────────────

export type TokenBuilderAction =
  | { type: 'SET_TAB'; tab: ActiveTab }
  | { type: 'SET_MODE'; mode: ActiveMode }
  | { type: 'SET_ACTIVE_THEME'; themeId: string }
  | { type: 'SET_PRIMITIVE_GROUP'; group: string }
  | { type: 'SET_SEMANTIC_GROUP'; group: string }
  | { type: 'UPDATE_PRIMITIVE'; id: string; value: string }
  | { type: 'ADD_PRIMITIVE'; token: PrimitiveToken }
  | { type: 'REMOVE_PRIMITIVE'; id: string }
  | { type: 'SET_SEMANTIC_REF'; semanticId: string; mode: ActiveMode; primitiveId: string | null }
  | { type: 'ADD_SEMANTIC_TOKEN'; token: SemanticToken }
  | { type: 'REMOVE_SEMANTIC_TOKEN'; id: string }
  | { type: 'ADD_GLOBAL'; token: GlobalToken }
  | { type: 'UPDATE_GLOBAL'; id: string; patch: Partial<GlobalToken> }
  | { type: 'REMOVE_GLOBAL'; id: string }
  | { type: 'ADD_THEME'; theme: Theme }
  | { type: 'REMOVE_THEME'; id: string }
  | { type: 'SET_THEME_OVERRIDE'; themeId: string; semanticId: string; mode: ActiveMode; primitiveId: string | null }
