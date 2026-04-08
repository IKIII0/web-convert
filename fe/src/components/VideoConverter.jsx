import { useState, useCallback, useRef } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import { useLanguage } from '../LanguageContext';
import ConverterLayout from './ui/ConverterLayout';
import Dropzone from './ui/Dropzone';
import FileInfo from './ui/FileInfo';
import ActionButtons from './ui/ActionButtons';
import ErrorAlert from './ui/ErrorAlert';
import ProgressBar from './ui/ProgressBar';

const FORMATS = ['MP4', 'WebM', 'AVI', 'MOV', 'MKV', 'FLV'];

function VideoIcon({ size = 32, color = '#F97316' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m10 9 5 3-5 3V9z" />
    </svg>
  );
}

const FORMAT_INFO = {
  MP4:  { desc: 'Most compatible', badge: '#2563EB', codecs: ['-c:v', 'libx264', '-c:a', 'aac', '-movflags', '+faststart'] },
  WebM: { desc: 'Web optimized', badge: '#16A34A', codecs: ['-c:v', 'libvpx-vp9', '-c:a', 'libopus'] },
  AVI:  { desc: 'Windows classic', badge: '#7C3AED', codecs: ['-c:v', 'mpeg4', '-c:a', 'mp3'] },
  MOV:  { desc: 'Apple QuickTime', badge: '#EA580C', codecs: [] },
  MKV:  { desc: 'Open container', badge: '#0891B2', codecs: [] },
  FLV:  { desc: 'Flash video', badge: '#DC2626', codecs: [] },
};

const MIME = { mp4: 'video/mp4', webm: 'video/webm', avi: 'video/x-msvideo', mov: 'video/quicktime', mkv: 'video/x-matroska', flv: 'video/x-flv' };

export default function VideoConverter() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [format, setFormat] = useState('MP4');
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
    setPreviewUrl(URL.createObjectURL(f));
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
      const outFmt = format.toLowerCase();
      const inName = `in.${ext}`;
      const outName = `out.${outFmt}`;

      await ffmpeg.writeFile(inName, await fetchFile(file));

      const extraCodecs = FORMAT_INFO[format]?.codecs || [];
      await ffmpeg.exec(['-i', inName, ...extraCodecs, outName]);

      const data = await ffmpeg.readFile(outName);
      setConverted(URL.createObjectURL(new Blob([data.buffer], { type: MIME[outFmt] || 'video/mp4' })));
      await ffmpeg.deleteFile(inName);
      await ffmpeg.deleteFile(outName);
    } catch (err) {
      console.error(err);
      setError(t('videoConv.errorConvert'));
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

  const handleReset = () => { setFile(null); setPreviewUrl(null); setConverted(null); setError(''); };

  return (
    <ConverterLayout
      icon={<VideoIcon size={32} />}
      title={t('videoConv.title')}
      subtitle={t('videoConv.subtitle')}
    >
      {!file ? (
        <Dropzone
          onDrop={onDrop}
          accept={{ 'video/*': [] }}
          maxSize={500 * 1024 * 1024}
          icon={<VideoIcon size={56} color="#FDBA74" />}
          title={t('videoConv.dropDefault')}
          subtitle={t('videoConv.clickBrowse')}
          hint={t('videoConv.supports')}
        />
      ) : (
        <div className="animate-fade-in">
          {/* Video preview */}
          <div style={{ position: 'relative', borderRadius: '0.875rem', overflow: 'hidden', background: '#000', marginBottom: '1.25rem' }}>
            <video src={previewUrl} controls style={{ width: '100%', maxHeight: '18rem', display: 'block' }} />
            <button
              onClick={handleReset}
              style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', width: '2rem', height: '2rem', borderRadius: '50%', background: 'rgba(0,0,0,0.6)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}
            >✕</button>
          </div>

          <FileInfo
            name={file.name}
            size={file.size}
            icon={<VideoIcon size={20} />}
          />

          <div style={{ height: '1px', background: '#F3F4F6', margin: '1.25rem 0' }} />

          {/* Format picker with info */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>
              {t('videoConv.convertTo')}
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.5rem' }}>
              {FORMATS.map((f) => (
                <button
                  key={f}
                  onClick={() => setFormat(f)}
                  style={{
                    padding: '0.625rem 0.75rem', borderRadius: '0.75rem', cursor: 'pointer',
                    background: format === f ? 'linear-gradient(135deg, #F97316, #EA580C)' : '#F9FAFB',
                    border: format === f ? 'none' : '1px solid #F3F4F6',
                    transition: 'all 0.2s ease', textAlign: 'left',
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

          {/* Privacy notice */}
          <div style={{ marginBottom: '1.25rem', padding: '0.75rem 1rem', borderRadius: '0.875rem', background: '#F0FDF4', border: '1px solid #BBF7D0', fontSize: '0.8rem', color: '#166534' }}>
            Conversion runs entirely in your browser. No files are uploaded to any server.
          </div>

          {/* Warning for large files */}
          {file.size > 50 * 1024 * 1024 && (
            <div style={{ marginBottom: '1.25rem', padding: '0.75rem 1rem', borderRadius: '0.875rem', background: '#FFFBEB', border: '1px solid #FDE68A', fontSize: '0.8rem', color: '#92400E' }}>
              Large file detected. Conversion may take several minutes depending on your device.
            </div>
          )}

          {loading && <ProgressBar progress={progress} label={t('videoConv.converting')} />}
          <ErrorAlert message={error} />

          <ActionButtons
            converted={converted}
            loading={loading}
            onConvert={handleConvert}
            onDownload={handleDownload}
            onReset={handleReset}
            convertLabel={loading ? t('videoConv.converting') : `${t('videoConv.convertToFormat')} ${format}`}
            downloadLabel={`${t('videoConv.download')} ${format}`}
            resetLabel={t('videoConv.new')}
          />
        </div>
      )}
    </ConverterLayout>
  );
}
