// Shared file info row
import { HiOutlineX } from 'react-icons/hi';

export default function FileInfo({ name, size, icon, onRemove, index }) {
  const sizeStr = size > 1024 * 1024
    ? `${(size / (1024 * 1024)).toFixed(2)} MB`
    : `${(size / 1024).toFixed(1)} KB`;

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '0.75rem',
      padding: '0.75rem 1rem', borderRadius: '0.875rem',
      background: '#FFF7ED', border: '1px solid #FFEDD5',
    }}>
      {index !== undefined ? (
        <div style={{
          width: '2rem', height: '2rem', borderRadius: '0.5rem',
          background: 'linear-gradient(135deg, #F97316, #EA580C)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white', fontSize: '0.75rem', fontWeight: 700, flexShrink: 0,
        }}>
          {index + 1}
        </div>
      ) : (
        <div style={{ color: '#F97316', flexShrink: 0 }}>{icon}</div>
      )}
      <div style={{ minWidth: 0, flex: 1 }}>
        <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1F2937', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</p>
        <p style={{ fontSize: '0.75rem', color: '#9CA3AF', marginTop: '0.1rem' }}>{sizeStr}</p>
      </div>
      {onRemove && (
        <button
          onClick={onRemove}
          style={{
            width: '1.75rem', height: '1.75rem', borderRadius: '50%',
            background: 'white', border: '1px solid #F3F4F6',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#9CA3AF', cursor: 'pointer', flexShrink: 0,
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#FEF2F2'; e.currentTarget.style.color = '#EF4444'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = '#9CA3AF'; }}
        >
          <HiOutlineX style={{ width: '0.875rem', height: '0.875rem' }} />
        </button>
      )}
    </div>
  );
}
