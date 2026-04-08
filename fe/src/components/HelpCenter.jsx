import { useState } from 'react';
import { useLanguage } from '../LanguageContext';

const content = {
  en: {
    badge: 'Help Center',
    title: 'How can we help you?',
    subtitle: 'Find answers to common questions about using Convertmee.',
    categories: [
      {
        title: 'Getting Started',
        items: [
          { q: 'What is Convertmee?', a: 'Convertmee is a free all-in-one online converter. You can convert images, audio, video, documents, units, and colors — all in one place, with no registration required.' },
          { q: 'Is Convertmee free to use?', a: 'Yes, Convertmee is completely free. There are no hidden fees, subscriptions, or account requirements.' },
          { q: 'Do I need to create an account?', a: 'No. You can use all conversion tools without creating an account or logging in.' },
        ],
      },
      {
        title: 'File Conversion',
        items: [
          { q: 'What image formats are supported?', a: 'We support PNG, JPG, WebP, BMP, TIFF, and AVIF. You can convert between any of these formats.' },
          { q: 'What audio formats are supported?', a: 'We support MP3, WAV, OGG, FLAC, AAC, and M4A. Audio conversion runs entirely in your browser.' },
          { q: 'What video formats are supported?', a: 'We support MP4, WebM, AVI, MOV, MKV, and FLV. Video conversion runs entirely in your browser.' },
          { q: 'What document formats can I convert?', a: 'You can convert Word (.doc, .docx), Excel (.xls, .xlsx), and PowerPoint (.ppt, .pptx) files to PDF.' },
          { q: 'What is the maximum file size?', a: 'Image and document conversions support up to 50MB. Audio supports up to 100MB. Video supports up to 500MB.' },
        ],
      },
      {
        title: 'Privacy & Security',
        items: [
          { q: 'Are my files safe?', a: 'Yes. Audio and video files are processed entirely in your browser using WebAssembly — they never leave your device. For image, PDF, and document conversions, files are temporarily stored on our servers and automatically deleted within 1 hour.' },
          { q: 'Do you store my files permanently?', a: 'No. All server-side files are automatically deleted within 1 hour of conversion. We do not retain or share your files.' },
          { q: 'Is my data shared with third parties?', a: 'We do not sell or share your personal data or files with third parties. Please refer to our Privacy Policy for full details.' },
        ],
      },
      {
        title: 'Technical Issues',
        items: [
          { q: 'Why is my conversion taking so long?', a: 'Audio and video conversions run in your browser and may take longer depending on file size and your device\'s processing power. Large video files can take several minutes.' },
          { q: 'Why did my conversion fail?', a: 'This can happen if the file is corrupted, too large, or in an unsupported format. Try with a different file or refresh the page and try again.' },
          { q: 'Which browsers are supported?', a: 'Convertmee works best on modern browsers: Chrome, Firefox, Edge, and Safari. Make sure your browser is up to date for the best experience.' },
        ],
      },
    ],
  },
  id: {
    badge: 'Pusat Bantuan',
    title: 'Bagaimana kami bisa membantu?',
    subtitle: 'Temukan jawaban atas pertanyaan umum tentang penggunaan Convertmee.',
    categories: [
      {
        title: 'Memulai',
        items: [
          { q: 'Apa itu Convertmee?', a: 'Convertmee adalah konverter online gratis serba bisa. Anda dapat mengonversi gambar, audio, video, dokumen, satuan, dan warna — semuanya di satu tempat, tanpa perlu registrasi.' },
          { q: 'Apakah Convertmee gratis?', a: 'Ya, Convertmee sepenuhnya gratis. Tidak ada biaya tersembunyi, langganan, atau persyaratan akun.' },
          { q: 'Apakah saya perlu membuat akun?', a: 'Tidak. Anda dapat menggunakan semua alat konversi tanpa membuat akun atau masuk.' },
        ],
      },
      {
        title: 'Konversi File',
        items: [
          { q: 'Format gambar apa yang didukung?', a: 'Kami mendukung PNG, JPG, WebP, BMP, TIFF, dan AVIF. Anda dapat mengonversi antara format-format ini.' },
          { q: 'Format audio apa yang didukung?', a: 'Kami mendukung MP3, WAV, OGG, FLAC, AAC, dan M4A. Konversi audio berjalan sepenuhnya di browser Anda.' },
          { q: 'Format video apa yang didukung?', a: 'Kami mendukung MP4, WebM, AVI, MOV, MKV, dan FLV. Konversi video berjalan sepenuhnya di browser Anda.' },
          { q: 'Format dokumen apa yang bisa dikonversi?', a: 'Anda dapat mengonversi file Word (.doc, .docx), Excel (.xls, .xlsx), dan PowerPoint (.ppt, .pptx) ke PDF.' },
          { q: 'Berapa ukuran file maksimum?', a: 'Konversi gambar dan dokumen mendukung hingga 50MB. Audio mendukung hingga 100MB. Video mendukung hingga 500MB.' },
        ],
      },
      {
        title: 'Privasi & Keamanan',
        items: [
          { q: 'Apakah file saya aman?', a: 'Ya. File audio dan video diproses sepenuhnya di browser Anda menggunakan WebAssembly — tidak pernah meninggalkan perangkat Anda. Untuk konversi gambar, PDF, dan dokumen, file disimpan sementara di server kami dan dihapus otomatis dalam 1 jam.' },
          { q: 'Apakah file saya disimpan secara permanen?', a: 'Tidak. Semua file sisi server dihapus otomatis dalam 1 jam setelah konversi. Kami tidak menyimpan atau berbagi file Anda.' },
          { q: 'Apakah data saya dibagikan ke pihak ketiga?', a: 'Kami tidak menjual atau berbagi data pribadi atau file Anda dengan pihak ketiga. Silakan lihat Kebijakan Privasi kami untuk detail lengkap.' },
        ],
      },
      {
        title: 'Masalah Teknis',
        items: [
          { q: 'Mengapa konversi saya memakan waktu lama?', a: 'Konversi audio dan video berjalan di browser Anda dan mungkin memakan waktu lebih lama tergantung ukuran file dan kemampuan pemrosesan perangkat Anda. File video besar bisa memakan waktu beberapa menit.' },
          { q: 'Mengapa konversi saya gagal?', a: 'Ini bisa terjadi jika file rusak, terlalu besar, atau dalam format yang tidak didukung. Coba dengan file lain atau segarkan halaman dan coba lagi.' },
          { q: 'Browser apa yang didukung?', a: 'Convertmee bekerja paling baik di browser modern: Chrome, Firefox, Edge, dan Safari. Pastikan browser Anda sudah diperbarui untuk pengalaman terbaik.' },
        ],
      },
    ],
  },
};

function AccordionItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: '1px solid #F3F4F6' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{ width: '100%', textAlign: 'left', padding: '1rem 0', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', fontFamily: 'inherit' }}
      >
        <span style={{ fontSize: '0.95rem', fontWeight: 600, color: '#1F2937' }}>{q}</span>
        <span style={{ color: '#F97316', fontSize: '1.25rem', fontWeight: 300, flexShrink: 0, transition: 'transform 0.2s', transform: open ? 'rotate(45deg)' : 'rotate(0deg)' }}>+</span>
      </button>
      {open && (
        <div className="animate-fade-in" style={{ paddingBottom: '1rem', fontSize: '0.9rem', color: '#4B5563', lineHeight: 1.8 }}>
          {a}
        </div>
      )}
    </div>
  );
}

export default function HelpCenter() {
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

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {c.categories.map((cat, i) => (
          <div key={i} className="glass-card" style={{ padding: '1.5rem 1.75rem' }}>
            <h2 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#F97316', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
              {cat.title}
            </h2>
            {cat.items.map((item, j) => (
              <AccordionItem key={j} q={item.q} a={item.a} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
