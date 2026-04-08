// Shared action buttons (convert / download / new)
import { HiOutlineDownload, HiOutlineRefresh } from 'react-icons/hi';

export default function ActionButtons({
  converted, loading,
  onConvert, onDownload, onReset,
  convertLabel, downloadLabel, resetLabel,
}) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '0.25rem' }}>
      {!converted ? (
        <button
          onClick={onConvert}
          disabled={loading}
          className="btn-gradient"
          style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.9rem 1.5rem', borderRadius: '0.875rem', fontSize: '1rem', minWidth: '180px' }}
        >
          {loading ? (
            <><span className="spinner" />{convertLabel}</>
          ) : (
            <><HiOutlineRefresh style={{ width: '1.1rem', height: '1.1rem' }} />{convertLabel}</>
          )}
        </button>
      ) : (
        <>
          <button
            onClick={onDownload}
            className="btn-gradient"
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.9rem 1.5rem', borderRadius: '0.875rem', fontSize: '1rem' }}
          >
            <HiOutlineDownload style={{ width: '1.1rem', height: '1.1rem' }} />
            {downloadLabel}
          </button>
          <button
            onClick={onReset}
            className="btn-outline"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.9rem 1.25rem', borderRadius: '0.875rem', fontSize: '1rem' }}
          >
            <HiOutlineRefresh style={{ width: '1.1rem', height: '1.1rem' }} />
            {resetLabel}
          </button>
        </>
      )}
    </div>
  );
}
