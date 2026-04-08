// Shared dropzone component
import { useDropzone } from 'react-dropzone';

export default function Dropzone({ onDrop, accept, maxSize, multiple = false, icon, title, subtitle, hint }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles: multiple ? undefined : 1,
    maxSize,
    multiple,
  });

  return (
    <div
      {...getRootProps()}
      className={`dropzone ${isDragActive ? 'active' : ''}`}
      style={{ textAlign: 'center', cursor: 'pointer' }}
    >
      <input {...getInputProps()} />
      <div className="animate-float" style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
        {icon}
      </div>
      <p style={{ fontSize: '1rem', fontWeight: 600, color: '#374151' }}>
        {isDragActive ? 'Drop files here...' : title}
      </p>
      {subtitle && (
        <p style={{ marginTop: '0.375rem', fontSize: '0.875rem', color: '#9CA3AF' }}>{subtitle}</p>
      )}
      {hint && (
        <p style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#D1D5DB', background: '#F9FAFB', display: 'inline-block', padding: '0.25rem 0.75rem', borderRadius: '9999px', marginTop: '0.75rem' }}>{hint}</p>
      )}
    </div>
  );
}
