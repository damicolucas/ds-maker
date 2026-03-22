import styles from '../tokens/page.module.css'

export default function ComponentsPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerMeta}>
          <span className={styles.label}>Component Library</span>
        </div>
        <h1 className={styles.title}>Components</h1>
        <p className={styles.subtitle}>
          Visualize e configure os componentes do seu design system.
        </p>
      </header>

      <div className={styles.empty}>
        <div className={styles.emptyIcon}>◧</div>
        <p className={styles.emptyTitle}>Nenhum componente ainda</p>
        <p className={styles.emptyDesc}>Disponível após configurar os tokens.</p>
      </div>
    </div>
  )
}
