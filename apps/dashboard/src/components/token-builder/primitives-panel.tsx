'use client'

import { useTokenBuilder } from '@/lib/tokens/store'
import type { PrimitiveCategory, PrimitiveToken } from '@/lib/tokens/types'
import styles from './primitives-panel.module.css'

// ─── Category structure ───────────────────────────────────────────────────────

const CATEGORIES: { id: PrimitiveCategory; label: string }[] = [
  { id: 'color',      label: 'Color' },
  { id: 'spacing',    label: 'Spacing' },
  { id: 'typography', label: 'Typography' },
  { id: 'radius',     label: 'Radius' },
  { id: 'duration',   label: 'Duration' },
]

// ─── Color row (scale) ────────────────────────────────────────────────────────

function ColorScale({ group, tokens }: { group: string; tokens: PrimitiveToken[] }) {
  const { dispatch } = useTokenBuilder()

  return (
    <div className={styles.colorScale}>
      <span className={styles.colorGroupName}>{group}</span>
      <div className={styles.swatches}>
        {tokens.map((t) => (
          <div key={t.id} className={styles.swatchWrapper}>
            <label
              className={styles.swatch}
              style={{ background: t.value }}
              title={`${t.name} — ${t.value}`}
            >
              <input
                type="color"
                value={t.value.startsWith('#') ? t.value : '#000000'}
                className={styles.colorInput}
                onChange={(e) =>
                  dispatch({ type: 'UPDATE_PRIMITIVE', id: t.id, value: e.target.value })
                }
              />
            </label>
            <span className={styles.swatchStop}>
              {t.name.replace(`${group}-`, '')}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Spacing ──────────────────────────────────────────────────────────────────

function SpacingList({ tokens }: { tokens: PrimitiveToken[] }) {
  return (
    <div className={styles.spacingList}>
      {tokens.map((t) => {
        const px = parseInt(t.value)
        const barWidth = Math.min((px / 128) * 100, 100)
        return (
          <div key={t.id} className={styles.spacingRow}>
            <span className={styles.spacingName}>{t.name}</span>
            <div className={styles.spacingBarWrap}>
              <div className={styles.spacingBar} style={{ width: `${barWidth}%` }} />
            </div>
            <span className={styles.spacingValue}>{t.value}</span>
          </div>
        )
      })}
    </div>
  )
}

// ─── Generic token list ───────────────────────────────────────────────────────

function TokenList({ tokens }: { tokens: PrimitiveToken[] }) {
  return (
    <div className={styles.tokenList}>
      {tokens.map((t) => (
        <div key={t.id} className={styles.tokenRow}>
          <span className={styles.tokenName}>{t.name}</span>
          <span className={styles.tokenValue}>{t.value}</span>
        </div>
      ))}
    </div>
  )
}

// ─── Category nav (left sidebar) ─────────────────────────────────────────────

function CategoryNav({
  activeCategory,
  setCategory,
  activeGroup,
  setGroup,
  groupsByCategory,
}: {
  activeCategory: PrimitiveCategory
  setCategory: (c: PrimitiveCategory) => void
  activeGroup: string
  setGroup: (g: string) => void
  groupsByCategory: Record<PrimitiveCategory, string[]>
}) {
  return (
    <nav className={styles.categoryNav}>
      {CATEGORIES.map((cat) => (
        <div key={cat.id} className={styles.catSection}>
          <button
            className={`${styles.catLabel} ${activeCategory === cat.id ? styles.catActive : ''}`}
            onClick={() => {
              setCategory(cat.id)
              const groups = groupsByCategory[cat.id]
              if (groups?.[0]) setGroup(groups[0])
            }}
          >
            {cat.label}
          </button>
          {activeCategory === cat.id && (
            <div className={styles.groupList}>
              {groupsByCategory[cat.id]?.map((g) => (
                <button
                  key={g}
                  className={`${styles.groupItem} ${activeGroup === g ? styles.groupActive : ''}`}
                  onClick={() => setGroup(g)}
                >
                  {g}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </nav>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function PrimitivesPanel() {
  const { state, dispatch } = useTokenBuilder()

  // Derive groups for each category
  const groupsByCategory = {} as Record<PrimitiveCategory, string[]>
  for (const cat of CATEGORIES) {
    const groups = [
      ...new Set(
        state.primitives.filter((p) => p.category === cat.id).map((p) => p.group),
      ),
    ]
    groupsByCategory[cat.id] = groups
  }

  const activeCategory = (state.activePrimitiveGroup
    ? (state.primitives.find((p) => p.group === state.activePrimitiveGroup)?.category ?? 'color')
    : 'color') as PrimitiveCategory

  const activeGroup = state.activePrimitiveGroup ?? 'gray'

  const visibleTokens = state.primitives.filter(
    (p) => p.category === activeCategory && p.group === activeGroup,
  )

  return (
    <div className={styles.panel}>
      <CategoryNav
        activeCategory={activeCategory}
        setCategory={(c) => {
          const firstGroup = groupsByCategory[c]?.[0]
          if (firstGroup) dispatch({ type: 'SET_PRIMITIVE_GROUP', group: firstGroup })
        }}
        activeGroup={activeGroup}
        setGroup={(g) => dispatch({ type: 'SET_PRIMITIVE_GROUP', group: g })}
        groupsByCategory={groupsByCategory}
      />

      <div className={styles.content}>
        <div className={styles.contentHeader}>
          <span className={styles.contentCategory}>
            {CATEGORIES.find((c) => c.id === activeCategory)?.label}
          </span>
          <span className={styles.contentGroup}>— {activeGroup}</span>
          <span className={styles.contentCount}>{visibleTokens.length} tokens</span>
        </div>

        {activeCategory === 'color' && activeGroup !== 'base' && (
          <ColorScale group={activeGroup} tokens={visibleTokens} />
        )}
        {activeCategory === 'color' && activeGroup === 'base' && (
          <TokenList tokens={visibleTokens} />
        )}
        {activeCategory === 'spacing' && <SpacingList tokens={visibleTokens} />}
        {activeCategory !== 'color' && activeCategory !== 'spacing' && (
          <TokenList tokens={visibleTokens} />
        )}
      </div>
    </div>
  )
}
