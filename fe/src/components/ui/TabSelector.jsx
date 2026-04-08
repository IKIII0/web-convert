// Shared tab/mode selector
export default function TabSelector({ tabs, active, onChange }) {
  return (
    <div style={{
      display: 'flex', gap: '0.375rem', marginBottom: '1.75rem',
      background: '#F3F4F6', padding: '0.375rem', borderRadius: '0.875rem',
      flexWrap: 'wrap',
    }}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          style={{
            flex: 1,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem',
            padding: '0.625rem 0.75rem',
            borderRadius: '0.625rem',
            fontSize: '0.875rem', fontWeight: 600,
            transition: 'all 0.2s ease',
            border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
            background: active === tab.id ? 'linear-gradient(135deg, #F97316, #EA580C)' : 'transparent',
            color: active === tab.id ? 'white' : '#6B7280',
            boxShadow: active === tab.id ? '0 4px 12px rgba(249,115,22,0.25)' : 'none',
          }}
        >
          {tab.icon && <span style={{ fontSize: '1rem' }}>{tab.icon}</span>}
          {tab.label}
        </button>
      ))}
    </div>
  );
}
