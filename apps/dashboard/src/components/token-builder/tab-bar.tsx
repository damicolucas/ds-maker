'use client'

import { useTokenBuilder } from '@/lib/tokens/store'
import type { ActiveTab, ActiveMode } from '@/lib/tokens/types'
import styles from './tab-bar.module.css'

const TABS: { id: ActiveTab; label: string }[] = [
  { id: 'primitives', label: 'Primitivos' },
  { id: 'semantic',   label: 'Semânticos' },
  { id: 'global',     label: 'Globais' },
]

export function TabBar() {
  const { state, dispatch } = useTokenBuilder()

  return (
    <div className={styles.bar}>
      <div className={styles.tabs}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.tab} ${state.activeTab === tab.id ? styles.active : ''}`}
            onClick={() => dispatch({ type: 'SET_TAB', tab: tab.id })}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className={styles.controls}>
        {/* Mode toggle */}
        <div className={styles.modeToggle}>
          {(['light', 'dark'] as ActiveMode[]).map((mode) => (
            <button
              key={mode}
              className={`${styles.modeBtn} ${state.activeMode === mode ? styles.modeActive : ''}`}
              onClick={() => dispatch({ type: 'SET_MODE', mode })}
            >
              {mode === 'light' ? '○' : '●'} {mode}
            </button>
          ))}
        </div>

        {/* Theme picker */}
        <select
          className={styles.themeSelect}
          value={state.activeThemeId}
          onChange={(e) => dispatch({ type: 'SET_ACTIVE_THEME', themeId: e.target.value })}
        >
          {state.themes.map((t) => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
      </div>
    </div>
  )
}
