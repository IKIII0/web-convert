// Shared error alert
export default function ErrorAlert({ message }) {
  if (!message) return null;
  return (
    <div style={{
      marginBottom: '1rem', padding: '0.875rem 1rem',
      borderRadius: '0.875rem', background: '#FEF2F2',
      border: '1px solid #FECACA', color: '#DC2626',
      fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
    }}>
      {message}
    </div>
  );
}
