import { HiOutlinePhotograph, HiOutlineDocumentText, HiOutlineScale, HiOutlineColorSwatch, HiOutlineMusicNote, HiOutlineFilm } from 'react-icons/hi';
import { useLanguage } from '../LanguageContext';

export default function Hero({ setActiveTab }) {
  const { t } = useLanguage();

  const features = [
    {
      icon: <HiOutlinePhotograph className="w-7 h-7" />,
      title: t('hero.imageConverter'),
      desc: t('hero.imageConverterDesc'),
      tab: 'image',
    },
    {
      icon: <HiOutlineDocumentText className="w-7 h-7" />,
      title: t('hero.pdfTools'),
      desc: t('hero.pdfToolsDesc'),
      tab: 'pdf',
    },
    {
      icon: <HiOutlineMusicNote className="w-7 h-7" />,
      title: t('hero.audioConverter'),
      desc: t('hero.audioConverterDesc'),
      tab: 'audio',
    },
    {
      icon: <HiOutlineFilm className="w-7 h-7" />,
      title: t('hero.videoConverter'),
      desc: t('hero.videoConverterDesc'),
      tab: 'video',
    },
    {
      icon: <HiOutlineScale className="w-7 h-7" />,
      title: t('hero.unitConverter'),
      desc: t('hero.unitConverterDesc'),
      tab: 'unit',
    },
    {
      icon: <HiOutlineColorSwatch className="w-7 h-7" />,
      title: t('hero.colorConverter'),
      desc: t('hero.colorConverterDesc'),
      tab: 'color',
    },
  ];

  const stats = [
    { value: '10+', label: t('hero.imageFormats') },
    { value: '6+', label: t('hero.audioFormats') },
    { value: '6+', label: t('hero.videoFormats') },
    { value: '50+', label: t('hero.unitTypes') },
    { value: '3', label: t('hero.colorModels') },
    { value: '100%', label: t('hero.free') },
  ];

  return (
    <section className="hero-gradient" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '6rem 1.5rem 4rem' }}>
      {/* Badge */}
      <div className="animate-fade-in-up" style={{ animationDelay: '0.1s', opacity: 0, marginBottom: '1.5rem' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.375rem 1rem', borderRadius: '9999px', background: '#FFF7ED', color: '#C2410C', fontSize: '0.875rem', fontWeight: 600 }}>
          {t('hero.badge')}
        </span>
      </div>

      {/* Title */}
      <h1 className="animate-fade-in-up" style={{ animationDelay: '0.2s', opacity: 0, fontSize: 'clamp(2.25rem, 5vw, 4.5rem)', fontWeight: 900, textAlign: 'center', maxWidth: '56rem', lineHeight: 1.1, color: '#1F2937' }}>
        {t('hero.titleConvert')}{' '}
        <span style={{ background: 'linear-gradient(135deg, #F97316, #FB923C, #EA580C)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          {t('hero.titleEverything')}
        </span>
        <br />
        {t('hero.titleInOnePlace')}
      </h1>

      {/* Subtitle */}
      <p className="animate-fade-in-up" style={{ animationDelay: '0.35s', opacity: 0, marginTop: '1.5rem', fontSize: 'clamp(1rem, 2vw, 1.25rem)', color: '#6B7280', textAlign: 'center', maxWidth: '36rem', lineHeight: 1.7 }}>
        {t('hero.subtitle')}
      </p>

      {/* CTA Buttons */}
      <div className="animate-fade-in-up" style={{ animationDelay: '0.5s', opacity: 0, marginTop: '2.5rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem' }}>
        <button
          onClick={() => setActiveTab('image')}
          className="btn-gradient animate-pulse-orange"
          style={{ fontSize: '1.1rem', padding: '1rem 2rem', borderRadius: '1rem' }}
        >
          {t('hero.startConverting')} →
        </button>
        <button
          onClick={() => {
            document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="btn-outline"
          style={{ fontSize: '1.1rem', padding: '0.9rem 1.9rem', borderRadius: '1rem' }}
        >
          {t('hero.exploreFeatures')}
        </button>
      </div>

      {/* Ad Banner Space */}
      <div className="animate-fade-in-up" style={{ animationDelay: '0.6s', opacity: 0, marginTop: '2.5rem', width: '100%', maxWidth: '728px' }}>
        <div style={{
          width: '100%',
          height: '90px',
          borderRadius: '0.75rem',
          border: '2px dashed #FDBA74',
          background: 'rgba(255,255,255,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(4px)',
        }}>
          {/* Replace this div with your ad code e.g. Google AdSense */}
          <span style={{ fontSize: '0.75rem', color: '#D1D5DB', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>
            Advertisement · 728 × 90
          </span>
        </div>
      </div>

      {/* Feature Cards */}
      <div id="features" style={{ marginTop: 'clamp(4rem, 8vw, 7rem)', width: '100%', maxWidth: '72rem', padding: '0 1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
          {features.map((f, i) => (
            <div
              key={f.tab}
              className="glass-card animate-fade-in-up"
              style={{ animationDelay: `${0.6 + i * 0.1}s`, opacity: 0, padding: '1.75rem', cursor: 'pointer', display: 'flex', flexDirection: 'column' }}
              onClick={() => setActiveTab(f.tab)}
            >
              <div style={{ width: '3.5rem', height: '3.5rem', borderRadius: '1rem', background: 'linear-gradient(135deg, #FFF7ED, #FFEDD5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F97316', marginBottom: '1rem', transition: 'transform 0.3s ease', flexShrink: 0 }}>
                {f.icon}
              </div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#1F2937', marginBottom: '0.5rem' }}>{f.title}</h3>
              <p style={{ fontSize: '0.875rem', color: '#6B7280', lineHeight: 1.6, flex: 1 }}>{f.desc}</p>
              <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#F97316', fontSize: '0.875rem', fontWeight: 600 }}>
                {t('hero.openTool')}
                <span style={{ transition: 'transform 0.3s ease' }}>→</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="animate-fade-in-up" style={{ animationDelay: '1s', opacity: 0, marginTop: '4rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '2rem', maxWidth: '60rem', width: '100%', textAlign: 'center' }}>
        {stats.map((stat, i) => (
          <div key={i}>
            <div style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 900, background: 'linear-gradient(135deg, #F97316, #EA580C)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {stat.value}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#6B7280', marginTop: '0.25rem', fontWeight: 500 }}>{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
