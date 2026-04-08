import { useState } from 'react';
import { useLanguage } from '../LanguageContext';

const content = {
  en: {
    badge: 'FAQ',
    title: 'Frequently Asked Questions',
    subtitle: 'Everything you need to know about Convertmee.',
    items: [
      { q: 'Is Convertmee completely free?', a: 'Yes. Convertmee is 100% free with no hidden fees, no subscriptions, and no account required.' },
      { q: 'Do I need to install anything?', a: 'No installation needed. Convertmee runs entirely in your web browser.' },
      { q: 'Are my files private and secure?', a: 'Absolutely. Audio and video files are processed in your browser and never uploaded to our servers. Image, PDF, and document files are temporarily stored and automatically deleted within 1 hour.' },
      { q: 'What image formats can I convert?', a: 'PNG, JPG, WebP, BMP, TIFF, and AVIF. You can convert between any of these formats.' },
      { q: 'What audio formats are supported?', a: 'MP3, WAV, OGG, FLAC, AAC, and M4A. All audio conversion happens in your browser.' },
      { q: 'What video formats are supported?', a: 'MP4, WebM, AVI, MOV, MKV, and FLV. All video conversion happens in your browser.' },
      { q: 'Can I convert Word, Excel, or PowerPoint to PDF?', a: 'Yes. The Document Converter supports .doc, .docx, .xls, .xlsx, .ppt, and .pptx files.' },
      { q: 'Why is video conversion slow?', a: 'Video conversion runs in your browser using WebAssembly. Speed depends on your device\'s CPU. Large files may take several minutes.' },
      { q: 'How many files can I convert at once?', a: 'Most tools support one file at a time. The PDF merger supports up to 20 files, and Images to PDF supports multiple images.' },
      { q: 'What units can I convert?', a: 'We support 9 categories: Length, Weight, Temperature, Volume, Area, Speed, Time, Data, Energy, and Pressure — with 50+ units total.' },
      { q: 'What color formats does the Color Converter support?', a: 'HEX, RGB, HSL, CMYK, and CSS rgba. All values update in real time as you adjust the input.' },
      { q: 'Can I use Convertmee on mobile?', a: 'Yes. Convertmee is fully responsive and works on smartphones and tablets.' },
    ],
  },
  id: {
    badge: 'FAQ',
    title: 'Pertanyaan yang Sering Diajukan',
    subtitle: 'Semua yang perlu Anda ketahui tentang Convertmee.',
    items: [
      { q: 'Apakah Convertmee benar-benar gratis?', a: 'Ya. Convertmee 100% gratis tanpa biaya tersembunyi, tanpa langganan, dan tanpa perlu akun.' },
      { q: 'Apakah saya perlu menginstal sesuatu?', a: 'Tidak perlu instalasi. Convertmee berjalan sepenuhnya di browser web Anda.' },
      { q: 'Apakah file saya aman dan privat?', a: 'Tentu saja. File audio dan video diproses di browser Anda dan tidak pernah diunggah ke server kami. File gambar, PDF, dan dokumen disimpan sementara dan dihapus otomatis dalam 1 jam.' },
      { q: 'Format gambar apa yang bisa dikonversi?', a: 'PNG, JPG, WebP, BMP, TIFF, dan AVIF. Anda dapat mengonversi antara format-format ini.' },
      { q: 'Format audio apa yang didukung?', a: 'MP3, WAV, OGG, FLAC, AAC, dan M4A. Semua konversi audio terjadi di browser Anda.' },
      { q: 'Format video apa yang didukung?', a: 'MP4, WebM, AVI, MOV, MKV, dan FLV. Semua konversi video terjadi di browser Anda.' },
      { q: 'Bisakah saya mengonversi Word, Excel, atau PowerPoint ke PDF?', a: 'Ya. Konverter Dokumen mendukung file .doc, .docx, .xls, .xlsx, .ppt, dan .pptx.' },
      { q: 'Mengapa konversi video lambat?', a: 'Konversi video berjalan di browser Anda menggunakan WebAssembly. Kecepatan tergantung pada CPU perangkat Anda. File besar mungkin memakan waktu beberapa menit.' },
      { q: 'Berapa banyak file yang bisa dikonversi sekaligus?', a: 'Sebagian besar alat mendukung satu file sekaligus. Penggabung PDF mendukung hingga 20 file, dan Gambar ke PDF mendukung beberapa gambar.' },
      { q: 'Satuan apa saja yang bisa dikonversi?', a: 'Kami mendukung 9 kategori: Panjang, Berat, Suhu, Volume, Luas, Kecepatan, Waktu, Data, Energi, dan Tekanan — dengan total 50+ satuan.' },
      { q: 'Format warna apa yang didukung Konverter Warna?', a: 'HEX, RGB, HSL, CMYK, dan CSS rgba. Semua nilai diperbarui secara real time saat Anda menyesuaikan input.' },
      { q: 'Bisakah saya menggunakan Convertmee di ponsel?', a: 'Ya. Convertmee sepenuhnya responsif dan bekerja di smartphone dan tablet.' },
    ],
  },
};

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: '1px solid #F3F4F6' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{ width: '100%', textAlign: 'left', padding: '1.1rem 0', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', fontFamily: 'inherit' }}
      >
        <span style={{ fontSize: '0.95rem', fontWeight: 600, color: '#1F2937' }}>{q}</span>
        <span style={{ color: '#F97316', fontSize: '1.25rem', fontWeight: 300, flexShrink: 0, transition: 'transform 0.2s ease', transform: open ? 'rotate(45deg)' : 'rotate(0deg)', display: 'inline-block' }}>+</span>
      </button>
      {open && (
        <div className="animate-fade-in" style={{ paddingBottom: '1rem', fontSize: '0.9rem', color: '#4B5563', lineHeight: 1.8 }}>
          {a}
        </div>
      )}
    </div>
  );
}

export default function FAQ() {
  const { lang } = useLanguage();
  const c = content[lang] || content.en;

  return (
    <div style={{ maxWidth: '52rem', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', padding: '0.375rem 1rem', borderRadius: '9999px', background: '#FFF7ED', color: '#EA580C', fontSize: '0.8rem', fontWeight: 600, marginBottom: '1.25rem' }}>
          {c.badge}
        </div>
        <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.25rem)', fontWeight: 900, color: '#1F2937' }}>{c.title}</h1>
        <p style={{ marginTop: '0.5rem', color: '#6B7280', fontSize: '0.95rem' }}>{c.subtitle}</p>
      </div>

      <div className="glass-card" style={{ padding: '0.5rem 1.75rem' }}>
        {c.items.map((item, i) => (
          <FAQItem key={i} q={item.q} a={item.a} />
        ))}
      </div>
    </div>
  );
}
