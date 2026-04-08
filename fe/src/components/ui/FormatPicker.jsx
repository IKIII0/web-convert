// Shared format picker button group
export default function FormatPicker({ formats, selected, onChange, label }) {
  return (
    <div style={{ marginBottom: '1.5rem' }}>
      {label && (
        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>
          {label}
        </label>
      )}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        {formats.map((f) => (
          <button
            key={f}
            onClick={() => onChange(f)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '0.75rem',
              fontSize: '0.875rem',
              fontWeight: 600,
              transition: 'all 0.2s ease',
              border: 'none',
              cursor: 'pointer',
              background: selected === f ? 'linear-gradient(135deg, #F97316, #EA580C)' : '#F3F4F6',
              color: selected === f ? 'white' : '#4B5563',
              boxShadow: selected === f ? '0 4px 12px rgba(249,115,22,0.25)' : 'none',
              transform: selected === f ? 'translateY(-1px)' : 'none',
            }}
          >
            {f}
          </button>
        ))}
      </div>
    </div>
  );
}
