import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { HiOutlinePhotograph, HiOutlineDownload, HiOutlineX, HiOutlineRefresh } from 'react-icons/hi';
import { useLanguage } from '../LanguageContext';

const API = 'http://localhost:5000/api/convert';

const formats = ['PNG', 'JPG', 'WebP', 'BMP', 'TIFF', 'AVIF'];

export default function ImageConverter() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [format, setFormat] = useState('PNG');
  const [loading, setLoading] = useState(false);
  const [converted, setConverted] = useState(null);
  const [error, setError] = useState('');
  const { t } = useLanguage();

  const onDrop = useCallback((acceptedFiles) => {
    const f = acceptedFiles[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
      setConverted(null);
      setError('');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 1,
    maxSize: 50 * 1024 * 1024,
  });

  const handleConvert = async () => {
    if (!file) return;
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('format', format.toLowerCase());

      const response = await axios.post(`${API}/image`, formData, {
        responseType: 'blob',
      });

      const blob = new Blob([response.data]);
      const url = URL.createObjectURL(blob);
      setConverted(url);
    } catch (err) {
      setError(t('imageConv.errorConvert'));
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!converted) return;
    const link = document.createElement('a');
    link.href = converted;
    const name = file.name.replace(/\.[^/.]+$/, '');
    link.download = `${name}.${format.toLowerCase()}`;
    link.click();
  };

  const handleReset = () => {
    setFile(null);
    setPreview(null);
    setConverted(null);
    setError('');
  };

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
          <HiOutlinePhotograph style={{ width: '2rem', height: '2rem' }} />
        </div>
        <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', fontWeight: 900, color: '#1F2937' }}>{t('imageConv.title')}</h2>
        <p style={{ marginTop: '0.75rem', color: '#6B7280', fontSize: '1.1rem' }}>{t('imageConv.subtitle')}</p>
      </div>

      <div className="glass-card" style={{ padding: 'clamp(1.5rem, 3vw, 2rem)' }}>
        {/* Dropzone */}
        {!file ? (
          <div
            {...getRootProps()}
            className={`dropzone ${isDragActive ? 'active' : ''}`}
            style={{ textAlign: 'center' }}
          >
            <input {...getInputProps()} />
            <div className="animate-float" style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
              <HiOutlinePhotograph style={{ width: '4rem', height: '4rem', color: '#FDBA74' }} />
            </div>
            <p style={{ fontSize: '1.125rem', fontWeight: 600, color: '#374151' }}>
              {isDragActive ? t('imageConv.dropActive') : t('imageConv.dropDefault')}
            </p>
            <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#9CA3AF' }}>{t('imageConv.clickBrowse')}</p>
            <p style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: '#9CA3AF' }}>{t('imageConv.supports')}</p>
          </div>
        ) : (
          <div className="animate-fade-in">
            {/* Preview */}
            <div style={{ position: 'relative', borderRadius: '0.75rem', overflow: 'hidden', background: '#F9FAFB', border: '1px solid #F3F4F6', marginBottom: '1.5rem' }}>
              <img
                src={preview}
                alt="Preview"
                style={{ width: '100%', maxHeight: '20rem', objectFit: 'contain', padding: '1rem' }}
              />
              <button
                onClick={handleReset}
                style={{
                  position: 'absolute', top: '0.75rem', right: '0.75rem',
                  width: '2rem', height: '2rem', borderRadius: '50%',
                  background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(4px)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#6B7280', border: 'none', cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)', transition: 'all 0.2s ease',
                }}
              >
                <HiOutlineX style={{ width: '1.25rem', height: '1.25rem' }} />
              </button>
            </div>

            {/* File info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', padding: '0.75rem', borderRadius: '0.75rem', background: '#FFF7ED', border: '1px solid #FFEDD5' }}>
              <HiOutlinePhotograph style={{ width: '1.25rem', height: '1.25rem', color: '#F97316', flexShrink: 0 }} />
              <div style={{ minWidth: 0 }}>
                <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1F2937', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</p>
                <p style={{ fontSize: '0.75rem', color: '#6B7280' }}>{(file.size / 1024).toFixed(1)} KB</p>
              </div>
            </div>

            {/* Format selection */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.75rem' }}>{t('imageConv.convertTo')}</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {formats.map((f) => (
                  <button
                    key={f}
                    onClick={() => setFormat(f)}
                    style={{
                      padding: '0.625rem 1rem', borderRadius: '0.75rem', fontSize: '0.875rem',
                      fontWeight: 600, transition: 'all 0.2s ease', border: 'none', cursor: 'pointer',
                      background: format === f ? 'linear-gradient(135deg, #F97316, #EA580C)' : '#F3F4F6',
                      color: format === f ? 'white' : '#4B5563',
                      boxShadow: format === f ? '0 4px 12px rgba(249, 115, 22, 0.25)' : 'none',
                    }}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={{ marginBottom: '1rem', padding: '0.75rem', borderRadius: '0.75rem', background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', fontSize: '0.875rem' }}>
                {error}
              </div>
            )}

            {/* Action buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              {!converted ? (
                <button
                  onClick={handleConvert}
                  disabled={loading}
                  className="btn-gradient"
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '1rem', borderRadius: '0.75rem', fontSize: '1.05rem', minWidth: '200px' }}
                >
                  {loading ? (
                    <>
                      <span className="spinner"></span>
                      {t('imageConv.converting')}
                    </>
                  ) : (
                    <>
                      <HiOutlineRefresh style={{ width: '1.25rem', height: '1.25rem' }} />
                      {t('imageConv.convertToFormat')} {format}
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
                    {t('imageConv.download')} {format}
                  </button>
                  <button
                    onClick={handleReset}
                    className="btn-outline"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '1rem', borderRadius: '0.75rem' }}
                  >
                    <HiOutlineRefresh style={{ width: '1.25rem', height: '1.25rem' }} />
                    {t('imageConv.new')}
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
