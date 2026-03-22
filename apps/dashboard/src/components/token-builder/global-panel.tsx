'use client'

import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { useTokenBuilder } from '@/lib/tokens/store'
import type { GlobalToken, PrimitiveCategory } from '@/lib/tokens/types'
import styles from './global-panel.module.css'

const CATEGORIES: { id: PrimitiveCategory; label: string }[] = [
  { id: 'color',      label: 'Color' },
  { id: 'spacing',    label: 'Dimension' },
  { id: 'typography', label: 'Typography' },
  { id: 'radius',     label: 'Radius' },
  { id: 'duration',   label: 'Duration' },
]

function generateId() {
  return `global-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

function AddTokenForm({ onAdd }: { onAdd: (token: GlobalToken) => void }) {
  const [name, setName] = useState('')
  const [value, setValue] = useState('')
  const [category, setCategory] = useState<PrimitiveCategory>('color')
  const [description, setDescription] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !value.trim()) return
    onAdd({ id: generateId(), name: name.trim(), value: value.trim(), category, description: description.trim() || undefined })
    setName('')
    setValue('')
    setDescription('')
  }

  return (
    <form className={styles.addForm} onSubmit={handleSubmit}>
      <div className={styles.formGrid}>
        <div className={styles.field}>
          <label className={styles.fieldLabel}>Nome</label>
          <input
            className={styles.input}
            placeholder="brand.accent"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.fieldLabel}>Valor</label>
          <input
            className={styles.input}
            placeholder="#ff5500"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.fieldLabel}>Tipo</label>
          <select
            className={styles.input}
            value={category}
            onChange={(e) => setCategory(e.target.value as PrimitiveCategory)}
          >
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
        </div>
        <div className={styles.field}>
          <label className={styles.fieldLabel}>Descrição (opcional)</label>
          <input
            className={styles.input}
            placeholder="Cor de destaque da marca"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>
      <button type="submit" className={styles.addBtn}>
        <Plus size={13} />
        Adicionar token
      </button>
    </form>
  )
}

export function GlobalPanel() {
  const { state, dispatch } = useTokenBuilder()

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Tokens Globais</h2>
          <p className={styles.subtitle}>
            Tokens extras fora da camada semântica — disponíveis para customizações específicas do projeto.
          </p>
        </div>
        <span className={styles.planBadge}>Free</span>
      </div>

      <AddTokenForm
        onAdd={(token) => dispatch({ type: 'ADD_GLOBAL', token })}
      />

      {state.globalTokens.length === 0 ? (
        <div className={styles.empty}>
          <p className={styles.emptyText}>Nenhum token global ainda.</p>
          <p className={styles.emptySubtext}>
            Use tokens globais para valores que não fazem parte do sistema semântico — cores de marca específicas, z-indexes, breakpoints, etc.
          </p>
        </div>
      ) : (
        <div className={styles.tokenList}>
          {state.globalTokens.map((t) => (
            <div key={t.id} className={styles.tokenRow}>
              {t.category === 'color' && (
                <span
                  className={styles.tokenPreview}
                  style={{ background: t.value }}
                />
              )}
              <div className={styles.tokenInfo}>
                <span className={styles.tokenName}>{t.name}</span>
                {t.description && <span className={styles.tokenDesc}>{t.description}</span>}
              </div>
              <span className={styles.tokenValue}>{t.value}</span>
              <span className={styles.tokenType}>{t.category}</span>
              <button
                className={styles.removeBtn}
                onClick={() => dispatch({ type: 'REMOVE_GLOBAL', id: t.id })}
                aria-label="Remover token"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
