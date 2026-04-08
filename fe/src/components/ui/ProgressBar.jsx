// Shared progress bar
export default function ProgressBar({ progress, label }) {
  return (
    <div style={{ marginBottom: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <span style={{ fontSize: '0.8rem', color: '#6B7280', fontWeight: 500 }}>{label}</span>
        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#F97316' }}>{progress}%</span>
      </div>
      <div style={{ height: '6px', background: '#F3F4F6', borderRadius: '9999px', overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${progress}%`,
          background: 'linear-gradient(90deg, #FB923C, #EA580C)',
          borderRadius: '9999px',
          transition: 'width 0.3s ease',
        }} />
      </div>
    </div>
  );
}
