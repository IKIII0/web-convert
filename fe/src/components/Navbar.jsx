import { useState, useEffect, useRef } from 'react';
import { HiMenu, HiX, HiChevronDown } from 'react-icons/hi';
import { useLanguage } from '../LanguageContext';

export default function Navbar({ activeTab, setActiveTab }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const { lang, setLang, t } = useLanguage();
  const langRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close lang dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const tabs = [
    { id: 'image', label: t('nav.image') },
    { id: 'pdf', label: t('nav.pdf') },
    { id: 'document', label: t('nav.document') },
    { id: 'audio', label: t('nav.audio') },
    { id: 'video', label: t('nav.video') },
    { id: 'unit', label: t('nav.unit') },
    { id: 'color', label: t('nav.color') },
  ];

  const languages = [
    { code: 'en', label: 'English', flag: 'EN' },
    { code: 'id', label: 'Indonesia', flag: 'ID' },
  ];

  const currentLang = languages.find((l) => l.code === lang);

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        transition: 'all 0.3s ease',
        background: scrolled ? 'rgba(255,255,255,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
        boxShadow: scrolled ? '0 4px 30px rgba(249, 115, 22, 0.06)' : 'none',
      }}
    >
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 clamp(1rem, 3vw, 2rem)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '4.5rem' }}>
          {/* Logo */}
          <div
            style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', cursor: 'pointer' }}
            onClick={() => {
              setActiveTab('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <div style={{
              width: '2.5rem',
              height: '2.5rem',
              borderRadius: '0.75rem',
              background: 'linear-gradient(135deg, #FB923C, #EA580C)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(249, 115, 22, 0.3)',
              transition: 'all 0.3s ease',
            }}>
              <span style={{ color: 'white', fontWeight: 900, fontSize: '1.25rem' }}>C</span>
            </div>
            <span style={{ fontSize: '1.5rem', fontWeight: 800, background: 'linear-gradient(135deg, #F97316, #C2410C)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Convertmee
            </span>
          </div>

          {/* Desktop Tabs + Language */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem',
              background: 'rgba(243, 244, 246, 0.8)',
              borderRadius: '0.875rem',
              padding: '0.375rem',
            }}
              className="desktop-tabs"
            >
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '0.625rem',
                    fontWeight: 500,
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    border: 'none',
                    whiteSpace: 'nowrap',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.375rem',
                    background: activeTab === tab.id ? 'linear-gradient(135deg, #F97316, #EA580C)' : 'transparent',
                    color: activeTab === tab.id ? 'white' : '#6B7280',
                    boxShadow: activeTab === tab.id ? '0 4px 12px rgba(249, 115, 22, 0.3)' : 'none',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Language Dropdown */}
            <div ref={langRef} style={{ position: 'relative' }} className="desktop-tabs">
              <button
                onClick={() => setLangOpen(!langOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '0.625rem',
                  border: '1px solid #E5E7EB',
                  background: 'rgba(255,255,255,0.8)',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: '#374151',
                  transition: 'all 0.2s ease',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <span style={{
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #F97316, #EA580C)',
                  color: 'white',
                  padding: '0.125rem 0.375rem',
                  borderRadius: '0.25rem',
                  letterSpacing: '0.05em',
                }}>{currentLang?.flag}</span>
                <HiChevronDown style={{
                  width: '0.875rem',
                  height: '0.875rem',
                  transition: 'transform 0.2s ease',
                  transform: langOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                }} />
              </button>
              {langOpen && (
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 0.5rem)',
                  right: 0,
                  background: 'white',
                  borderRadius: '0.75rem',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.12), 0 2px 10px rgba(0,0,0,0.06)',
                  border: '1px solid #F3F4F6',
                  overflow: 'hidden',
                  minWidth: '10rem',
                  animation: 'slideDown 0.2s ease-out forwards',
                  zIndex: 100,
                }}>
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setLang(l.code);
                        setLangOpen(false);
                      }}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.625rem',
                        padding: '0.75rem 1rem',
                        border: 'none',
                        background: lang === l.code ? '#FFF7ED' : 'transparent',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        fontWeight: lang === l.code ? 600 : 400,
                        color: lang === l.code ? '#EA580C' : '#374151',
                        transition: 'all 0.15s ease',
                        textAlign: 'left',
                      }}
                      onMouseEnter={(e) => {
                        if (lang !== l.code) e.currentTarget.style.background = '#F9FAFB';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = lang === l.code ? '#FFF7ED' : 'transparent';
                      }}
                    >
                      <span style={{
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        background: lang === l.code ? 'linear-gradient(135deg, #F97316, #EA580C)' : '#E5E7EB',
                        color: lang === l.code ? 'white' : '#6B7280',
                        padding: '0.125rem 0.375rem',
                        borderRadius: '0.25rem',
                        letterSpacing: '0.05em',
                      }}>{l.flag}</span>
                      {l.label}
                      {lang === l.code && (
                        <span style={{ marginLeft: 'auto', color: '#F97316', fontSize: '0.75rem' }}>&#10003;</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{
              display: 'none',
              padding: '0.5rem',
              borderRadius: '0.5rem',
              color: '#4B5563',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            {mobileOpen ? <HiX size={24} /> : <HiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div style={{
          background: 'rgba(255,255,255,0.97)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid #FFEDD5',
          animation: 'slideDown 0.3s ease-out forwards',
        }}
          className="mobile-menu"
        >
          <div style={{ padding: '0.75rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setMobileOpen(false);
                }}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.75rem',
                  fontWeight: 500,
                  transition: 'all 0.2s ease',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.95rem',
                  background: activeTab === tab.id ? 'linear-gradient(135deg, #F97316, #EA580C)' : 'transparent',
                  color: activeTab === tab.id ? 'white' : '#4B5563',
                  boxShadow: activeTab === tab.id ? '0 4px 12px rgba(249, 115, 22, 0.25)' : 'none',
                }}
              >
                {tab.label}
              </button>
            ))}

            {/* Mobile Language Selector */}
            <div style={{ borderTop: '1px solid #F3F4F6', marginTop: '0.375rem', paddingTop: '0.75rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '0 1rem', display: 'block', marginBottom: '0.375rem' }}>Language</span>
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => {
                    setLang(l.code);
                  }}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '0.625rem 1rem',
                    borderRadius: '0.75rem',
                    fontWeight: lang === l.code ? 600 : 400,
                    transition: 'all 0.2s ease',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.875rem',
                    background: lang === l.code ? '#FFF7ED' : 'transparent',
                    color: lang === l.code ? '#EA580C' : '#4B5563',
                  }}
                >
                  <span style={{
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    background: lang === l.code ? 'linear-gradient(135deg, #F97316, #EA580C)' : '#E5E7EB',
                    color: lang === l.code ? 'white' : '#6B7280',
                    padding: '0.125rem 0.375rem',
                    borderRadius: '0.25rem',
                  }}>{l.flag}</span>
                  {l.label}
                  {lang === l.code && (
                    <span style={{ marginLeft: 'auto', color: '#F97316' }}>&#10003;</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
