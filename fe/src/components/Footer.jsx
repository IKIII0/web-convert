import { useLanguage } from '../LanguageContext';

export default function Footer({ setActiveTab }) {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  const linkStyle = {
    fontSize: '0.875rem',
    color: '#9CA3AF',
    cursor: 'pointer',
    transition: 'color 0.2s ease',
    textDecoration: 'none',
    display: 'block',
    padding: '0.25rem 0',
  };

  const headingStyle = {
    fontSize: '0.8rem',
    fontWeight: 700,
    color: '#F97316',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    marginBottom: '1.25rem',
  };

  const FooterLink = ({ children, onClick }) => (
    <span
      style={linkStyle}
      onClick={onClick}
      onMouseEnter={(e) => e.currentTarget.style.color = '#FB923C'}
      onMouseLeave={(e) => e.currentTarget.style.color = '#9CA3AF'}
    >
      {children}
    </span>
  );

  return (
    <footer style={{
      background: 'linear-gradient(180deg, #0F0F0F, #080808)',
      borderTop: '1px solid rgba(249, 115, 22, 0.1)',
    }}>
      {/* Main Footer */}
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '4rem 1.5rem 3rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '3rem',
        }}>

          {/* Brand Column */}
          <div style={{ minWidth: '240px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1.25rem' }}>
              <div style={{
                width: '2.5rem', height: '2.5rem', borderRadius: '0.75rem',
                background: 'linear-gradient(135deg, #FB923C, #EA580C)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 16px rgba(249, 115, 22, 0.35)',
              }}>
                <span style={{ color: 'white', fontWeight: 900, fontSize: '1.1rem' }}>M</span>
              </div>
              <span style={{
                fontSize: '1.375rem', fontWeight: 800,
                background: 'linear-gradient(135deg, #FB923C, #F97316)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>
                Convertmee
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', color: '#6B7280', lineHeight: 1.7, maxWidth: '280px' }}>
              {t('footer.desc')}
            </p>
          </div>

          {/* Tools Column */}
          <div>
            <h4 style={headingStyle}>{t('footer.tools')}</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <FooterLink onClick={() => setActiveTab?.('image')}>{t('footer.toolImage')}</FooterLink>
              <FooterLink onClick={() => setActiveTab?.('pdf')}>{t('footer.toolPdf')}</FooterLink>
              <FooterLink onClick={() => setActiveTab?.('audio')}>{t('footer.toolAudio')}</FooterLink>
              <FooterLink onClick={() => setActiveTab?.('video')}>{t('footer.toolVideo')}</FooterLink>
              <FooterLink onClick={() => setActiveTab?.('unit')}>{t('footer.toolUnit')}</FooterLink>
              <FooterLink onClick={() => setActiveTab?.('color')}>{t('footer.toolColor')}</FooterLink>
            </div>
          </div>

          {/* Company Column */}
          <div>
            <h4 style={headingStyle}>{t('footer.company')}</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <FooterLink onClick={() => setActiveTab?.('about')}>{t('footer.about')}</FooterLink>
              <FooterLink onClick={() => setActiveTab?.('blog')}>{t('footer.blog')}</FooterLink>
              <FooterLink onClick={() => setActiveTab?.('contact')}>{t('footer.contact')}</FooterLink>
            </div>
          </div>

          {/* Support Column */}
          <div>
            <h4 style={headingStyle}>{t('footer.support')}</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <FooterLink onClick={() => setActiveTab?.('help')}>{t('footer.helpCenter')}</FooterLink>
              <FooterLink onClick={() => setActiveTab?.('privacy')}>{t('footer.privacy')}</FooterLink>
              <FooterLink onClick={() => setActiveTab?.('terms')}>{t('footer.terms')}</FooterLink>
              <FooterLink onClick={() => setActiveTab?.('faq')}>{t('footer.faq')}</FooterLink>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '1.25rem 1.5rem' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: '0.8rem', color: '#4B5563' }}>
            &copy; {year} {t('footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
}
