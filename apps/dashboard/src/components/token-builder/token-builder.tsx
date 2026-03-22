'use client'

import { TokenBuilderProvider, useTokenBuilder } from '@/lib/tokens/store'
import { TabBar } from './tab-bar'
import { PrimitivesPanel } from './primitives-panel'
import { SemanticPanel } from './semantic-panel'
import { GlobalPanel } from './global-panel'
import styles from './token-builder.module.css'

function BuilderContent() {
  const { state } = useTokenBuilder()

  return (
    <div className={styles.builder}>
      <TabBar />
      <div className={styles.body}>
        {state.activeTab === 'primitives' && <PrimitivesPanel />}
        {state.activeTab === 'semantic'   && <SemanticPanel />}
        {state.activeTab === 'global'     && <GlobalPanel />}
      </div>
    </div>
  )
}

export function TokenBuilder() {
  return (
    <TokenBuilderProvider>
      <BuilderContent />
    </TokenBuilderProvider>
  )
}
