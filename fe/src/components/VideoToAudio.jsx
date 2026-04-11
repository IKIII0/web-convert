import { useState, useCallback, useRef } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import { useLanguage } from '../LanguageContext';
import ConverterLayout from './ui/ConverterLayout';
import Dropzone from './ui/Dropzone';
import ErrorAlert from './ui/ErrorAlert';
import ProgressBar from './ui/ProgressBar';

const AUDIO_FORMATS = [
  { id: 'MP3',  desc: 'Universal, most popular',   badge: '#1DB954', ext: 'mp3'  },
  { id: 'AAC',  desc: 'High quality, small size',   badge: '#F97316', ext: 'aac'  },
  { id: 'WAV',  desc: 'Lossless, studio quality',   badge: '#2563EB', ext: 'wav'  },
  { id: 'OGG',  desc: 'Open source, great quality', badge: '#7C3AED', ext: 'ogg'  },
  { id: 'FLAC', desc: 'Lossless compression',       badge: '#0891B2', ext: 'flac' },
  { id: 'M4A',  desc: 'iTunes / Apple compatible',  badge: '#9333EA', ext: 'm4a'  },
];

function V2AIcon({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      {/* Video screen — dark so it's visible on cream bg */}
      <rect x="2" y="8" width="26" height="18" rx="3" fill="#1F2937" />
      {/* Play triangle — orange accent */}
      <polygon points="9,13 9,21 16,17" fill="#F97316" />
      {/* Camera lens notch */}
      <rect x="28" y="13" width="2" height="8" rx="1" fill="#374151" />
      <polygon points="30,14 38,17 30,20" fill="#374151" />
      {/* Arrow down — orange */}
      <path d="M8 34 Q24 26 40 34" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {/* Music note dot — dark */}
      <circle cx="40" cy="34" r="4" fill="#1F2937" />
      <path d="M38 32 Q40 30 42 32" stroke="#F97316" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </svg>
  );
}


function VideoDropIcon() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
      <rect x="4" y="12" width="40" height="28" rx="5" fill="url(#vi)" opacity="0.85" />
      <polygon points="44,22 58,32 44,42" fill="#FDBA74" />
      <path d="M12 52 Q32 42 52 52" stroke="#FDBA74" strokeWidth="3" strokeLinecap="round" fill="none" />
      <circle cx="52" cy="52" r="6" fill="url(#ai)" />
      <line x1="49" y1="52" x2="55" y2="52" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <line x1="52" y1="49" x2="52" y2="55" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <defs>
        <linearGradient id="vi" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FB923C" />
          <stop offset="100%" stopColor="#EA580C" />
        </linearGradient>
        <linearGradient id="ai" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F97316" />
          <stop offset="100%" stopColor="#C2410C" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function WaveformAnimation({ active }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '3px', height: '2rem' }}>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
        <div
          key={i}
          style={{
            width: '3px',
            borderRadius: '2px',
            background: active
              ? 'linear-gradient(to top, #F97316, #FB923C)'
              : '#D1D5DB',
            height: active
              ? `${Math.max(6, Math.sin(i * 0.9) * 14 + 16)}px`
              : '6px',
            transition: 'height 0.4s ease',
            animation: active ? `wave ${0.5 + i * 0.08}s ease-in-out infinite alternate` : 'none',
          }}
        />
      ))}
      <style>{`
        @keyframes wave {
          from { transform: scaleY(0.4); }
          to   { transform: scaleY(1.2); }
        }
      `}</style>
    </div>
  );
}

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

export default function VideoToAudio() {
  const [file, setFile]         = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [format, setFormat]     = useState('MP3');
  const [loading, setLoading]   = useState(false);
  const [progress, setProgress] = useState(0);
  const [converted, setConverted] = useState(null);
  const [error, setError]       = useState('');
  const [useServer, setUseServer] = useState(false);
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

  /* ---- Browser-side conversion (FFmpeg.wasm) ---- */
  const convertInBrowser = async () => {
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
    const fmt = format.toLowerCase();
    const inName  = `in.${ext}`;
    const outName = `out.${fmt}`;

    await ffmpeg.writeFile(inName, await fetchFile(file));

    const codecArgs = {
      mp3:  ['-vn', '-c:a', 'libmp3lame', '-b:a', '192k'],
      aac:  ['-vn', '-c:a', 'aac', '-b:a', '192k'],
      wav:  ['-vn'],
      ogg:  ['-vn', '-c:a', 'libvorbis'],
      flac: ['-vn', '-c:a', 'flac'],
      m4a:  ['-vn', '-c:a', 'aac', '-b:a', '192k'],
    };

    await ffmpeg.exec(['-i', inName, ...(codecArgs[fmt] || ['-vn']), outName]);

    const data = await ffmpeg.readFile(outName);
    const mimeMap = { mp3:'audio/mpeg', aac:'audio/aac', wav:'audio/wav', ogg:'audio/ogg', flac:'audio/flac', m4a:'audio/mp4' };
    const url = URL.createObjectURL(new Blob([data.buffer], { type: mimeMap[fmt] || 'audio/mpeg' }));
    setConverted(url);

    await ffmpeg.deleteFile(inName);
    await ffmpeg.deleteFile(outName);
  };

  /* ---- Server-side conversion (fluent-ffmpeg) ---- */
  const convertOnServer = async () => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('format', format.toLowerCase());

    const res = await fetch(`${API_BASE}/api/convert/video-to-audio`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Server conversion failed');
    }

    const blob = await res.blob();
    setConverted(URL.createObjectURL(blob));
  };

  const handleConvert = async () => {
    if (!file) return;
    setLoading(true);
    setError('');
    setProgress(0);
    try {
      if (useServer) {
        await convertOnServer();
      } else {
        await convertInBrowser();
      }
    } catch (err) {
      console.error(err);
      setError(t('v2a.errorConvert'));
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

  const handleReset = () => {
    setFile(null);
    setPreviewUrl(null);
    setConverted(null);
    setError('');
    setProgress(0);
  };

  const selectedFmt = AUDIO_FORMATS.find(f => f.id === format);

  return (
    <ConverterLayout
      icon={<V2AIcon size={32} />}
      title={t('v2a.title')}
      subtitle={t('v2a.subtitle')}
    >
      {/* Hero badge */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
        background: 'linear-gradient(135deg, #FFF7ED, #FFEDD5)',
        border: '1px solid #FED7AA',
        borderRadius: '2rem',
        padding: '0.375rem 1rem',
        marginBottom: '1.5rem',
        fontSize: '0.78rem', fontWeight: 700, color: '#C2410C',
        letterSpacing: '0.03em',
      }}>
        <span style={{ fontSize: '1rem' }}>⭐</span>
        {t('v2a.badge')}
      </div>

      {!file ? (
        <Dropzone
          onDrop={onDrop}
          accept={{ 'video/*': [] }}
          maxSize={500 * 1024 * 1024}
          icon={<VideoDropIcon />}
          title={t('v2a.dropDefault')}
          subtitle={t('v2a.clickBrowse')}
          hint={t('v2a.supports')}
        />
      ) : (
        <div className="animate-fade-in">
          {/* Video preview */}
          <div style={{ position: 'relative', borderRadius: '1rem', overflow: 'hidden', background: '#000', marginBottom: '1.25rem', boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }}>
            <video src={previewUrl} controls style={{ width: '100%', maxHeight: '16rem', display: 'block' }} />
            <button
              onClick={handleReset}
              style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', width: '2rem', height: '2rem', borderRadius: '50%', background: 'rgba(0,0,0,0.65)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.9rem', backdropFilter: 'blur(4px)' }}
            >✕</button>
          </div>

          {/* File info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', padding: '0.875rem 1rem', borderRadius: '0.875rem', background: '#F9FAFB', border: '1px solid #F3F4F6', marginBottom: '1.25rem' }}>
            <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.75rem', background: 'linear-gradient(135deg, #FFF7ED, #FFEDD5)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <V2AIcon size={22} />
            </div>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1F2937', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{file.name}</p>
              <p style={{ fontSize: '0.75rem', color: '#9CA3AF', margin: 0 }}>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
            <WaveformAnimation active={!!converted && !loading} />
          </div>

          {/* Arrow visual */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem', gap: '1rem' }}>
            <div style={{ padding: '0.5rem 1rem', borderRadius: '0.625rem', background: '#1F2937', color: 'white', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em' }}>
              VIDEO
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#F97316' }}>
              <div style={{ width: '2.5rem', height: '2px', background: 'linear-gradient(90deg, #F97316, #EA580C)' }} />
              <svg width="12" height="12" viewBox="0 0 12 12" fill="#F97316">
                <polygon points="0,0 12,6 0,12" />
              </svg>
            </div>
            <div style={{ padding: '0.5rem 1rem', borderRadius: '0.625rem', background: `linear-gradient(135deg, ${selectedFmt?.badge || '#F97316'}, ${selectedFmt?.badge || '#F97316'}dd)`, color: 'white', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', boxShadow: `0 4px 12px ${selectedFmt?.badge || '#F97316'}44` }}>
              {format}
            </div>
          </div>

          <div style={{ height: '1px', background: '#F3F4F6', margin: '1.25rem 0' }} />

          {/* Output format */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>
              {t('v2a.convertTo')}
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.5rem' }}>
              {AUDIO_FORMATS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFormat(f.id)}
                  style={{
                    padding: '0.65rem 0.75rem', borderRadius: '0.875rem', cursor: 'pointer',
                    background: format === f.id ? `linear-gradient(135deg, ${f.badge}, ${f.badge}cc)` : '#F9FAFB',
                    border: format === f.id ? 'none' : '1px solid #F3F4F6',
                    transition: 'all 0.2s ease', textAlign: 'left',
                    boxShadow: format === f.id ? `0 4px 14px ${f.badge}44` : 'none',
                    transform: format === f.id ? 'scale(1.02)' : 'scale(1)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                    <span style={{ width: '0.5rem', height: '0.5rem', borderRadius: '50%', background: format === f.id ? 'rgba(255,255,255,0.7)' : f.badge, display: 'inline-block', flexShrink: 0 }} />
                    <span style={{ fontSize: '0.9rem', fontWeight: 800, color: format === f.id ? 'white' : '#1F2937' }}>{f.id}</span>
                  </div>
                  <p style={{ fontSize: '0.68rem', color: format === f.id ? 'rgba(255,255,255,0.8)' : '#9CA3AF', marginLeft: '1rem', margin: 0, marginLeft: '1rem' }}>{f.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Method toggle */}
          <div style={{ marginBottom: '1.25rem', display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setUseServer(false)}
              style={{
                flex: 1, padding: '0.625rem', borderRadius: '0.75rem', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600,
                background: !useServer ? '#1F2937' : '#F9FAFB',
                color: !useServer ? 'white' : '#6B7280',
                border: !useServer ? 'none' : '1px solid #F3F4F6',
                transition: 'all 0.2s ease',
              }}
            >
              🌐 {t('v2a.inBrowser')}
            </button>
            <button
              onClick={() => setUseServer(true)}
              style={{
                flex: 1, padding: '0.625rem', borderRadius: '0.75rem', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600,
                background: useServer ? '#1F2937' : '#F9FAFB',
                color: useServer ? 'white' : '#6B7280',
                border: useServer ? 'none' : '1px solid #F3F4F6',
                transition: 'all 0.2s ease',
              }}
            >
              🖥️ {t('v2a.useServer')}
            </button>
          </div>

          {/* Privacy / server note */}
          <div style={{ marginBottom: '1.25rem', padding: '0.75rem 1rem', borderRadius: '0.875rem', background: useServer ? '#FFF7ED' : '#F0FDF4', border: `1px solid ${useServer ? '#FED7AA' : '#BBF7D0'}`, fontSize: '0.8rem', color: useServer ? '#92400E' : '#166534' }}>
            {useServer ? t('v2a.serverNote') : t('v2a.browserNote')}
          </div>

          {/* Large file warning */}
          {file.size > 100 * 1024 * 1024 && (
            <div style={{ marginBottom: '1.25rem', padding: '0.75rem 1rem', borderRadius: '0.875rem', background: '#FFFBEB', border: '1px solid #FDE68A', fontSize: '0.8rem', color: '#92400E' }}>
              ⚠️ {t('v2a.largeFile')}
            </div>
          )}

          {loading && <ProgressBar progress={progress} label={t('v2a.extracting')} />}
          <ErrorAlert message={error} />

          {/* Converted audio preview */}
          {converted && (
            <div style={{ marginBottom: '1.25rem', padding: '1rem', borderRadius: '0.875rem', background: 'linear-gradient(135deg, #F0FDF4, #DCFCE7)', border: '1px solid #BBF7D0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '1.1rem' }}>🎵</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#166534' }}>{t('v2a.previewConverted')}</span>
              </div>
              <audio controls src={converted} style={{ width: '100%' }} />
            </div>
          )}

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {!converted ? (
              <button
                onClick={handleConvert}
                disabled={loading}
                style={{
                  flex: 1, minWidth: '160px',
                  padding: '0.875rem 1.5rem',
                  borderRadius: '0.875rem',
                  border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  background: loading ? '#D1D5DB' : 'linear-gradient(135deg, #F97316, #EA580C)',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  transition: 'all 0.2s ease',
                  boxShadow: loading ? 'none' : '0 6px 20px rgba(249,115,22,0.35)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                }}
              >
                {loading ? (
                  <>
                    <span style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />
                    {t('v2a.extracting')}
                  </>
                ) : (
                  <>{t('v2a.extractAudio')} → {format}</>
                )}
              </button>
            ) : (
              <>
                <button
                  onClick={handleDownload}
                  style={{
                    flex: 2, minWidth: '160px',
                    padding: '0.875rem 1.5rem',
                    borderRadius: '0.875rem',
                    border: 'none', cursor: 'pointer',
                    background: 'linear-gradient(135deg, #16A34A, #15803D)',
                    color: 'white', fontWeight: 700, fontSize: '0.95rem',
                    boxShadow: '0 6px 20px rgba(22,163,74,0.35)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                  }}
                >
                  ⬇️ {t('v2a.download')} {format}
                </button>
                <button
                  onClick={handleReset}
                  style={{
                    flex: 1, minWidth: '100px',
                    padding: '0.875rem 1rem',
                    borderRadius: '0.875rem',
                    border: '1.5px solid #E5E7EB', cursor: 'pointer',
                    background: 'white', color: '#6B7280',
                    fontWeight: 600, fontSize: '0.875rem',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {t('v2a.new')}
                </button>
              </>
            )}
          </div>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}
    </ConverterLayout>
  );
}
