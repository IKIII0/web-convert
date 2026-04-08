import { useLanguage } from '../LanguageContext';

const LAST_UPDATED = 'April 8, 2026';

const content = {
  en: {
    badge: 'Legal Document',
    title: 'Terms of Service',
    lastUpdated: `Last updated: ${LAST_UPDATED}`,
    intro: 'Please read these Terms of Service carefully before using Convertmee. By accessing or using our Service, you agree to be bound by these terms.',
    effective: `These Terms of Service are effective as of ${LAST_UPDATED} and apply to all users of Convertmee.`,
    sections: [
      { title: 'Acceptance of Terms', body: 'By accessing or using Convertmee ("the Service"), you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site. We reserve the right to update or modify these Terms at any time without prior notice. Your continued use of the Service following any changes constitutes your acceptance of the new Terms.' },
      { title: 'Description of Service', body: 'Convertmee provides a free online file conversion service that allows users to convert images, audio files, video files, documents, and perform unit and color conversions. Audio and video conversions are processed entirely within your browser using WebAssembly technology. Other conversions may be processed via our backend servers. The Service is provided "as is" and we reserve the right to modify, suspend, or discontinue any part of the Service at any time.' },
      { title: 'File Ownership and Privacy', body: 'Your files are yours. These Terms do not give us any rights to your files except for the limited rights that enable us to offer the Service. For server-side conversions (images, PDFs, documents), files are temporarily stored solely for the purpose of processing your conversion request. All uploaded files are automatically deleted from our servers within 1 hour of conversion. Audio and video files are never uploaded to our servers — they are processed entirely in your browser and never leave your device.' },
      { title: 'Prohibited Use', body: 'As a condition of your use of this Service, you warrant that you will not use the Service for any purpose that is unlawful or prohibited by these Terms. You agree not to:\n- Upload, convert, or distribute any content that infringes on the copyrights, trademarks, or other intellectual property rights of any third party.\n- Use the Service to circumvent technological protection measures (TPMs) or digital rights management (DRM) systems, including content from streaming platforms such as YouTube, Netflix, or Spotify.\n- Upload any content containing malware, viruses, or any other malicious code.\n- Attempt to gain unauthorized access to any portion of the Service or its related systems.\n- Use automated tools, bots, or scripts to access the Service in a manner that places excessive load on our infrastructure.' },
      { title: 'Copyright and Intellectual Property', body: 'Users are solely responsible for ensuring they have the legal right to convert any files they upload or process through the Service. Convertmee does not condone copyright infringement and will cooperate with rights holders and law enforcement in investigating any alleged violations. The Convertmee name, logo, and all related content on this website are the intellectual property of Convertmee and may not be used without prior written permission.' },
      { title: 'Disclaimer of Warranties', body: 'The Service is provided on an "as is" and "as available" basis without any warranties of any kind, either express or implied. We do not warrant that the Service will be uninterrupted, error-free, or completely secure. We do not guarantee the accuracy, completeness, or reliability of any conversion output. You use the Service entirely at your own risk.' },
      { title: 'Limitation of Liability', body: 'To the fullest extent permitted by applicable law, Convertmee shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of data, loss of profits, or business interruption, arising out of or in connection with your use of or inability to use the Service.' },
      { title: 'Links to Third-Party Sites', body: 'The Service may contain links to third-party websites or services that are not owned or controlled by Convertmee. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites.' },
      { title: 'Termination', body: 'We reserve the right to terminate or restrict your access to the Service at any time, without notice, for conduct that we believe violates these Terms of Service or is harmful to other users, us, or third parties.' },
      { title: 'Governing Law', body: 'These Terms shall be governed by and construed in accordance with the laws of the Republic of Indonesia. Any disputes arising under or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts located in Indonesia.' },
      { title: 'Changes to Terms', body: 'We reserve the right to modify these Terms of Service at any time. We will indicate the date of the most recent revision at the top of this page. Your continued use of the Service after any changes constitutes your acceptance of the new Terms.' },
      { title: 'Contact Us', body: 'If you have any questions about these Terms of Service, please contact us at:\n\nConvertmee\nEmail: legal@convertmee.com\nWebsite: https://convertmee.com' },
    ],
  },
  id: {
    badge: 'Dokumen Hukum',
    title: 'Syarat Layanan',
    lastUpdated: `Terakhir diperbarui: ${LAST_UPDATED}`,
    intro: 'Harap baca Syarat Layanan ini dengan seksama sebelum menggunakan Convertmee. Dengan mengakses atau menggunakan Layanan kami, Anda setuju untuk terikat oleh syarat-syarat ini.',
    effective: `Syarat Layanan ini berlaku sejak ${LAST_UPDATED} dan berlaku untuk semua pengguna Convertmee.`,
    sections: [
      { title: 'Penerimaan Syarat', body: 'Dengan mengakses atau menggunakan Convertmee ("Layanan"), Anda setuju untuk terikat oleh Syarat Layanan ini dan semua hukum serta peraturan yang berlaku. Jika Anda tidak setuju dengan syarat-syarat ini, Anda dilarang menggunakan atau mengakses situs ini. Kami berhak memperbarui atau mengubah Syarat ini kapan saja tanpa pemberitahuan sebelumnya.' },
      { title: 'Deskripsi Layanan', body: 'Convertmee menyediakan layanan konversi file online gratis yang memungkinkan pengguna mengonversi gambar, file audio, file video, dokumen, serta melakukan konversi satuan dan warna. Konversi audio dan video diproses sepenuhnya di browser Anda menggunakan teknologi WebAssembly. Konversi lainnya dapat diproses melalui server kami. Layanan disediakan "sebagaimana adanya" dan kami berhak mengubah, menangguhkan, atau menghentikan bagian mana pun dari Layanan kapan saja.' },
      { title: 'Kepemilikan File dan Privasi', body: 'File Anda adalah milik Anda. Syarat ini tidak memberikan kami hak apa pun atas file Anda kecuali hak terbatas yang memungkinkan kami menawarkan Layanan. Untuk konversi sisi server (gambar, PDF, dokumen), file disimpan sementara hanya untuk memproses permintaan konversi Anda. Semua file yang diunggah secara otomatis dihapus dari server kami dalam 1 jam setelah konversi. File audio dan video tidak pernah diunggah ke server kami — semuanya diproses di browser Anda dan tidak pernah meninggalkan perangkat Anda.' },
      { title: 'Penggunaan yang Dilarang', body: 'Sebagai syarat penggunaan Layanan ini, Anda menjamin bahwa Anda tidak akan menggunakan Layanan untuk tujuan apa pun yang melanggar hukum atau dilarang oleh Syarat ini. Anda setuju untuk tidak:\n- Mengunggah, mengonversi, atau mendistribusikan konten yang melanggar hak cipta, merek dagang, atau hak kekayaan intelektual pihak ketiga.\n- Menggunakan Layanan untuk menghindari langkah-langkah perlindungan teknologi (TPM) atau sistem manajemen hak digital (DRM), termasuk konten dari platform streaming seperti YouTube, Netflix, atau Spotify.\n- Mengunggah konten yang mengandung malware, virus, atau kode berbahaya lainnya.\n- Mencoba mendapatkan akses tidak sah ke bagian mana pun dari Layanan atau sistem terkaitnya.\n- Menggunakan alat otomatis, bot, atau skrip untuk mengakses Layanan dengan cara yang membebani infrastruktur kami.' },
      { title: 'Hak Cipta dan Kekayaan Intelektual', body: 'Pengguna sepenuhnya bertanggung jawab untuk memastikan mereka memiliki hak hukum untuk mengonversi file yang mereka unggah atau proses melalui Layanan. Convertmee tidak mentolerir pelanggaran hak cipta dan akan bekerja sama dengan pemegang hak dan penegak hukum dalam menyelidiki dugaan pelanggaran. Nama Convertmee, logo, dan semua konten terkait di situs web ini adalah kekayaan intelektual Convertmee dan tidak boleh digunakan tanpa izin tertulis sebelumnya.' },
      { title: 'Penafian Garansi', body: 'Layanan disediakan atas dasar "sebagaimana adanya" dan "sebagaimana tersedia" tanpa jaminan apa pun, baik tersurat maupun tersirat. Kami tidak menjamin bahwa Layanan akan tidak terputus, bebas kesalahan, atau sepenuhnya aman. Kami tidak menjamin keakuratan, kelengkapan, atau keandalan output konversi apa pun. Anda menggunakan Layanan sepenuhnya atas risiko Anda sendiri.' },
      { title: 'Batasan Tanggung Jawab', body: 'Sejauh yang diizinkan oleh hukum yang berlaku, Convertmee tidak bertanggung jawab atas kerusakan tidak langsung, insidental, khusus, konsekuensial, atau hukuman, termasuk namun tidak terbatas pada kehilangan data, kehilangan keuntungan, atau gangguan bisnis, yang timbul dari atau sehubungan dengan penggunaan atau ketidakmampuan Anda menggunakan Layanan.' },
      { title: 'Tautan ke Situs Pihak Ketiga', body: 'Layanan mungkin berisi tautan ke situs web atau layanan pihak ketiga yang tidak dimiliki atau dikendalikan oleh Convertmee. Kami tidak memiliki kendali atas, dan tidak bertanggung jawab atas, konten, kebijakan privasi, atau praktik situs web pihak ketiga mana pun.' },
      { title: 'Penghentian', body: 'Kami berhak untuk menghentikan atau membatasi akses Anda ke Layanan kapan saja, tanpa pemberitahuan, untuk perilaku yang kami yakini melanggar Syarat Layanan ini atau merugikan pengguna lain, kami, atau pihak ketiga.' },
      { title: 'Hukum yang Berlaku', body: 'Syarat ini diatur oleh dan ditafsirkan sesuai dengan hukum Republik Indonesia. Setiap sengketa yang timbul berdasarkan atau sehubungan dengan Syarat ini tunduk pada yurisdiksi eksklusif pengadilan yang berlokasi di Indonesia.' },
      { title: 'Perubahan Syarat', body: 'Kami berhak mengubah Syarat Layanan ini kapan saja. Kami akan mencantumkan tanggal revisi terbaru di bagian atas halaman ini. Penggunaan Layanan Anda yang berkelanjutan setelah perubahan apa pun merupakan penerimaan Anda terhadap Syarat baru.' },
      { title: 'Hubungi Kami', body: 'Jika Anda memiliki pertanyaan tentang Syarat Layanan ini, silakan hubungi kami di:\n\nConvertmee\nEmail: legal@convertmee.com\nWebsite: https://convertmee.com' },
    ],
  },
};

export default function TermsOfService() {
  const { lang } = useLanguage();
  const c = content[lang] || content.en;

  return (
    <div style={{ maxWidth: '52rem', margin: '0 auto' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', padding: '0.375rem 1rem', borderRadius: '9999px', background: '#FFF7ED', color: '#EA580C', fontSize: '0.8rem', fontWeight: 600, marginBottom: '1.25rem' }}>
          {c.badge}
        </div>
        <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 900, color: '#1F2937', lineHeight: 1.2 }}>
          {c.title}
        </h1>
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
