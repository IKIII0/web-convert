import { useLanguage } from '../LanguageContext';

const content = {
  en: {
    badge: 'About Us',
    title: 'About Convertmee',
    desc: 'Convertmee.com is a digital platform designed to convert files or values from one format to another. This website is very popular because users do not need to install additional software on their devices — simply upload a file, process it, and download the result.',
    featuresTitle: 'What We Offer',
    features: [
      { title: 'Image Converter', desc: 'Convert between PNG, JPG, WebP, BMP, TIFF, and AVIF instantly.' },
      { title: 'Audio Converter', desc: 'Convert MP3, WAV, OGG, FLAC, AAC, and M4A — all in your browser.' },
      { title: 'Video Converter', desc: 'Convert MP4, AVI, MOV, MKV, WebM, and FLV without uploading to a server.' },
      { title: 'PDF Tools', desc: 'Convert images to PDF, PDF to images, or merge multiple PDFs.' },
      { title: 'Document Converter', desc: 'Convert Word, Excel, and PowerPoint files to PDF.' },
      { title: 'Unit Converter', desc: 'Convert 50+ units across 9 categories including length, weight, temperature, and more.' },
      { title: 'Color Converter', desc: 'Convert between HEX, RGB, HSL, CMYK, and CSS rgba in real time.' },
    ],
    whyTitle: 'Why Convertmee?',
    why: [
      { title: 'No Installation', desc: 'Everything runs in your browser. No software to download or install.' },
      { title: '100% Free', desc: 'All tools are completely free with no hidden fees or subscriptions.' },
      { title: 'Privacy First', desc: 'Audio and video files never leave your device. Other files are deleted within 1 hour.' },
      { title: 'Fast & Simple', desc: 'Clean interface designed for speed. Upload, convert, download — done.' },
    ],
  },
  id: {
    badge: 'Tentang Kami',
    title: 'Tentang Convertmee',
    desc: 'Convertmee.com adalah platform digital yang dirancang untuk mengubah format satu file atau nilai ke format lainnya. Website ini sangat populer karena pengguna tidak perlu menginstal perangkat lunak (software) tambahan di perangkat mereka, cukup unggah file, proses, dan unduh hasilnya.',
    featuresTitle: 'Apa yang Kami Tawarkan',
    features: [
      { title: 'Konversi Gambar', desc: 'Konversi antara PNG, JPG, WebP, BMP, TIFF, dan AVIF secara instan.' },
      { title: 'Konversi Audio', desc: 'Konversi MP3, WAV, OGG, FLAC, AAC, dan M4A — semuanya di browser Anda.' },
      { title: 'Konversi Video', desc: 'Konversi MP4, AVI, MOV, MKV, WebM, dan FLV tanpa mengunggah ke server.' },
      { title: 'Alat PDF', desc: 'Konversi gambar ke PDF, PDF ke gambar, atau gabungkan beberapa PDF.' },
      { title: 'Konversi Dokumen', desc: 'Konversi file Word, Excel, dan PowerPoint ke PDF.' },
      { title: 'Konversi Satuan', desc: 'Konversi 50+ satuan dalam 9 kategori termasuk panjang, berat, suhu, dan lainnya.' },
      { title: 'Konversi Warna', desc: 'Konversi antara HEX, RGB, HSL, CMYK, dan CSS rgba secara real time.' },
    ],
    whyTitle: 'Mengapa Convertmee?',
    why: [
      { title: 'Tanpa Instalasi', desc: 'Semuanya berjalan di browser Anda. Tidak perlu mengunduh atau menginstal software.' },
      { title: '100% Gratis', desc: 'Semua alat sepenuhnya gratis tanpa biaya tersembunyi atau langganan.' },
      { title: 'Privasi Utama', desc: 'File audio dan video tidak pernah meninggalkan perangkat Anda. File lain dihapus dalam 1 jam.' },
      { title: 'Cepat & Sederhana', desc: 'Antarmuka bersih yang dirancang untuk kecepatan. Unggah, konversi, unduh — selesai.' },
    ],
  },
};

export default function About() {
  const { lang } = useLanguage();
  const c = content[lang] || content.en;

  return (
    <div style={{ maxWidth: '52rem', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', padding: '0.375rem 1rem', borderRadius: '9999px', background: '#FFF7ED', color: '#EA580C', fontSize: '0.8rem', fontWeight: 600, marginBottom: '1.25rem' }}>
          {c.badge}
        </div>
        <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.25rem)', fontWeight: 900, color: '#1F2937', lineHeight: 1.2 }}>{c.title}</h1>
        <p style={{ marginTop: '1rem', fontSize: '1rem', color: '#4B5563', lineHeight: 1.8, padding: '1.25rem', background: '#FFF7ED', borderRadius: '0.875rem', border: '1px solid #FFEDD5' }}>
          {c.desc}
        </p>
      </div>

      {/* Why section */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#F97316', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>
          {c.whyTitle}
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          {c.why.map((item, i) => (
            <div key={i} className="glass-card" style={{ padding: '1.25rem 1.5rem' }}>
              <div style={{ width: '2.25rem', height: '2.25rem', borderRadius: '0.625rem', background: 'linear-gradient(135deg, #FFF7ED, #FFEDD5)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }}>
                <div style={{ width: '0.625rem', height: '0.625rem', borderRadius: '50%', background: 'linear-gradient(135deg, #F97316, #EA580C)' }} />
              </div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1F2937', marginBottom: '0.375rem' }}>{item.title}</h3>
              <p style={{ fontSize: '0.85rem', color: '#6B7280', lineHeight: 1.6 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Features list */}
      <div>
        <h2 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#F97316', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>
          {c.featuresTitle}
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {c.features.map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 0', borderBottom: i < c.features.length - 1 ? '1px solid #F3F4F6' : 'none' }}>
              <div style={{ width: '2rem', height: '2rem', borderRadius: '0.5rem', background: 'linear-gradient(135deg, #F97316, #EA580C)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.7rem', fontWeight: 800, flexShrink: 0 }}>
                {i + 1}
              </div>
              <div>
                <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1F2937' }}>{f.title}</p>
                <p style={{ fontSize: '0.85rem', color: '#6B7280', marginTop: '0.1rem' }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
