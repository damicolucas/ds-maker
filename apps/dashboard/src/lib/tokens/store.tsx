'use client'

import { createContext, useContext, useReducer, type ReactNode } from 'react'
import type {
  TokenBuilderState,
  TokenBuilderAction,
} from './types'
import {
  DEFAULT_PRIMITIVES,
  DEFAULT_SEMANTIC_TOKENS,
  DEFAULT_THEMES,
} from './defaults'

// ─── Initial state ────────────────────────────────────────────────────────────

const INITIAL: TokenBuilderState = {
  primitives: DEFAULT_PRIMITIVES,
  semanticTokens: DEFAULT_SEMANTIC_TOKENS,
  globalTokens: [],
  themes: DEFAULT_THEMES,
  activeTab: 'primitives',
  activeMode: 'light',
  activeThemeId: 'base',
  activePrimitiveGroup: 'gray',
  activeSemanticGroup: 'background',
}

// ─── Reducer ──────────────────────────────────────────────────────────────────

function reducer(state: TokenBuilderState, action: TokenBuilderAction): TokenBuilderState {
  switch (action.type) {
    case 'SET_TAB':
      return { ...state, activeTab: action.tab }

    case 'SET_MODE':
      return { ...state, activeMode: action.mode }

    case 'SET_ACTIVE_THEME':
      return { ...state, activeThemeId: action.themeId }

    case 'SET_PRIMITIVE_GROUP':
      return { ...state, activePrimitiveGroup: action.group }

    case 'SET_SEMANTIC_GROUP':
      return { ...state, activeSemanticGroup: action.group }

    case 'UPDATE_PRIMITIVE':
      return {
        ...state,
        primitives: state.primitives.map((p) =>
          p.id === action.id ? { ...p, value: action.value } : p,
        ),
      }

    case 'ADD_PRIMITIVE':
      return { ...state, primitives: [...state.primitives, action.token] }

    case 'REMOVE_PRIMITIVE':
      return {
        ...state,
        primitives: state.primitives.filter((p) => p.id !== action.id),
      }

    case 'SET_SEMANTIC_REF': {
      const isBase = state.activeThemeId === 'base'

      if (isBase) {
        return {
          ...state,
          semanticTokens: state.semanticTokens.map((t) =>
            t.id === action.semanticId
              ? { ...t, [action.mode]: action.primitiveId }
              : t,
          ),
        }
      }

      // Theme override
      return {
        ...state,
        themes: state.themes.map((theme) => {
          if (theme.id !== state.activeThemeId) return theme
          const existing = theme.overrides[action.semanticId] ?? { light: null, dark: null }
          return {
            ...theme,
            overrides: {
              ...theme.overrides,
              [action.semanticId]: { ...existing, [action.mode]: action.primitiveId },
            },
          }
        }),
      }
    }

    case 'ADD_SEMANTIC_TOKEN':
      return { ...state, semanticTokens: [...state.semanticTokens, action.token] }

    case 'REMOVE_SEMANTIC_TOKEN':
      return {
        ...state,
        semanticTokens: state.semanticTokens.filter((t) => t.id !== action.id),
      }

    case 'ADD_GLOBAL':
      return { ...state, globalTokens: [...state.globalTokens, action.token] }

    case 'UPDATE_GLOBAL':
      return {
        ...state,
        globalTokens: state.globalTokens.map((t) =>
          t.id === action.id ? { ...t, ...action.patch } : t,
        ),
      }

    case 'REMOVE_GLOBAL':
      return {
        ...state,
        globalTokens: state.globalTokens.filter((t) => t.id !== action.id),
      }

    case 'ADD_THEME':
      return { ...state, themes: [...state.themes, action.theme] }

    case 'REMOVE_THEME':
      return {
        ...state,
        themes: state.themes.filter((t) => t.id !== action.id),
        activeThemeId: action.id === state.activeThemeId ? 'base' : state.activeThemeId,
      }

    case 'SET_THEME_OVERRIDE': {
      return {
        ...state,
        themes: state.themes.map((theme) => {
          if (theme.id !== action.themeId) return theme
          const existing = theme.overrides[action.semanticId] ?? { light: null, dark: null }
          return {
            ...theme,
            overrides: {
              ...theme.overrides,
              [action.semanticId]: { ...existing, [action.mode]: action.primitiveId },
            },
          }
        }),
      }
    }

    default:
      return state
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

type ContextValue = {
  state: TokenBuilderState
  dispatch: React.Dispatch<TokenBuilderAction>
}

const TokenBuilderContext = createContext<ContextValue | null>(null)

export function TokenBuilderProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, INITIAL)
  return (
    <TokenBuilderContext.Provider value={{ state, dispatch }}>
      {children}
    </TokenBuilderContext.Provider>
  )
}

export function useTokenBuilder() {
  const ctx = useContext(TokenBuilderContext)
  if (!ctx) throw new Error('useTokenBuilder must be used inside <TokenBuilderProvider>')
  return ctx
}

// ─── Selectors ────────────────────────────────────────────────────────────────

export function usePrimitiveById() {
  const { state } = useTokenBuilder()
  return (id: string | null) => state.primitives.find((p) => p.id === id) ?? null
}

/** Returns effective semantic value for active theme + mode */
export function useEffectiveRef(semanticId: string, mode: 'light' | 'dark') {
  const { state } = useTokenBuilder()
  const token = state.semanticTokens.find((t) => t.id === semanticId)
  if (!token) return null

  if (state.activeThemeId !== 'base') {
    const theme = state.themes.find((t) => t.id === state.activeThemeId)
    const override = theme?.overrides[semanticId]
    if (override?.[mode] !== undefined) return override[mode]
  }

  return token[mode]
}
