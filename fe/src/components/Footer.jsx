import { useState } from 'react';
import { HiOutlineHeart, HiOutlineMail } from 'react-icons/hi';
import { useLanguage } from '../LanguageContext';

export default function Footer({ setActiveTab }) {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
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
      onMouseEnter={(e) => e.target.style.color = '#FB923C'}
      onMouseLeave={(e) => e.target.style.color = '#9CA3AF'}
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
          <div style={{ gridColumn: 'span 1', minWidth: '240px' }}>
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1.25rem' }}>
              <div style={{
                width: '2.5rem',
                height: '2.5rem',
                borderRadius: '0.75rem',
                background: 'linear-gradient(135deg, #FB923C, #EA580C)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 16px rgba(249, 115, 22, 0.35)',
              }}>
                <span style={{ color: 'white', fontWeight: 900, fontSize: '1.1rem' }}>C</span>
              </div>
              <span style={{
                fontSize: '1.375rem',
                fontWeight: 800,
                background: 'linear-gradient(135deg, #FB923C, #F97316)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                ConvertHub
              </span>
            </div>
            <p style={{
              fontSize: '0.875rem',
              color: '#6B7280',
              lineHeight: 1.7,
              marginBottom: '1.5rem',
              maxWidth: '280px',
            }}>
              {t('footer.desc')}
            </p>
            {/* Social icons */}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {[
                { label: 'GitHub', path: 'M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.39.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5.99.1-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6.02 0c2.28-1.55 3.28-1.23 3.28-1.23.66 1.66.25 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.8 5.63-5.48 5.92.43.37.82 1.1.82 2.22v3.29c0 .32.22.7.82.58A12.01 12.01 0 0 0 24 12C24 5.37 18.63 0 12 0z' },
                { label: 'Twitter', path: 'M22.46 6c-.77.35-1.6.58-2.46.69a4.3 4.3 0 0 0 1.88-2.38 8.59 8.59 0 0 1-2.72 1.04 4.28 4.28 0 0 0-7.32 3.91A12.16 12.16 0 0 1 3.03 4.9a4.28 4.28 0 0 0 1.33 5.72 4.26 4.26 0 0 1-1.94-.53v.05a4.28 4.28 0 0 0 3.43 4.2 4.27 4.27 0 0 1-1.93.07 4.29 4.29 0 0 0 4 2.98A8.59 8.59 0 0 1 2 19.54a12.13 12.13 0 0 0 6.56 1.92c7.88 0 12.2-6.53 12.2-12.2 0-.19 0-.37-.02-.56A8.7 8.7 0 0 0 22.46 6z' },
                { label: 'Instagram', path: 'M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.97.25 2.43.41.61.24 1.05.52 1.51.98.46.46.74.9.98 1.51.17.46.36 1.26.41 2.43.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.97-.41 2.43-.24.61-.52 1.05-.98 1.51-.46.46-.9.74-1.51.98-.46.17-1.26.36-2.43.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.97-.25-2.43-.41a4.06 4.06 0 0 1-1.51-.98 4.06 4.06 0 0 1-.98-1.51c-.17-.46-.36-1.26-.41-2.43C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.97.41-2.43.24-.61.52-1.05.98-1.51a4.06 4.06 0 0 1 1.51-.98c.46-.17 1.26-.36 2.43-.41C8.42 2.17 8.8 2.16 12 2.16M12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63a5.98 5.98 0 0 0-2.16 1.35A5.98 5.98 0 0 0 .63 4.14C.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91a5.98 5.98 0 0 0 1.35 2.16 5.98 5.98 0 0 0 2.16 1.35c.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56a5.98 5.98 0 0 0 2.16-1.35 5.98 5.98 0 0 0 1.35-2.16c.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91a5.98 5.98 0 0 0-1.35-2.16A5.98 5.98 0 0 0 19.86.63C19.1.33 18.22.13 16.95.07 15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.4-11.85a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z' },
              ].map((social) => (
                <button
                  key={social.label}
                  title={social.label}
                  style={{
                    width: '2.25rem',
                    height: '2.25rem',
                    borderRadius: '0.625rem',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    color: '#6B7280',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(249, 115, 22, 0.15)';
                    e.currentTarget.style.borderColor = 'rgba(249, 115, 22, 0.3)';
                    e.currentTarget.style.color = '#FB923C';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                    e.currentTarget.style.color = '#6B7280';
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d={social.path} /></svg>
                </button>
              ))}
            </div>
          </div>

          {/* Tools Column */}
          <div>
            <h4 style={headingStyle}>{t('footer.tools')}</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <FooterLink onClick={() => setActiveTab?.('image')}>{t('footer.toolImage')}</FooterLink>
              <FooterLink onClick={() => setActiveTab?.('pdf')}>{t('footer.toolPdf')}</FooterLink>
              <FooterLink onClick={() => setActiveTab?.('unit')}>{t('footer.toolUnit')}</FooterLink>
              <FooterLink onClick={() => setActiveTab?.('color')}>{t('footer.toolColor')}</FooterLink>
            </div>
          </div>

          {/* Company Column */}
          <div>
            <h4 style={headingStyle}>{t('footer.company')}</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <FooterLink>{t('footer.about')}</FooterLink>
              <FooterLink>{t('footer.blog')}</FooterLink>
              <FooterLink>{t('footer.careers')}</FooterLink>
              <FooterLink>{t('footer.contact')}</FooterLink>
            </div>
          </div>

          {/* Support Column */}
          <div>
            <h4 style={headingStyle}>{t('footer.support')}</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <FooterLink>{t('footer.helpCenter')}</FooterLink>
              <FooterLink>{t('footer.privacy')}</FooterLink>
              <FooterLink>{t('footer.terms')}</FooterLink>
              <FooterLink>{t('footer.faq')}</FooterLink>
            </div>
          </div>

          {/* Newsletter Column */}
          <div style={{ minWidth: '240px' }}>
            <h4 style={headingStyle}>{t('footer.newsletter')}</h4>
            <p style={{ fontSize: '0.875rem', color: '#6B7280', lineHeight: 1.6, marginBottom: '1rem' }}>
              {t('footer.newsletterDesc')}
            </p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <HiOutlineMail style={{
                  position: 'absolute',
                  left: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '1.1rem',
                  height: '1.1rem',
                  color: '#4B5563',
                }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('footer.emailPlaceholder')}
                  style={{
                    width: '100%',
                    padding: '0.7rem 0.75rem 0.7rem 2.5rem',
                    borderRadius: '0.625rem',
                    border: '1px solid rgba(255,255,255,0.1)',
                    background: 'rgba(255,255,255,0.05)',
                    color: '#E5E7EB',
                    fontSize: '0.8rem',
                    outline: 'none',
                    transition: 'border-color 0.2s ease',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'rgba(249, 115, 22, 0.5)'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
              </div>
              <button
                style={{
                  padding: '0.7rem 1.25rem',
                  borderRadius: '0.625rem',
                  border: 'none',
                  background: 'linear-gradient(135deg, #F97316, #EA580C)',
                  color: 'white',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap',
                  boxShadow: '0 2px 12px rgba(249, 115, 22, 0.3)',
                  fontFamily: 'inherit',
                }}
                onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 20px rgba(249, 115, 22, 0.45)'}
                onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 2px 12px rgba(249, 115, 22, 0.3)'}
              >
                {t('footer.subscribe')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '1.5rem',
      }}>
        <div style={{
          maxWidth: '80rem',
          margin: '0 auto',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem',
        }}>
          <p style={{ fontSize: '0.8rem', color: '#4B5563' }}>
            &copy; {year} {t('footer.copyright')}
          </p>
          <p style={{
            fontSize: '0.8rem',
            color: '#4B5563',
            display: 'flex',
            alignItems: 'center',
            gap: '0.375rem',
          }}>
            {t('footer.madeWith')}
            <HiOutlineHeart style={{ width: '0.9rem', height: '0.9rem', color: '#EF4444' }} />
            {t('footer.inIndonesia')}
          </p>
        </div>
      </div>
    </footer>
  );
}
