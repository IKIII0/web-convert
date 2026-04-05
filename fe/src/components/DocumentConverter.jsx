import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import {
  HiOutlineDocumentText,
  HiOutlineDownload,
  HiOutlineX,
  HiOutlineRefresh,
  HiOutlineDocumentAdd,
} from 'react-icons/hi';
import { useLanguage } from '../LanguageContext';

const API = 'http://localhost:5000/api/convert';

export default function DocumentConverter() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState(null);
  const [error, setError] = useState('');
  const { t } = useLanguage();

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setResultUrl(null);
      setError('');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-powerpoint': ['.ppt'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx']
    },
    maxFiles: 1,
    maxSize: 50 * 1024 * 1024,
  });

  const removeFile = () => {
    setFile(null);
    setResultUrl(null);
  };

  const handleConvert = async () => {
    if (!file) return;

    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(`${API}/pdf/from-office`, formData, {
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      setResultUrl(URL.createObjectURL(blob));
    } catch (err) {
      setError(t('docConv.errorConvert'));
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!resultUrl || !file) return;
    const link = document.createElement('a');
    link.href = resultUrl;
    
    // Output filename replacing extension with .pdf
    const originalName = file.name;
    const baseName = originalName.substring(0, originalName.lastIndexOf('.')) || originalName;
    link.download = `${baseName}.pdf`;
    
    link.click();
  };

  const handleReset = () => {
    setFile(null);
    setResultUrl(null);
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
          <HiOutlineDocumentAdd style={{ width: '2rem', height: '2rem' }} />
        </div>
        <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', fontWeight: 900, color: '#1F2937' }}>{t('docConv.title')}</h2>
        <p style={{ marginTop: '0.75rem', color: '#6B7280', fontSize: '1.1rem' }}>{t('docConv.subtitle')}</p>
      </div>

      <div className="glass-card" style={{ padding: 'clamp(1.5rem, 3vw, 2rem)' }}>
        {/* Dropzone */}
        {!file && (
          <div
            {...getRootProps()}
            className={`dropzone ${isDragActive ? 'active' : ''}`}
            style={{ marginBottom: '1.5rem', textAlign: 'center' }}
          >
            <input {...getInputProps()} />
            <div className="animate-float" style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.75rem' }}>
              <HiOutlineDocumentAdd style={{ width: '3.5rem', height: '3.5rem', color: '#FDBA74' }} />
            </div>
            <p style={{ fontSize: '1.125rem', fontWeight: 600, color: '#374151' }}>
              {isDragActive ? t('docConv.dropActive') : t('docConv.dropDefault')}
            </p>
            <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#9CA3AF' }}>
              {t('docConv.supports')}
            </p>
          </div>
        )}

        {/* Selected file area */}
        {file && (
          <div style={{ marginBottom: '1.5rem' }} className="animate-fade-in">
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', borderRadius: '0.75rem', background: '#FFF7ED', border: '1px solid #FFEDD5' }}
            >
              <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.625rem', background: '#FFEDD5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EA580C', flexShrink: 0 }}>
                <HiOutlineDocumentText style={{ width: '1.25rem', height: '1.25rem' }} />
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <p style={{ fontSize: '0.95rem', fontWeight: 600, color: '#1F2937', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</p>
                <p style={{ fontSize: '0.8rem', color: '#6B7280' }}>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              <button
                onClick={removeFile}
                style={{
                  width: '2rem', height: '2rem', borderRadius: '50%', background: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#9CA3AF', border: 'none', cursor: 'pointer', flexShrink: 0,
                  transition: 'all 0.2s ease',
                }}
              >
                <HiOutlineX style={{ width: '1.25rem', height: '1.25rem' }} />
              </button>
            </div>
          </div>
        )}

        {error && (
          <div style={{ marginBottom: '1rem', padding: '0.75rem', borderRadius: '0.75rem', background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        {/* Actions */}
        {file && (
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
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
                    {t('docConv.converting')}
                  </>
                ) : (
                  <>
                    <HiOutlineRefresh style={{ width: '1.25rem', height: '1.25rem' }} />
                    {t('docConv.convertToPdf')}
                  </>
                )}
              </button>
            ) : (
              <>
                <button
                  onClick={handleDownload}
                  className="btn-gradient"
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '1rem', borderRadius: '0.75rem', fontSize: '1.05rem', minWidth: '200px' }}
                >
                  <HiOutlineDownload style={{ width: '1.25rem', height: '1.25rem' }} />
                  {t('docConv.downloadPdf')}
                </button>
                <button
                  onClick={handleReset}
                  className="btn-outline"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '1rem', borderRadius: '0.75rem' }}
                >
                  <HiOutlineRefresh style={{ width: '1.25rem', height: '1.25rem' }} />
                  {t('docConv.new')}
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
