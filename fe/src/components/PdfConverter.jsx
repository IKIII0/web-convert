import { useState, useCallback } from 'react';
import axios from 'axios';
import { HiOutlineDocumentText, HiOutlinePhotograph } from 'react-icons/hi';
import { useLanguage } from '../LanguageContext';
import ConverterLayout from './ui/ConverterLayout';
import Dropzone from './ui/Dropzone';
import FileInfo from './ui/FileInfo';
import ActionButtons from './ui/ActionButtons';
import ErrorAlert from './ui/ErrorAlert';
import TabSelector from './ui/TabSelector';

const API = 'https://web-convert-be.vercel.app/api/convert';

const MODES = [
  { id: 'images-to-pdf', label: 'Images → PDF', icon: '🖼️' },
  { id: 'pdf-to-images', label: 'PDF → Images', icon: '📄' },
  { id: 'merge', label: 'Merge PDFs', icon: '🔗' },
];

export default function PdfConverter() {
  const [mode, setMode] = useState('images-to-pdf');
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState(null);
  const [resultType, setResultType] = useState('');
  const [error, setError] = useState('');
  const { t } = useLanguage();

  const isImageMode = mode === 'images-to-pdf';
  const accept = isImageMode ? { 'image/*': [] } : { 'application/pdf': ['.pdf'] };

  const onDrop = useCallback((newFiles) => {
    setFiles((prev) => [...prev, ...newFiles]);
    setResultUrl(null);
    setError('');
  }, []);

  const handleModeChange = (m) => {
    setMode(m);
    setFiles([]);
    setResultUrl(null);
    setError('');
  };

  const handleConvert = async () => {
    if (!files.length) return;
    if (mode === 'merge' && files.length < 2) { setError(t('pdfConv.errorMinFiles')); return; }
    setLoading(true);
    setError('');
    try {
      const fd = new FormData();
      files.forEach((f) => fd.append('files', f));
      const endpoints = { 'images-to-pdf': '/pdf/from-images', merge: '/pdf/merge', 'pdf-to-images': '/pdf/to-images' };
      const res = await axios.post(`${API}${endpoints[mode]}`, fd, { responseType: 'blob' });
      const type = res.headers['content-type'] || 'application/pdf';
      setResultType(type);
      setResultUrl(URL.createObjectURL(new Blob([res.data], { type })));
    } catch {
      setError(t('pdfConv.errorProcess'));
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = resultUrl;
    link.download = mode === 'pdf-to-images'
      ? (resultType === 'image/png' ? 'converted-page.png' : 'converted-images.zip')
      : mode === 'merge' ? 'merged.pdf' : 'converted.pdf';
    link.click();
  };

  const handleReset = () => { setFiles([]); setResultUrl(null); setResultType(''); setError(''); };

  const convertLabel = loading ? t('pdfConv.processing')
    : mode === 'images-to-pdf' ? t('pdfConv.convertToPdf')
    : mode === 'merge' ? t('pdfConv.mergePdfs')
    : t('pdfConv.convertToImages');

  const downloadLabel = mode === 'pdf-to-images' ? t('pdfConv.downloadImages') : t('pdfConv.downloadPdf');

  return (
    <ConverterLayout
      icon={<HiOutlineDocumentText style={{ width: '2rem', height: '2rem', color: '#F97316' }} />}
      title={t('pdfConv.title')}
      subtitle={t('pdfConv.subtitle')}
    >
      <TabSelector tabs={MODES} active={mode} onChange={handleModeChange} />

      <Dropzone
        onDrop={onDrop}
        accept={accept}
        maxSize={50 * 1024 * 1024}
        multiple
        icon={isImageMode
          ? <HiOutlinePhotograph style={{ width: '3.5rem', height: '3.5rem', color: '#FDBA74' }} />
          : <HiOutlineDocumentText style={{ width: '3.5rem', height: '3.5rem', color: '#FDBA74' }} />
        }
        title={isImageMode ? t('pdfConv.dropImages') : t('pdfConv.dropPdfs')}
        hint={isImageMode ? t('pdfConv.supportsImages') : mode === 'merge' ? t('pdfConv.selectPdfs') : t('pdfConv.supportsPdfs')}
      />

      {files.length > 0 && (
        <div className="animate-fade-in" style={{ marginTop: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {files.length} {t('pdfConv.filesSelected')}
            </span>
            <button
              onClick={handleReset}
              style={{ fontSize: '0.8rem', color: '#9CA3AF', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', transition: 'color 0.2s' }}
              onMouseEnter={(e) => e.target.style.color = '#EF4444'}
              onMouseLeave={(e) => e.target.style.color = '#9CA3AF'}
            >
              {t('pdfConv.clearAll')}
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {files.map((f, i) => (
              <FileInfo key={i} name={f.name} size={f.size} index={i} onRemove={() => setFiles((p) => p.filter((_, idx) => idx !== i))} />
            ))}
          </div>
        </div>
      )}

      {files.length > 0 && (
        <div style={{ marginTop: '1.5rem' }}>
          <ErrorAlert message={error} />
          <ActionButtons
            converted={resultUrl}
            loading={loading}
            onConvert={handleConvert}
            onDownload={handleDownload}
            onReset={handleReset}
            convertLabel={convertLabel}
            downloadLabel={downloadLabel}
            resetLabel={t('pdfConv.new')}
          />
        </div>
      )}

      {!files.length && error && <div style={{ marginTop: '1rem' }}><ErrorAlert message={error} /></div>}
    </ConverterLayout>
  );
}
