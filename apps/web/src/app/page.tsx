export default function HomePage() {
  return (
    <main
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100dvh',
        gap: '1rem',
      }}
    >
      <h1 style={{ fontSize: '2.5rem', fontWeight: 700 }}>DS Builder</h1>
      <p style={{ color: '#6b7280' }}>Build your design system, fast.</p>
    </main>
  )
}
