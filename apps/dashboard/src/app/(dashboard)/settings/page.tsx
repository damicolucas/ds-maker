import styles from '../tokens/page.module.css'

export default function SettingsPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerMeta}>
          <span className={styles.label}>Project Settings</span>
        </div>
        <h1 className={styles.title}>Settings</h1>
        <p className={styles.subtitle}>
          Configurações do projeto — prefixo CSS, frameworks, outputs.
        </p>
      </header>

      <div className={styles.empty}>
        <div className={styles.emptyIcon}>◉</div>
        <p className={styles.emptyTitle}>Em breve</p>
        <p className={styles.emptyDesc}>Configurações do projeto vão viver aqui.</p>
      </div>
    </div>
  )
}
