import styles from '../tokens/page.module.css'

export default function PreviewPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerMeta}>
          <span className={styles.label}>Live Preview</span>
        </div>
        <h1 className={styles.title}>Preview</h1>
        <p className={styles.subtitle}>
          Visualize seus componentes com os tokens aplicados em tempo real.
        </p>
      </header>

      <div className={styles.empty}>
        <div className={styles.emptyIcon}>◫</div>
        <p className={styles.emptyTitle}>Preview vazio</p>
        <p className={styles.emptyDesc}>Configure tokens e componentes primeiro.</p>
      </div>
    </div>
  )
}
