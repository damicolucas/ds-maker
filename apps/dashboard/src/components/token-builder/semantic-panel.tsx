'use client'

import { useTokenBuilder } from '@/lib/tokens/store'
import type { SemanticToken } from '@/lib/tokens/types'
import styles from './semantic-panel.module.css'

// ─── Primitive picker ─────────────────────────────────────────────────────────

function PrimitivePicker({
  semanticId,
  mode,
  value,
}: {
  semanticId: string
  mode: 'light' | 'dark'
  value: string | null
}) {
  const { state, dispatch } = useTokenBuilder()
  const colorPrimitives = state.primitives.filter((p) => p.category === 'color')
  const selected = colorPrimitives.find((p) => p.id === value)

  return (
    <div className={styles.pickerWrapper}>
      {/* Color preview dot */}
      <span
        className={styles.pickerDot}
        style={{
          background: selected?.value ?? 'transparent',
          border: selected ? '1px solid rgba(255,255,255,0.12)' : '1px dashed var(--border-accent)',
        }}
      />
      <select
        className={styles.pickerSelect}
        value={value ?? ''}
        onChange={(e) =>
          dispatch({
            type: 'SET_SEMANTIC_REF',
            semanticId,
            mode,
            primitiveId: e.target.value || null,
          })
        }
      >
        <option value="">— none —</option>
        {colorPrimitives.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name} {p.value}
          </option>
        ))}
      </select>
    </div>
  )
}

// ─── Semantic token row ───────────────────────────────────────────────────────

function SemanticRow({ token }: { token: SemanticToken }) {
  const { state } = useTokenBuilder()

  // Get effective values (theme override takes precedence)
  const getEffectiveRef = (mode: 'light' | 'dark') => {
    if (state.activeThemeId !== 'base') {
      const theme = state.themes.find((t) => t.id === state.activeThemeId)
      const override = theme?.overrides[token.id]
      if (override && override[mode] !== undefined) return override[mode]
    }
    return token[mode]
  }

  const lightRef = getEffectiveRef('light')
  const darkRef = getEffectiveRef('dark')

  // Preview swatch for current mode
  const activeRef = state.activeMode === 'light' ? lightRef : darkRef
  const activePrimitive = state.primitives.find((p) => p.id === activeRef)

  return (
    <div className={styles.semanticRow}>
      <div className={styles.rowLeft}>
        <span
          className={styles.rowPreview}
          style={{
            background: activePrimitive?.value ?? 'transparent',
            border: activePrimitive ? '1px solid rgba(255,255,255,0.1)' : '1px dashed var(--border-accent)',
          }}
        />
        <div className={styles.rowInfo}>
          <span className={styles.rowName}>{token.name}</span>
          {token.description && (
            <span className={styles.rowDesc}>{token.description}</span>
          )}
        </div>
      </div>

      <div className={styles.rowPickers}>
        <div className={styles.pickerGroup}>
          <span className={styles.pickerLabel}>light</span>
          <PrimitivePicker semanticId={token.id} mode="light" value={lightRef} />
        </div>
        <div className={styles.pickerGroup}>
          <span className={styles.pickerLabel}>dark</span>
          <PrimitivePicker semanticId={token.id} mode="dark" value={darkRef} />
        </div>
      </div>
    </div>
  )
}

// ─── Group nav ────────────────────────────────────────────────────────────────

function GroupNav({
  groups,
  active,
  onSelect,
}: {
  groups: string[]
  active: string
  onSelect: (g: string) => void
}) {
  return (
    <nav className={styles.groupNav}>
      <span className={styles.groupNavLabel}>Color</span>
      {groups.map((g) => (
        <button
          key={g}
          className={`${styles.groupNavItem} ${active === g ? styles.groupNavActive : ''}`}
          onClick={() => onSelect(g)}
        >
          {g}
        </button>
      ))}
    </nav>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function SemanticPanel() {
  const { state, dispatch } = useTokenBuilder()

  const colorSemanticGroups = [
    ...new Set(
      state.semanticTokens.filter((t) => t.category === 'color').map((t) => t.group),
    ),
  ]

  const activeGroup = state.activeSemanticGroup ?? colorSemanticGroups[0] ?? 'background'

  const visibleTokens = state.semanticTokens.filter(
    (t) => t.category === 'color' && t.group === activeGroup,
  )

  return (
    <div className={styles.panel}>
      <GroupNav
        groups={colorSemanticGroups}
        active={activeGroup}
        onSelect={(g) => dispatch({ type: 'SET_SEMANTIC_GROUP', group: g })}
      />

      <div className={styles.content}>
        <div className={styles.contentHeader}>
          <span className={styles.contentTitle}>Color — {activeGroup}</span>
          <div className={styles.columnLabels}>
            <span />
            <span>Light</span>
            <span>Dark</span>
          </div>
        </div>

        <div className={styles.tokenRows}>
          {visibleTokens.map((t) => (
            <SemanticRow key={t.id} token={t} />
          ))}
        </div>
      </div>
    </div>
  )
}
