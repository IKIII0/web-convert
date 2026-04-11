// Shared layout wrapper for all converter pages
export default function ConverterLayout({ icon, title, subtitle, children }) {
  return (
    <div style={{ maxWidth: '52rem', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: '4.5rem', height: '4.5rem', borderRadius: '1.25rem',
          background: 'linear-gradient(135deg, #FFF7ED, #FFEDD5)',
          marginBottom: '1rem',
          boxShadow: '0 4px 16px rgba(249,115,22,0.12)',
        }}>
          {icon}
        </div>
        <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 900, color: '#1F2937' }}>{title}</h2>
        <p style={{ marginTop: '0.5rem', color: '#6B7280', fontSize: '1rem', maxWidth: '36rem', margin: '0.5rem auto 0' }}>{subtitle}</p>
      </div>

      <div className="glass-card" style={{ padding: 'clamp(1.25rem, 3vw, 2rem)' }}>
        {children}
      </div>

      {/* ── Ad Banner ── */}
      <div style={{
        marginTop: '1.75rem',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
      }}>
        <div style={{
          width: '100%',
          maxWidth: '728px',
          height: '90px',
          borderRadius: '0.875rem',
          border: '2px dashed #FDBA74',
          background: 'rgba(255,255,255,0.6)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          overflow: 'hidden',
        }}>
          {/* 🔁 Replace this block with your ad code, e.g. Google AdSense */}
          <span style={{
            fontSize: '0.7rem',
            color: '#D1D5DB',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            fontWeight: 600,
            userSelect: 'none',
          }}>
            Advertisement · 728 × 90
          </span>
        </div>
      </div>
    </div>
  );
}
