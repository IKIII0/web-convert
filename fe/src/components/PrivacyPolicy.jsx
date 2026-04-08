import { useLanguage } from '../LanguageContext';

const LAST_UPDATED = 'April 8, 2026';

const content = {
  en: {
    badge: 'Legal Document',
    title: 'Privacy Policy',
    lastUpdated: `Last updated: ${LAST_UPDATED}`,
    intro: 'At Convertmee, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your information when you use our Service.',
    effective: `This Privacy Policy is effective as of ${LAST_UPDATED}.`,
    sections: [
      { title: 'Information We Collect', body: 'We collect minimal information necessary to provide our Service:\n- Files you upload for conversion (temporarily, deleted within 1 hour)\n- Basic usage data such as pages visited and features used (anonymized)\n- Browser type and device information for technical compatibility\n\nWe do not collect your name, email address, or any personally identifiable information unless you voluntarily contact us.' },
      { title: 'How We Use Your Information', body: 'We use the information we collect solely to:\n- Process your file conversion requests\n- Improve the performance and reliability of our Service\n- Diagnose and fix technical issues\n- Analyze anonymized usage patterns to enhance user experience\n\nWe do not use your data for advertising profiling or sell it to third parties.' },
      { title: 'File Storage and Deletion', body: 'Audio and video files are processed entirely in your browser using WebAssembly technology and are never uploaded to our servers. For image, PDF, and document conversions, files are temporarily stored on our servers only for the duration of the conversion process. All uploaded files are automatically and permanently deleted within 1 hour of conversion, regardless of whether the conversion was successful.' },
      { title: 'Cookies and Tracking', body: 'Convertmee uses minimal cookies necessary for the Service to function, such as language preference settings. We may use anonymized analytics tools to understand how users interact with our Service. We do not use tracking cookies for advertising purposes. You can disable cookies in your browser settings, though this may affect some functionality.' },
      { title: 'Third-Party Services', body: 'We may use third-party services to help operate our Service, including:\n- Cloud hosting providers for server infrastructure\n- Analytics services for anonymized usage data\n- Content delivery networks (CDN) for performance\n\nThese providers are contractually obligated to protect your data and may not use it for their own purposes.' },
      { title: 'Data Security', body: 'We implement industry-standard security measures to protect your data, including HTTPS encryption for all data in transit. However, no method of transmission over the internet is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.' },
      { title: 'Children\'s Privacy', body: 'Convertmee is not directed at children under the age of 13. We do not knowingly collect personal information from children under 13. If you believe a child has provided us with personal information, please contact us and we will delete it promptly.' },
      { title: 'Your Rights', body: 'Depending on your location, you may have the right to:\n- Access the personal data we hold about you\n- Request correction of inaccurate data\n- Request deletion of your data\n- Object to processing of your data\n\nTo exercise these rights, please contact us at legal@convertmee.com.' },
      { title: 'Changes to This Policy', body: 'We may update this Privacy Policy from time to time. We will notify you of any significant changes by updating the date at the top of this page. Your continued use of the Service after changes constitutes your acceptance of the updated policy.' },
      { title: 'Contact Us', body: 'If you have any questions about this Privacy Policy, please contact us at:\n\nConvertmee\nEmail: legal@convertmee.com\nWebsite: https://convertmee.com' },
    ],
  },
  id: {
    badge: 'Dokumen Hukum',
    title: 'Kebijakan Privasi',
    lastUpdated: `Terakhir diperbarui: ${LAST_UPDATED}`,
    intro: 'Di Convertmee, kami menganggap serius privasi Anda. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi Anda saat menggunakan Layanan kami.',
    effective: `Kebijakan Privasi ini berlaku sejak ${LAST_UPDATED}.`,
    sections: [
      { title: 'Informasi yang Kami Kumpulkan', body: 'Kami mengumpulkan informasi minimal yang diperlukan untuk menyediakan Layanan kami:\n- File yang Anda unggah untuk konversi (sementara, dihapus dalam 1 jam)\n- Data penggunaan dasar seperti halaman yang dikunjungi dan fitur yang digunakan (dianonimkan)\n- Jenis browser dan informasi perangkat untuk kompatibilitas teknis\n\nKami tidak mengumpulkan nama, alamat email, atau informasi identitas pribadi apa pun kecuali Anda secara sukarela menghubungi kami.' },
      { title: 'Cara Kami Menggunakan Informasi Anda', body: 'Kami menggunakan informasi yang kami kumpulkan semata-mata untuk:\n- Memproses permintaan konversi file Anda\n- Meningkatkan kinerja dan keandalan Layanan kami\n- Mendiagnosis dan memperbaiki masalah teknis\n- Menganalisis pola penggunaan yang dianonimkan untuk meningkatkan pengalaman pengguna\n\nKami tidak menggunakan data Anda untuk pembuatan profil iklan atau menjualnya kepada pihak ketiga.' },
      { title: 'Penyimpanan dan Penghapusan File', body: 'File audio dan video diproses sepenuhnya di browser Anda menggunakan teknologi WebAssembly dan tidak pernah diunggah ke server kami. Untuk konversi gambar, PDF, dan dokumen, file disimpan sementara di server kami hanya selama proses konversi berlangsung. Semua file yang diunggah dihapus secara otomatis dan permanen dalam 1 jam setelah konversi, terlepas dari apakah konversi berhasil atau tidak.' },
      { title: 'Cookie dan Pelacakan', body: 'Convertmee menggunakan cookie minimal yang diperlukan agar Layanan berfungsi, seperti pengaturan preferensi bahasa. Kami mungkin menggunakan alat analitik yang dianonimkan untuk memahami cara pengguna berinteraksi dengan Layanan kami. Kami tidak menggunakan cookie pelacakan untuk tujuan periklanan. Anda dapat menonaktifkan cookie di pengaturan browser Anda, meskipun ini dapat memengaruhi beberapa fungsi.' },
      { title: 'Layanan Pihak Ketiga', body: 'Kami mungkin menggunakan layanan pihak ketiga untuk membantu mengoperasikan Layanan kami, termasuk:\n- Penyedia hosting cloud untuk infrastruktur server\n- Layanan analitik untuk data penggunaan yang dianonimkan\n- Jaringan pengiriman konten (CDN) untuk kinerja\n\nPenyedia ini secara kontraktual berkewajiban untuk melindungi data Anda dan tidak boleh menggunakannya untuk tujuan mereka sendiri.' },
      { title: 'Keamanan Data', body: 'Kami menerapkan langkah-langkah keamanan standar industri untuk melindungi data Anda, termasuk enkripsi HTTPS untuk semua data dalam transit. Namun, tidak ada metode transmisi melalui internet yang 100% aman. Meskipun kami berusaha melindungi informasi Anda, kami tidak dapat menjamin keamanan mutlak.' },
      { title: 'Privasi Anak-Anak', body: 'Convertmee tidak ditujukan untuk anak-anak di bawah usia 13 tahun. Kami tidak secara sengaja mengumpulkan informasi pribadi dari anak-anak di bawah 13 tahun. Jika Anda yakin seorang anak telah memberikan informasi pribadi kepada kami, silakan hubungi kami dan kami akan segera menghapusnya.' },
      { title: 'Hak Anda', body: 'Tergantung lokasi Anda, Anda mungkin memiliki hak untuk:\n- Mengakses data pribadi yang kami simpan tentang Anda\n- Meminta koreksi data yang tidak akurat\n- Meminta penghapusan data Anda\n- Menolak pemrosesan data Anda\n\nUntuk menggunakan hak-hak ini, silakan hubungi kami di legal@convertmee.com.' },
      { title: 'Perubahan Kebijakan Ini', body: 'Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu. Kami akan memberi tahu Anda tentang perubahan signifikan dengan memperbarui tanggal di bagian atas halaman ini. Penggunaan Layanan Anda yang berkelanjutan setelah perubahan merupakan penerimaan Anda terhadap kebijakan yang diperbarui.' },
      { title: 'Hubungi Kami', body: 'Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini, silakan hubungi kami di:\n\nConvertmee\nEmail: legal@convertmee.com\nWebsite: https://convertmee.com' },
    ],
  },
};

export default function PrivacyPolicy() {
  const { lang } = useLanguage();
  const c = content[lang] || content.en;

  return (
    <div style={{ maxWidth: '52rem', margin: '0 auto' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', padding: '0.375rem 1rem', borderRadius: '9999px', background: '#FFF7ED', color: '#EA580C', fontSize: '0.8rem', fontWeight: 600, marginBottom: '1.25rem' }}>
          {c.badge}
        </div>
        <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 900, color: '#1F2937', lineHeight: 1.2 }}>{c.title}</h1>
        <p style={{ marginTop: '0.5rem', color: '#9CA3AF', fontSize: '0.85rem' }}>{c.lastUpdated}</p>
        <p style={{ marginTop: '1rem', color: '#4B5563', fontSize: '0.95rem', lineHeight: 1.7, padding: '1rem 1.25rem', background: '#FFF7ED', borderRadius: '0.875rem', border: '1px solid #FFEDD5' }}>
          {c.intro}
        </p>
      </div>

      <div>
        {c.sections.map((section, index) => (
          <div key={index} style={{ padding: '1.75rem 0', borderBottom: index < c.sections.length - 1 ? '1px solid #F3F4F6' : 'none' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{ width: '2rem', height: '2rem', borderRadius: '0.5rem', background: 'linear-gradient(135deg, #F97316, #EA580C)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.75rem', fontWeight: 800, flexShrink: 0, marginTop: '0.1rem' }}>
                {index + 1}
              </div>
              <div style={{ flex: 1 }}>
                <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1F2937', marginBottom: '0.75rem' }}>{section.title}</h2>
                <div style={{ fontSize: '0.9rem', color: '#4B5563', lineHeight: 1.8 }}>
                  {section.body.split('\n').map((line, i) =>
                    line.trim() === '' ? <br key={i} /> :
                    line.startsWith('- ') ? (
                      <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.375rem' }}>
                        <span style={{ color: '#F97316', fontWeight: 700, flexShrink: 0 }}>—</span>
                        <span>{line.slice(2)}</span>
                      </div>
                    ) : <p key={i} style={{ marginBottom: '0.5rem' }}>{line}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '2.5rem', padding: '1.25rem', borderRadius: '0.875rem', background: '#F9FAFB', border: '1px solid #F3F4F6', textAlign: 'center' }}>
        <p style={{ fontSize: '0.85rem', color: '#6B7280' }}>{c.effective}</p>
        <p style={{ fontSize: '0.85rem', color: '#9CA3AF', marginTop: '0.375rem' }}>
          &copy; {new Date().getFullYear()} Convertmee. {lang === 'id' ? 'Hak cipta dilindungi.' : 'All rights reserved.'}
        </p>
      </div>
    </div>
  );
}
