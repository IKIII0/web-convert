import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import {
  HiOutlineDocumentText,
  HiOutlineDownload,
  HiOutlineX,
  HiOutlineRefresh,
  HiOutlinePlus,
  HiOutlinePhotograph,
} from 'react-icons/hi';
import { useLanguage } from '../LanguageContext';

const API = 'http://localhost:5000/api/convert';

export default function PdfConverter() {
  const [mode, setMode] = useState('images-to-pdf');
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState(null);
  const [resultType, setResultType] = useState('');
  const [error, setError] = useState('');
  const { t } = useLanguage();

  const acceptConfig = mode === 'images-to-pdf'
    ? { 'image/*': [] }
    : { 'application/pdf': ['.pdf'] };

  const onDrop = useCallback((acceptedFiles) => {
    setFiles((prev) => [...prev, ...acceptedFiles]);
    setResultUrl(null);
    setError('');
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptConfig,
    maxSize: 50 * 1024 * 1024,
  });

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setResultUrl(null);
  };

  const handleConvert = async () => {
    if (files.length === 0) return;
    if (mode === 'merge' && files.length < 2) {
      setError(t('pdfConv.errorMinFiles'));
      return;
    }

    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      files.forEach((f) => formData.append('files', f));

      let endpoint = '';
      if (mode === 'images-to-pdf') endpoint = '/pdf/from-images';
      else if (mode === 'merge') endpoint = '/pdf/merge';
      else if (mode === 'pdf-to-images') endpoint = '/pdf/to-images';

      const response = await axios.post(`${API}${endpoint}`, formData, {
        responseType: 'blob',
      });

      const type = response.data.type || response.headers['content-type'] || 'application/pdf';
      const blob = new Blob([response.data], { type });
      setResultType(type);
      setResultUrl(URL.createObjectURL(blob));
    } catch (err) {
      setError(t('pdfConv.errorProcess'));
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!resultUrl) return;
    const link = document.createElement('a');
    link.href = resultUrl;
    link.download = mode === 'images-to-pdf' ? 'converted.pdf' 
                  : mode === 'merge' ? 'merged.pdf' 
                  : (resultType === 'image/png' ? 'converted-page.png' : 'converted-images.zip');
    link.click();
  };

  const handleReset = () => {
    setFiles([]);
    setResultUrl(null);
    setResultType('');
    setError('');
  };

  const modeButtonStyle = (isActive) => ({
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: '0.75rem',
    borderRadius: '0.625rem',
    fontSize: '0.875rem',
    fontWeight: 600,
    transition: 'all 0.2s ease',
    border: 'none',
    cursor: 'pointer',
    background: isActive ? 'linear-gradient(135deg, #F97316, #EA580C)' : 'transparent',
    color: isActive ? 'white' : '#6B7280',
    boxShadow: isActive ? '0 4px 12px rgba(249, 115, 22, 0.25)' : 'none',
  });

  return (
    <div style={{ maxWidth: '48rem', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: '4rem', height: '4rem', borderRadius: '1rem',
          background: 'linear-gradient(135deg, #FFF7ED, #FFEDD5)',
          color: '#F97316', marginBottom: '1rem',
        }}>
          <HiOutlineDocumentText style={{ width: '2rem', height: '2rem' }} />
        </div>
        <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', fontWeight: 900, color: '#1F2937' }}>{t('pdfConv.title')}</h2>
        <p style={{ marginTop: '0.75rem', color: '#6B7280', fontSize: '1.1rem' }}>{t('pdfConv.subtitle')}</p>
      </div>

      <div className="glass-card" style={{ padding: 'clamp(1.5rem, 3vw, 2rem)' }}>
        {/* Mode selector */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', background: '#F3F4F6', padding: '0.375rem', borderRadius: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => { setMode('images-to-pdf'); handleReset(); }}
            style={modeButtonStyle(mode === 'images-to-pdf')}
          >
            <HiOutlinePhotograph style={{ width: '1rem', height: '1rem' }} />
            {t('pdfConv.imagesToPdf')}
          </button>
          <button
            onClick={() => { setMode('pdf-to-images'); handleReset(); }}
            style={modeButtonStyle(mode === 'pdf-to-images')}
          >
            <HiOutlineDocumentText style={{ width: '1rem', height: '1rem' }} />
            {t('pdfConv.pdfToImages')}
          </button>
          <button
            onClick={() => { setMode('merge'); handleReset(); }}
            style={modeButtonStyle(mode === 'merge')}
          >
            <HiOutlinePlus style={{ width: '1rem', height: '1rem' }} />
            {t('pdfConv.mergePdfs')}
          </button>
        </div>

        {/* Dropzone */}
        <div
          {...getRootProps()}
          className={`dropzone ${isDragActive ? 'active' : ''}`}
          style={{ marginBottom: '1.5rem', textAlign: 'center' }}
        >
          <input {...getInputProps()} />
          <div className="animate-float" style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.75rem' }}>
            {mode === 'images-to-pdf' ? (
              <HiOutlinePhotograph style={{ width: '3.5rem', height: '3.5rem', color: '#FDBA74' }} />
            ) : (
              <HiOutlineDocumentText style={{ width: '3.5rem', height: '3.5rem', color: '#FDBA74' }} />
            )}
          </div>
          <p style={{ fontSize: '1.125rem', fontWeight: 600, color: '#374151' }}>
            {isDragActive
              ? t('pdfConv.dropActive')
              : mode === 'images-to-pdf'
                ? t('pdfConv.dropImages')
                : t('pdfConv.dropPdfs')}
          </p>
          <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#9CA3AF' }}>
            {mode === 'images-to-pdf'
              ? t('pdfConv.supportsImages')
              : mode === 'merge'
                ? t('pdfConv.selectPdfs')
                : t('pdfConv.supportsPdfs')}
          </p>
        </div>

        {/* File list */}
        {files.length > 0 && (
          <div style={{ marginBottom: '1.5rem' }} className="animate-fade-in">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>
                {files.length} {t('pdfConv.filesSelected')}
              </span>
              <button
                onClick={handleReset}
                style={{ fontSize: '0.875rem', color: '#9CA3AF', cursor: 'pointer', background: 'none', border: 'none', transition: 'color 0.2s ease', fontFamily: 'inherit' }}
                onMouseEnter={(e) => e.target.style.color = '#EF4444'}
                onMouseLeave={(e) => e.target.style.color = '#9CA3AF'}
              >
                {t('pdfConv.clearAll')}
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {files.map((f, i) => (
                <div
                  key={i}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: '0.75rem', background: '#FFF7ED', border: '1px solid #FFEDD5' }}
                >
                  <div style={{ width: '2rem', height: '2rem', borderRadius: '0.5rem', background: '#FFEDD5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EA580C', fontSize: '0.75rem', fontWeight: 700, flexShrink: 0 }}>
                    {i + 1}
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1F2937', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</p>
                    <p style={{ fontSize: '0.75rem', color: '#6B7280' }}>{(f.size / 1024).toFixed(1)} KB</p>
                  </div>
                  <button
                    onClick={() => removeFile(i)}
                    style={{
                      width: '1.75rem', height: '1.75rem', borderRadius: '50%', background: 'white',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#9CA3AF', border: 'none', cursor: 'pointer', flexShrink: 0,
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <HiOutlineX style={{ width: '1rem', height: '1rem' }} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{ marginBottom: '1rem', padding: '0.75rem', borderRadius: '0.75rem', background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        {/* Actions */}
        {files.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            {!resultUrl ? (
              <button
                onClick={handleConvert}
                disabled={loading}
                className="btn-gradient"
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '1rem', borderRadius: '0.75rem', fontSize: '1.05rem', minWidth: '200px' }}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    {t('pdfConv.processing')}
                  </>
                ) : (
                  <>
                    <HiOutlineRefresh style={{ width: '1.25rem', height: '1.25rem' }} />
                    {mode === 'images-to-pdf' ? t('pdfConv.convertToPdf') 
                      : mode === 'merge' ? t('pdfConv.mergePdfs')
                      : t('pdfConv.convertToImages')}
                  </>
                )}
              </button>
            ) : (
              <>
                <button
                  onClick={handleDownload}
                  className="btn-gradient"
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '1rem', borderRadius: '0.75rem', fontSize: '1.05rem' }}
                >
                  <HiOutlineDownload style={{ width: '1.25rem', height: '1.25rem' }} />
                  {mode === 'pdf-to-images' ? t('pdfConv.downloadImages') : t('pdfConv.downloadPdf')}
                </button>
                <button
                  onClick={handleReset}
                  className="btn-outline"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '1rem', borderRadius: '0.75rem' }}
                >
                  <HiOutlineRefresh style={{ width: '1.25rem', height: '1.25rem' }} />
                  {t('pdfConv.new')}
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
