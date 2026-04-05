import { useState } from 'react';
import './index.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ImageConverter from './components/ImageConverter';
import PdfConverter from './components/PdfConverter';
import UnitConverter from './components/UnitConverter';
import ColorConverter from './components/ColorConverter';
import Footer from './components/Footer';
import { useLanguage } from './LanguageContext';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const { t } = useLanguage();

  const renderContent = () => {
    switch (activeTab) {
      case 'image':
        return <ImageConverter />;
      case 'pdf':
        return <PdfConverter />;
      case 'unit':
        return <UnitConverter />;
      case 'color':
        return <ColorConverter />;
      default:
        return <Hero setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#FAFAFA' }}>
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main style={{ flex: 1 }}>
        {activeTab === 'home' ? (
          renderContent()
        ) : (
          <div style={{ paddingTop: '6.5rem', paddingBottom: '4rem', paddingLeft: 'clamp(1.5rem, 5vw, 5rem)', paddingRight: 'clamp(1.5rem, 5vw, 5rem)', maxWidth: '80rem', margin: '0 auto', width: '100%' }}>
            {/* Back to home */}
            <div style={{ maxWidth: '48rem', margin: '0 auto 1.5rem auto' }}>
              <button
                onClick={() => setActiveTab('home')}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: '#9CA3AF',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  padding: '0.5rem 0',
                  transition: 'color 0.2s ease',
                  fontFamily: 'inherit',
                }}
                onMouseEnter={(e) => e.target.style.color = '#F97316'}
                onMouseLeave={(e) => e.target.style.color = '#9CA3AF'}
              >
                <span>←</span> {t('backToHome')}
              </button>
            </div>
            <div className="animate-fade-in-up">
              {renderContent()}
            </div>
          </div>
        )}
      </main>

      <Footer setActiveTab={setActiveTab} />
    </div>
  );
}