import { useLanguage } from '../LanguageContext';

const content = {
  en: {
    badge: 'Contact',
    title: 'Contact Us',
    subtitle: 'Having trouble with the website? We\'re here to help.',
    cardTitle: 'Report an Issue',
    cardDesc: 'If the website is experiencing errors or cannot be accessed, please contact us at:',
    email: 'admin@convertmee.com',
    note: 'We typically respond within 1–2 business days. Please describe the issue you\'re experiencing so we can help you faster.',
    infoTitle: 'Before contacting us, try:',
    tips: [
      'Refreshing the page (Ctrl + R or Cmd + R)',
      'Clearing your browser cache and cookies',
      'Trying a different browser (Chrome, Firefox, Edge)',
      'Checking your internet connection',
    ],
  },
  id: {
    badge: 'Kontak',
    title: 'Hubungi Kami',
    subtitle: 'Website bermasalah? Kami siap membantu.',
    cardTitle: 'Laporkan Masalah',
    cardDesc: 'Jika website mengalami error atau tidak bisa dibuka, silahkan hubungi kontak kami disini:',
    email: 'admin@convertmee.com',
    note: 'Kami biasanya merespons dalam 1–2 hari kerja. Mohon jelaskan masalah yang Anda alami agar kami dapat membantu lebih cepat.',
    infoTitle: 'Sebelum menghubungi kami, coba:',
    tips: [
      'Muat ulang halaman (Ctrl + R atau Cmd + R)',
      'Hapus cache dan cookie browser Anda',
      'Coba browser lain (Chrome, Firefox, Edge)',
      'Periksa koneksi internet Anda',
    ],
  },
};

export default function Contact() {
  const { lang } = useLanguage();
  const c = content[lang] || content.en;

  return (
    <div style={{ maxWidth: '52rem', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', padding: '0.375rem 1rem', borderRadius: '9999px', background: '#FFF7ED', color: '#EA580C', fontSize: '0.8rem', fontWeight: 600, marginBottom: '1.25rem' }}>
          {c.badge}
        </div>
        <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.25rem)', fontWeight: 900, color: '#1F2937' }}>{c.title}</h1>
        <p style={{ marginTop: '0.5rem', color: '#6B7280', fontSize: '0.95rem' }}>{c.subtitle}</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Email card */}
        <div className="glass-card" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1F2937', marginBottom: '0.625rem' }}>{c.cardTitle}</h2>
          <p style={{ fontSize: '0.9rem', color: '#6B7280', lineHeight: 1.7, marginBottom: '1.25rem' }}>{c.cardDesc}</p>

          <a
            href={`mailto:${c.email}`}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.75rem',
              padding: '0.875rem 1.5rem', borderRadius: '0.875rem',
              background: 'linear-gradient(135deg, #F97316, #EA580C)',
              color: 'white', textDecoration: 'none',
              fontSize: '1rem', fontWeight: 700,
              boxShadow: '0 4px 14px rgba(249,115,22,0.3)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 6px 20px rgba(249,115,22,0.45)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 4px 14px rgba(249,115,22,0.3)'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
            {c.email}
          </a>

          <p style={{ marginTop: '1rem', fontSize: '0.8rem', color: '#9CA3AF', lineHeight: 1.6 }}>{c.note}</p>
        </div>

        {/* Tips card */}
        <div style={{ padding: '1.5rem', borderRadius: '0.875rem', background: '#F9FAFB', border: '1px solid #F3F4F6' }}>
          <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#374151', marginBottom: '0.875rem' }}>{c.infoTitle}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {c.tips.map((tip, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', fontSize: '0.875rem', color: '#4B5563' }}>
                <div style={{ width: '1.25rem', height: '1.25rem', borderRadius: '50%', background: 'linear-gradient(135deg, #F97316, #EA580C)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </div>
                {tip}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
