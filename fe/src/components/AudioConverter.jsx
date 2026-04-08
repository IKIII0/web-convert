import { useState, useCallback, useRef } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import { useLanguage } from '../LanguageContext';
import ConverterLayout from './ui/ConverterLayout';
import Dropzone from './ui/Dropzone';
import FileInfo from './ui/FileInfo';
import FormatPicker from './ui/FormatPicker';
import ActionButtons from './ui/ActionButtons';
import ErrorAlert from './ui/ErrorAlert';
import ProgressBar from './ui/ProgressBar';

const FORMATS = ['MP3', 'WAV', 'OGG', 'FLAC', 'AAC', 'M4A'];

function AudioIcon({ size = 32, color = '#F97316' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  );
}

// Format info for display
const FORMAT_INFO = {
  MP3: { desc: 'Universal, small size', badge: '#1DB954' },
  WAV: { desc: 'Lossless, large size', badge: '#2563EB' },
  OGG: { desc: 'Open source, good quality', badge: '#7C3AED' },
  FLAC: { desc: 'Lossless compression', badge: '#0891B2' },
  AAC: { desc: 'Apple standard, efficient', badge: '#EA580C' },
  M4A: { desc: 'iTunes compatible', badge: '#9333EA' },
};

export default function AudioConverter() {
  const [file, setFile] = useState(null);
  const [format, setFormat] = useState('MP3');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [converted, setConverted] = useState(null);
  const [error, setError] = useState('');
  const ffmpegRef = useRef(new FFmpeg());
  const { t } = useLanguage();

  const onDrop = useCallback((files) => {
    const f = files[0];
    if (!f) return;
    setFile(f);
    setConverted(null);
    setError('');
  }, []);

  const handleConvert = async () => {
    if (!file) return;
    setLoading(true);
    setError('');
    setProgress(0);
    try {
      const ffmpeg = ffmpegRef.current;
      if (!ffmpeg.loaded) {
        const base = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm';
        await ffmpeg.load({
          coreURL: await toBlobURL(`${base}/ffmpeg-core.js`, 'text/javascript'),
          wasmURL: await toBlobURL(`${base}/ffmpeg-core.wasm`, 'application/wasm'),
        });
      }
      ffmpeg.on('progress', ({ progress: p }) => setProgress(Math.round(p * 100)));

      const ext = file.name.split('.').pop();
      const inName = `in.${ext}`;
      const outName = `out.${format.toLowerCase()}`;

      await ffmpeg.writeFile(inName, await fetchFile(file));
      await ffmpeg.exec(['-i', inName, outName]);

      const data = await ffmpeg.readFile(outName);
      setConverted(URL.createObjectURL(new Blob([data.buffer], { type: `audio/${format.toLowerCase()}` })));
      await ffmpeg.deleteFile(inName);
      await ffmpeg.deleteFile(outName);
    } catch (err) {
      console.error(err);
      setError(t('audioConv.errorConvert'));
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = converted;
    link.download = `${file.name.replace(/\.[^/.]+$/, '')}.${format.toLowerCase()}`;
    link.click();
  };

  const handleReset = () => { setFile(null); setConverted(null); setError(''); };

  return (
    <ConverterLayout
      icon={<AudioIcon size={32} />}
      title={t('audioConv.title')}
      subtitle={t('audioConv.subtitle')}
    >
      {!file ? (
        <Dropzone
          onDrop={onDrop}
          accept={{ 'audio/*': [] }}
          maxSize={100 * 1024 * 1024}
          icon={<AudioIcon size={56} color="#FDBA74" />}
          title={t('audioConv.dropDefault')}
          subtitle={t('audioConv.clickBrowse')}
          hint={t('audioConv.supports')}
        />
      ) : (
        <div className="animate-fade-in">
          <FileInfo
            name={file.name}
            size={file.size}
            icon={<AudioIcon size={20} />}
            onRemove={handleReset}
          />

          {/* Audio preview */}
          <div style={{ margin: '1.25rem 0', padding: '1rem', borderRadius: '0.875rem', background: '#F9FAFB', border: '1px solid #F3F4F6' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Preview</p>
            <audio controls src={URL.createObjectURL(file)} style={{ width: '100%' }} />
          </div>

          <div style={{ height: '1px', background: '#F3F4F6', marginBottom: '1.25rem' }} />

          {/* Format picker with info */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>
              {t('audioConv.convertTo')}
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.5rem' }}>
              {FORMATS.map((f) => (
                <button
                  key={f}
                  onClick={() => setFormat(f)}
                  style={{
                    padding: '0.625rem 0.75rem', borderRadius: '0.75rem', border: 'none', cursor: 'pointer',
                    background: format === f ? 'linear-gradient(135deg, #F97316, #EA580C)' : '#F9FAFB',
                    border: format === f ? 'none' : '1px solid #F3F4F6',
                    transition: 'all 0.2s ease',
                    textAlign: 'left',
                    boxShadow: format === f ? '0 4px 12px rgba(249,115,22,0.25)' : 'none',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                    <span style={{ width: '0.5rem', height: '0.5rem', borderRadius: '50%', background: FORMAT_INFO[f].badge, display: 'inline-block', flexShrink: 0 }} />
                    <span style={{ fontSize: '0.875rem', fontWeight: 700, color: format === f ? 'white' : '#1F2937' }}>{f}</span>
                  </div>
                  <p style={{ fontSize: '0.7rem', color: format === f ? 'rgba(255,255,255,0.8)' : '#9CA3AF', marginLeft: '1rem' }}>{FORMAT_INFO[f].desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* FFmpeg notice */}
          <div style={{ marginBottom: '1.25rem', padding: '0.75rem 1rem', borderRadius: '0.875rem', background: '#F0FDF4', border: '1px solid #BBF7D0', fontSize: '0.8rem', color: '#166534', display: 'flex', gap: '0.5rem' }}>
            <span>Conversion runs entirely in your browser. No files are uploaded to any server.</span>
          </div>

          {loading && <ProgressBar progress={progress} label={t('audioConv.converting')} />}
          <ErrorAlert message={error} />

          <ActionButtons
            converted={converted}
            loading={loading}
            onConvert={handleConvert}
            onDownload={handleDownload}
            onReset={handleReset}
            convertLabel={loading ? t('audioConv.converting') : `${t('audioConv.convertToFormat')} ${format}`}
            downloadLabel={`${t('audioConv.download')} ${format}`}
            resetLabel={t('audioConv.new')}
          />
        </div>
      )}
    </ConverterLayout>
  );
}
