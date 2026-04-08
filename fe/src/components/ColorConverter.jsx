import { useState, useMemo } from 'react';
import { HiOutlineColorSwatch, HiOutlineClipboardCopy, HiOutlineCheck } from 'react-icons/hi';
import { useLanguage } from '../LanguageContext';
import ConverterLayout from './ui/ConverterLayout';
import TabSelector from './ui/TabSelector';

// Color math helpers
function hexToRgb(hex) {
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) hex = hex.split('').map((c) => c + c).join('');
  if (!/^[0-9A-Fa-f]{6}$/.test(hex)) return null;
  const n = parseInt(hex, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}
function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map((x) => Math.max(0, Math.min(255, Math.round(x))).toString(16).padStart(2, '0')).join('');
}
function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}
function hslToRgb(h, s, l) {
  h /= 360; s /= 100; l /= 100;
  if (s === 0) { const v = Math.round(l * 255); return { r: v, g: v, b: v }; }
  const hue2rgb = (p, q, t) => {
    if (t < 0) t += 1; if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  return { r: Math.round(hue2rgb(p, q, h + 1/3) * 255), g: Math.round(hue2rgb(p, q, h) * 255), b: Math.round(hue2rgb(p, q, h - 1/3) * 255) };
}
function rgbToCmyk(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const k = 1 - Math.max(r, g, b);
  if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
  return { c: Math.round((1 - r - k) / (1 - k) * 100), m: Math.round((1 - g - k) / (1 - k) * 100), y: Math.round((1 - b - k) / (1 - k) * 100), k: Math.round(k * 100) };
}

const QUICK_COLORS = [
  '#F97316','#EF4444','#F59E0B','#10B981','#3B82F6','#8B5CF6',
  '#EC4899','#06B6D4','#84CC16','#1F2937','#6B7280','#FFFFFF',
];

const TABS = [
  { id: 'hex', label: 'HEX' },
  { id: 'rgb', label: 'RGB' },
  { id: 'hsl', label: 'HSL' },
];

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      title="Copy"
      style={{ padding: '0.375rem', borderRadius: '0.5rem', background: 'transparent', border: 'none', cursor: 'pointer', color: copied ? '#10B981' : '#9CA3AF', transition: 'all 0.2s ease' }}
    >
      {copied
        ? <HiOutlineCheck style={{ width: '1rem', height: '1rem' }} />
        : <HiOutlineClipboardCopy style={{ width: '1rem', height: '1rem' }} />
      }
    </button>
  );
}

function ResultRow({ label, value }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem 1rem', borderRadius: '0.875rem', background: '#FFF7ED', border: '1px solid #FFEDD5' }}>
      <div>
        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '0.2rem' }}>{label}</span>
        <span style={{ fontSize: '1rem', fontFamily: 'monospace', fontWeight: 700, color: '#1F2937' }}>{value}</span>
      </div>
      <CopyButton text={value} />
    </div>
  );
}

export default function ColorConverter() {
  const [mode, setMode] = useState('hex');
  const [hex, setHex] = useState('#F97316');
  const [rgb, setRgb] = useState({ r: 249, g: 115, b: 22 });
  const [hsl, setHsl] = useState({ h: 25, s: 95, l: 53 });
  const { t } = useLanguage();

  const syncFromHex = (v) => {
    setHex(v);
    const r = hexToRgb(v);
    if (r) { setRgb(r); setHsl(rgbToHsl(r.r, r.g, r.b)); }
  };
  const syncFromRgb = (newRgb) => {
    setRgb(newRgb);
    setHex(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
    setHsl(rgbToHsl(newRgb.r, newRgb.g, newRgb.b));
  };
  const syncFromHsl = (newHsl) => {
    setHsl(newHsl);
    const r = hslToRgb(newHsl.h, newHsl.s, newHsl.l);
    setRgb(r);
    setHex(rgbToHex(r.r, r.g, r.b));
  };

  const colors = useMemo(() => {
    const r = hexToRgb(hex);
    if (!r) return null;
    const h = rgbToHsl(r.r, r.g, r.b);
    const cmyk = rgbToCmyk(r.r, r.g, r.b);
    return {
      hex: rgbToHex(r.r, r.g, r.b).toUpperCase(),
      rgb: `rgb(${r.r}, ${r.g}, ${r.b})`,
      hsl: `hsl(${h.h}, ${h.s}%, ${h.l}%)`,
      cmyk: `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`,
      css: `rgba(${r.r}, ${r.g}, ${r.b}, 1)`,
    };
  }, [hex]);

  const previewColor = colors?.hex || '#cccccc';

  // Determine if color is light or dark for text contrast
  const rgbVals = hexToRgb(previewColor);
  const luminance = rgbVals ? (0.299 * rgbVals.r + 0.587 * rgbVals.g + 0.114 * rgbVals.b) / 255 : 0.5;
  const textOnColor = luminance > 0.5 ? '#1F2937' : 'white';

  return (
    <ConverterLayout
      icon={<HiOutlineColorSwatch style={{ width: '2rem', height: '2rem', color: '#F97316' }} />}
      title={t('colorConv.title')}
      subtitle={t('colorConv.subtitle')}
    >
      {/* Color preview + quick colors */}
      <div style={{ display: 'flex', gap: '1.25rem', marginBottom: '1.75rem', flexWrap: 'wrap' }}>
        {/* Big preview swatch */}
        <div style={{
          width: '9rem', height: '9rem', borderRadius: '1.25rem',
          background: previewColor,
          boxShadow: `0 8px 30px ${previewColor}60`,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, transition: 'all 0.3s ease',
        }}>
          <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', fontWeight: 700, color: textOnColor, opacity: 0.8 }}>{previewColor}</span>
        </div>

        {/* Quick colors */}
        <div style={{ flex: 1, minWidth: '200px' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>
            {t('colorConv.quickColors')}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {QUICK_COLORS.map((c) => (
              <button
                key={c}
                onClick={() => syncFromHex(c)}
                title={c}
                style={{
                  width: '2.25rem', height: '2.25rem', borderRadius: '0.625rem',
                  background: c, cursor: 'pointer', transition: 'transform 0.15s ease',
                  border: hex.toUpperCase() === c.toUpperCase() ? '3px solid #F97316' : '2px solid white',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.15)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Mode tabs */}
      <TabSelector tabs={TABS} active={mode} onChange={setMode} />

      {/* Input section */}
      <div style={{ marginBottom: '1.75rem' }}>
        {mode === 'hex' && (
          <div className="animate-fade-in">
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.625rem' }}>
              {t('colorConv.hexColor')}
            </label>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <input
                type="color"
                value={hex.length === 7 && hex.startsWith('#') ? hex : '#000000'}
                onChange={(e) => syncFromHex(e.target.value)}
                style={{ width: '3.5rem', height: '3.5rem', borderRadius: '0.75rem', border: '2px solid #E5E7EB', cursor: 'pointer', padding: 0 }}
              />
              <input
                type="text"
                value={hex}
                onChange={(e) => syncFromHex(e.target.value)}
                className="input-field"
                placeholder="#F97316"
                style={{ flex: 1, fontSize: '1.25rem', fontFamily: 'monospace', fontWeight: 700 }}
              />
            </div>
          </div>
        )}

        {mode === 'rgb' && (
          <div className="animate-fade-in">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
              {[
                { key: 'r', label: t('colorConv.red'), color: '#EF4444' },
                { key: 'g', label: t('colorConv.green'), color: '#10B981' },
                { key: 'b', label: t('colorConv.blue'), color: '#3B82F6' },
              ].map(({ key, label, color }) => (
                <div key={key}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color, marginBottom: '0.5rem' }}>{label}</label>
                  <input
                    type="number" min="0" max="255"
                    value={rgb[key]}
                    onChange={(e) => syncFromRgb({ ...rgb, [key]: Math.max(0, Math.min(255, parseInt(e.target.value) || 0)) })}
                    className="input-field"
                    style={{ fontSize: '1.1rem', fontFamily: 'monospace', fontWeight: 700, textAlign: 'center' }}
                  />
                  <input
                    type="range" min="0" max="255"
                    value={rgb[key]}
                    onChange={(e) => syncFromRgb({ ...rgb, [key]: parseInt(e.target.value) })}
                    style={{ width: '100%', marginTop: '0.5rem', accentColor: color }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {mode === 'hsl' && (
          <div className="animate-fade-in">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
              {[
                { key: 'h', label: t('colorConv.hue'), max: 360, color: '#F97316' },
                { key: 's', label: t('colorConv.saturation'), max: 100, color: '#8B5CF6' },
                { key: 'l', label: t('colorConv.lightness'), max: 100, color: '#06B6D4' },
              ].map(({ key, label, max, color }) => (
                <div key={key}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color, marginBottom: '0.5rem' }}>{label}</label>
                  <input
                    type="number" min="0" max={max}
                    value={hsl[key]}
                    onChange={(e) => syncFromHsl({ ...hsl, [key]: Math.max(0, Math.min(max, parseInt(e.target.value) || 0)) })}
                    className="input-field"
                    style={{ fontSize: '1.1rem', fontFamily: 'monospace', fontWeight: 700, textAlign: 'center' }}
                  />
                  <input
                    type="range" min="0" max={max}
                    value={hsl[key]}
                    onChange={(e) => syncFromHsl({ ...hsl, [key]: parseInt(e.target.value) })}
                    style={{ width: '100%', marginTop: '0.5rem', accentColor: color }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* All converted values */}
      {colors && (
        <div className="animate-fade-in">
          <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>
            {t('colorConv.convertedValues')}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <ResultRow label="HEX" value={colors.hex} />
            <ResultRow label="RGB" value={colors.rgb} />
            <ResultRow label="HSL" value={colors.hsl} />
            <ResultRow label="CMYK" value={colors.cmyk} />
            <ResultRow label="CSS rgba" value={colors.css} />
          </div>
        </div>
      )}
    </ConverterLayout>
  );
}
