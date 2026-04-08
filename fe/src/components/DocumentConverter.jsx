import { useState, useCallback } from 'react';
import axios from 'axios';
import { HiOutlineDocumentAdd } from 'react-icons/hi';
import { useLanguage } from '../LanguageContext';
import ConverterLayout from './ui/ConverterLayout';
import Dropzone from './ui/Dropzone';
import FileInfo from './ui/FileInfo';
import ActionButtons from './ui/ActionButtons';
import ErrorAlert from './ui/ErrorAlert';

const API = 'https://web-convert-be.vercel.app/api/convert';

const ACCEPT = {
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'application/vnd.ms-excel': ['.xls'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
  'application/vnd.ms-powerpoint': ['.ppt'],
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
};

// File type badge colors
const TYPE_COLORS = {
  doc: '#2563EB', docx: '#2563EB',
  xls: '#16A34A', xlsx: '#16A34A',
  ppt: '#DC2626', pptx: '#DC2626',
};

function getExt(name) { return name.split('.').pop().toLowerCase(); }

export default function DocumentConverter() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState(null);
  const [error, setError] = useState('');
  const { t } = useLanguage();

  const onDrop = useCallback((files) => {
    if (files[0]) { setFile(files[0]); setResultUrl(null); setError(''); }
  }, []);

  const handleConvert = async () => {
    if (!file) return;
    setLoading(true);
    setError('');
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await axios.post(`${API}/pdf/from-office`, fd, { responseType: 'blob' });
      setResultUrl(URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' })));
    } catch {
      setError(t('docConv.errorConvert'));
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = resultUrl;
    link.download = `${file.name.replace(/\.[^/.]+$/, '')}.pdf`;
    link.click();
  };

  const handleReset = () => { setFile(null); setResultUrl(null); setError(''); };

  const ext = file ? getExt(file.name) : '';
  const badgeColor = TYPE_COLORS[ext] || '#6B7280';

  return (
    <ConverterLayout
      icon={<HiOutlineDocumentAdd style={{ width: '2rem', height: '2rem', color: '#F97316' }} />}
      title={t('docConv.title')}
      subtitle={t('docConv.subtitle')}
    >
      {/* Supported formats info */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Word', exts: '.doc .docx', color: '#2563EB' },
          { label: 'Excel', exts: '.xls .xlsx', color: '#16A34A' },
          { label: 'PowerPoint', exts: '.ppt .pptx', color: '#DC2626' },
        ].map((item) => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.375rem 0.75rem', borderRadius: '0.625rem', background: '#F9FAFB', border: '1px solid #F3F4F6' }}>
            <span style={{ width: '0.5rem', height: '0.5rem', borderRadius: '50%', background: item.color, display: 'inline-block' }} />
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151' }}>{item.label}</span>
            <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>{item.exts}</span>
          </div>
        ))}
      </div>

      {!file ? (
        <Dropzone
          onDrop={onDrop}
          accept={ACCEPT}
          maxSize={50 * 1024 * 1024}
          icon={<HiOutlineDocumentAdd style={{ width: '4rem', height: '4rem', color: '#FDBA74' }} />}
          title={t('docConv.dropDefault')}
          subtitle={t('docConv.clickBrowse')}
          hint={t('docConv.supports')}
        />
      ) : (
        <div className="animate-fade-in">
          {/* File card with type badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem', borderRadius: '0.875rem', background: '#FFF7ED', border: '1px solid #FFEDD5', marginBottom: '1.5rem' }}>
            <div style={{ width: '3rem', height: '3rem', borderRadius: '0.75rem', background: badgeColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.05em', flexShrink: 0 }}>
              {ext.toUpperCase()}
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <p style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1F2937', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</p>
              <p style={{ fontSize: '0.75rem', color: '#9CA3AF', marginTop: '0.1rem' }}>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
            <button
              onClick={handleReset}
              style={{ width: '2rem', height: '2rem', borderRadius: '50%', background: 'white', border: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF', cursor: 'pointer', flexShrink: 0 }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#FEF2F2'; e.currentTarget.style.color = '#EF4444'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = '#9CA3AF'; }}
            >✕</button>
          </div>

          {/* Conversion arrow */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', padding: '0.75rem 1rem', borderRadius: '0.875rem', background: '#F9FAFB', border: '1px solid #F3F4F6' }}>
            <div style={{ padding: '0.375rem 0.75rem', borderRadius: '0.5rem', background: badgeColor, color: 'white', fontSize: '0.75rem', fontWeight: 700 }}>{ext.toUpperCase()}</div>
            <span style={{ color: '#F97316', fontSize: '1.25rem', fontWeight: 700 }}>→</span>
            <div style={{ padding: '0.375rem 0.75rem', borderRadius: '0.5rem', background: '#DC2626', color: 'white', fontSize: '0.75rem', fontWeight: 700 }}>PDF</div>
            <span style={{ fontSize: '0.8rem', color: '#9CA3AF', marginLeft: 'auto' }}>via PDF24 API</span>
          </div>

          <ErrorAlert message={error} />

          <ActionButtons
            converted={resultUrl}
            loading={loading}
            onConvert={handleConvert}
            onDownload={handleDownload}
            onReset={handleReset}
            convertLabel={loading ? t('docConv.converting') : t('docConv.convertToPdf')}
            downloadLabel={t('docConv.downloadPdf')}
            resetLabel={t('docConv.new')}
          />
        </div>
      )}
    </ConverterLayout>
  );
}
