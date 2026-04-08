import { useState, useCallback } from 'react';
import axios from 'axios';
import { HiOutlinePhotograph } from 'react-icons/hi';
import { useLanguage } from '../LanguageContext';
import ConverterLayout from './ui/ConverterLayout';
import Dropzone from './ui/Dropzone';
import FormatPicker from './ui/FormatPicker';
import FileInfo from './ui/FileInfo';
import ActionButtons from './ui/ActionButtons';
import ErrorAlert from './ui/ErrorAlert';

const API = 'https://web-convert-be.vercel.app/api/convert';
const FORMATS = ['PNG', 'JPG', 'WebP', 'BMP', 'TIFF', 'AVIF'];

export default function ImageConverter() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [format, setFormat] = useState('PNG');
  const [loading, setLoading] = useState(false);
  const [converted, setConverted] = useState(null);
  const [error, setError] = useState('');
  const { t } = useLanguage();

  const onDrop = useCallback((files) => {
    const f = files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setConverted(null);
    setError('');
  }, []);

  const handleConvert = async () => {
    if (!file) return;
    setLoading(true);
    setError('');
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('format', format.toLowerCase());
      const res = await axios.post(`${API}/image`, fd, { responseType: 'blob' });
      setConverted(URL.createObjectURL(new Blob([res.data])));
    } catch {
      setError(t('imageConv.errorConvert'));
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = converted;
    link.download = `${file.name.replace(/\.[^/.]+$/, '')}.${format.toLowerCase()}`;
    link.click();
  };

  const handleReset = () => { setFile(null); setPreview(null); setConverted(null); setError(''); };

  return (
    <ConverterLayout
      icon={<HiOutlinePhotograph style={{ width: '2rem', height: '2rem', color: '#F97316' }} />}
      title={t('imageConv.title')}
      subtitle={t('imageConv.subtitle')}
    >
      {!file ? (
        <Dropzone
          onDrop={onDrop}
          accept={{ 'image/*': [] }}
          maxSize={50 * 1024 * 1024}
          icon={<HiOutlinePhotograph style={{ width: '4rem', height: '4rem', color: '#FDBA74' }} />}
          title={t('imageConv.dropDefault')}
          subtitle={t('imageConv.clickBrowse')}
          hint={t('imageConv.supports')}
        />
      ) : (
        <div className="animate-fade-in">
          {/* Image preview */}
          <div style={{ position: 'relative', borderRadius: '0.875rem', overflow: 'hidden', background: '#F9FAFB', border: '1px solid #F3F4F6', marginBottom: '1.25rem' }}>
            <img src={preview} alt="Preview" style={{ width: '100%', maxHeight: '18rem', objectFit: 'contain', padding: '1rem', display: 'block' }} />
            <button
              onClick={handleReset}
              style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', width: '2rem', height: '2rem', borderRadius: '50%', background: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
            >✕</button>
          </div>

          <FileInfo
            name={file.name}
            size={file.size}
            icon={<HiOutlinePhotograph style={{ width: '1.25rem', height: '1.25rem' }} />}
          />

          <div style={{ height: '1px', background: '#F3F4F6', margin: '1.25rem 0' }} />

          <FormatPicker
            formats={FORMATS}
            selected={format}
            onChange={setFormat}
            label={t('imageConv.convertTo')}
          />

          <ErrorAlert message={error} />

          <ActionButtons
            converted={converted}
            loading={loading}
            onConvert={handleConvert}
            onDownload={handleDownload}
            onReset={handleReset}
            convertLabel={loading ? t('imageConv.converting') : `${t('imageConv.convertToFormat')} ${format}`}
            downloadLabel={`${t('imageConv.download')} ${format}`}
            resetLabel={t('imageConv.new')}
          />
        </div>
      )}
    </ConverterLayout>
  );
}
