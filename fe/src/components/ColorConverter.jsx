import { useState, useMemo } from 'react';
import { HiOutlineColorSwatch, HiOutlineClipboardCopy, HiOutlineCheck } from 'react-icons/hi';
import { useLanguage } from '../LanguageContext';

function hexToRgb(hex) {
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) hex = hex.split('').map((c) => c + c).join('');
  if (!/^[0-9A-Fa-f]{6}$/.test(hex)) return null;
  const num = parseInt(hex, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}
function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map((x) => Math.max(0, Math.min(255, Math.round(x))).toString(16).padStart(2, '0')).join('');
}
function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s; const l = (max + min) / 2;
  if (max === min) { h = s = 0; } else {
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
  let r, g, b;
  if (s === 0) { r = g = b = l; } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1; if (t > 1) t -= 1;
      if (t < 1/6) return p + (q-p)*6*t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q-p)*(2/3-t)*6;
      return p;
    };
    const q = l < 0.5 ? l*(1+s) : l+s-l*s; const p = 2*l-q;
    r = hue2rgb(p,q,h+1/3); g = hue2rgb(p,q,h); b = hue2rgb(p,q,h-1/3);
  }
  return { r: Math.round(r*255), g: Math.round(g*255), b: Math.round(b*255) };
}

export default function ColorConverter() {
  const [mode, setMode] = useState('hex');
  const [hexInput, setHexInput] = useState('#F97316');
  const [rgbInput, setRgbInput] = useState({ r: 249, g: 115, b: 22 });
  const [hslInput, setHslInput] = useState({ h: 25, s: 95, l: 53 });
  const [copied, setCopied] = useState('');
  const { t } = useLanguage();

  const colors = useMemo(() => {
    let rgb;
    try {
      switch (mode) {
        case 'hex': rgb = hexToRgb(hexInput); break;
        case 'rgb': rgb = { ...rgbInput }; break;
        case 'hsl': rgb = hslToRgb(hslInput.h, hslInput.s, hslInput.l); break;
      }
    } catch { rgb = null; }
    if (!rgb) return null;
    return { hex: rgbToHex(rgb.r, rgb.g, rgb.b), rgb, hsl: rgbToHsl(rgb.r, rgb.g, rgb.b) };
  }, [mode, hexInput, rgbInput, hslInput]);

  const copyToClipboard = (text, label) => { navigator.clipboard.writeText(text); setCopied(label); setTimeout(() => setCopied(''), 2000); };

  const CopyBtn = ({ text, label }) => (
    <button onClick={() => copyToClipboard(text, label)} style={{ marginLeft: '0.5rem', padding: '0.375rem', borderRadius: '0.5rem', background: 'transparent', border: 'none', cursor: 'pointer', color: '#9CA3AF', transition: 'all 0.2s ease' }} title="Copy">
      {copied === label ? <HiOutlineCheck style={{ width: '1rem', height: '1rem', color: '#10B981' }} /> : <HiOutlineClipboardCopy style={{ width: '1rem', height: '1rem' }} />}
    </button>
  );

  const previewColor = colors ? colors.hex : '#cccccc';
  const quickColors = ['#F97316','#EF4444','#8B5CF6','#3B82F6','#10B981','#F59E0B','#EC4899','#1F2937','#FFFFFF'];

  const hslFields = [
    { key: 'h', label: t('colorConv.hue'), max: 360 },
    { key: 's', label: t('colorConv.saturation'), max: 100 },
    { key: 'l', label: t('colorConv.lightness'), max: 100 },
  ];

  const rgbLabels = { r: t('colorConv.red'), g: t('colorConv.green'), b: t('colorConv.blue') };

  return (
    <div style={{ maxWidth: '48rem', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '4rem', height: '4rem', borderRadius: '1rem', background: 'linear-gradient(135deg, #FFF7ED, #FFEDD5)', color: '#F97316', marginBottom: '1rem' }}>
          <HiOutlineColorSwatch style={{ width: '2rem', height: '2rem' }} />
        </div>
        <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', fontWeight: 900, color: '#1F2937' }}>{t('colorConv.title')}</h2>
        <p style={{ marginTop: '0.75rem', color: '#6B7280', fontSize: '1.1rem' }}>{t('colorConv.subtitle')}</p>
      </div>
      <div className="glass-card" style={{ padding: 'clamp(1.5rem, 3vw, 2rem)' }}>
        <div style={{ marginBottom: '2rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ width: '10rem', height: '8rem', borderRadius: '1rem', border: '2px solid white', transition: 'all 0.3s ease', backgroundColor: previewColor, boxShadow: `0 8px 30px ${previewColor}40, inset 0 2px 4px rgba(0,0,0,0.06)`, flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: '200px' }}>
            <h3 style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>{t('colorConv.quickColors')}</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {quickColors.map((c) => (
                <button key={c} onClick={() => { setMode('hex'); setHexInput(c); const rgb = hexToRgb(c); if (rgb) { setRgbInput(rgb); setHslInput(rgbToHsl(rgb.r, rgb.g, rgb.b)); } }} style={{ width: '2.25rem', height: '2.25rem', borderRadius: '0.75rem', border: '2px solid white', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', cursor: 'pointer', transition: 'transform 0.2s ease', backgroundColor: c }} title={c} />
              ))}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', background: '#F3F4F6', padding: '0.375rem', borderRadius: '0.75rem' }}>
          {['hex','rgb','hsl'].map((m) => (
            <button key={m} onClick={() => setMode(m)} style={{ flex: 1, padding: '0.625rem', borderRadius: '0.625rem', fontSize: '0.875rem', fontWeight: 600, transition: 'all 0.2s ease', border: 'none', cursor: 'pointer', background: mode === m ? 'linear-gradient(135deg, #F97316, #EA580C)' : 'transparent', color: mode === m ? 'white' : '#6B7280', boxShadow: mode === m ? '0 4px 12px rgba(249, 115, 22, 0.25)' : 'none' }}>{m.toUpperCase()}</button>
          ))}
        </div>
        <div style={{ marginBottom: '2rem' }}>
          {mode === 'hex' && (
            <div className="animate-fade-in">
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>{t('colorConv.hexColor')}</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <input type="color" value={hexInput.startsWith('#') && hexInput.length === 7 ? hexInput : '#000000'} onChange={(e) => { const v = e.target.value; setHexInput(v); const rgb = hexToRgb(v); if (rgb) { setRgbInput(rgb); setHslInput(rgbToHsl(rgb.r, rgb.g, rgb.b)); } }} style={{ width: '3.5rem', height: '3.5rem', borderRadius: '0.75rem', border: '2px solid #E5E7EB', cursor: 'pointer', padding: 0 }} />
                <input type="text" value={hexInput} onChange={(e) => { const v = e.target.value; setHexInput(v); const rgb = hexToRgb(v); if (rgb) { setRgbInput(rgb); setHslInput(rgbToHsl(rgb.r, rgb.g, rgb.b)); } }} className="input-field" placeholder="#F97316" style={{ fontSize: '1.25rem', fontFamily: 'monospace', fontWeight: 700, flex: 1 }} />
              </div>
            </div>
          )}
          {mode === 'rgb' && (
            <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
              {['r','g','b'].map((ch) => (
                <div key={ch}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>{rgbLabels[ch]}</label>
                  <input type="number" min="0" max="255" value={rgbInput[ch]} onChange={(e) => { const val = Math.max(0, Math.min(255, parseInt(e.target.value) || 0)); const newRgb = { ...rgbInput, [ch]: val }; setRgbInput(newRgb); setHexInput(rgbToHex(newRgb.r, newRgb.g, newRgb.b)); setHslInput(rgbToHsl(newRgb.r, newRgb.g, newRgb.b)); }} className="input-field" style={{ fontSize: '1.125rem', fontFamily: 'monospace', fontWeight: 700, textAlign: 'center' }} />
                  <input type="range" min="0" max="255" value={rgbInput[ch]} onChange={(e) => { const val = parseInt(e.target.value); const newRgb = { ...rgbInput, [ch]: val }; setRgbInput(newRgb); setHexInput(rgbToHex(newRgb.r, newRgb.g, newRgb.b)); setHslInput(rgbToHsl(newRgb.r, newRgb.g, newRgb.b)); }} style={{ width: '100%', marginTop: '0.5rem', accentColor: '#F97316' }} />
                </div>
              ))}
            </div>
          )}
          {mode === 'hsl' && (
            <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
              {hslFields.map(({ key, label, max }) => (
                <div key={key}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>{label}</label>
                  <input type="number" min="0" max={max} value={hslInput[key]} onChange={(e) => { const val = Math.max(0, Math.min(max, parseInt(e.target.value) || 0)); const newHsl = { ...hslInput, [key]: val }; setHslInput(newHsl); const rgb = hslToRgb(newHsl.h, newHsl.s, newHsl.l); setRgbInput(rgb); setHexInput(rgbToHex(rgb.r, rgb.g, rgb.b)); }} className="input-field" style={{ fontSize: '1.125rem', fontFamily: 'monospace', fontWeight: 700, textAlign: 'center' }} />
                  <input type="range" min="0" max={max} value={hslInput[key]} onChange={(e) => { const val = parseInt(e.target.value); const newHsl = { ...hslInput, [key]: val }; setHslInput(newHsl); const rgb = hslToRgb(newHsl.h, newHsl.s, newHsl.l); setRgbInput(rgb); setHexInput(rgbToHex(rgb.r, rgb.g, rgb.b)); }} style={{ width: '100%', marginTop: '0.5rem', accentColor: '#F97316' }} />
                </div>
              ))}
            </div>
          )}
        </div>
        {colors && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <h3 style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('colorConv.convertedValues')}</h3>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', borderRadius: '0.75rem', background: '#FFF7ED', border: '1px solid #FFEDD5' }}>
              <div><span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6B7280' }}>HEX</span><p style={{ fontSize: '1.125rem', fontFamily: 'monospace', fontWeight: 700, color: '#1F2937' }}>{colors.hex.toUpperCase()}</p></div>
              <CopyBtn text={colors.hex.toUpperCase()} label="hex" />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', borderRadius: '0.75rem', background: '#FFF7ED', border: '1px solid #FFEDD5' }}>
              <div><span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6B7280' }}>RGB</span><p style={{ fontSize: '1.125rem', fontFamily: 'monospace', fontWeight: 700, color: '#1F2937' }}>rgb({colors.rgb.r}, {colors.rgb.g}, {colors.rgb.b})</p></div>
              <CopyBtn text={`rgb(${colors.rgb.r}, ${colors.rgb.g}, ${colors.rgb.b})`} label="rgb" />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', borderRadius: '0.75rem', background: '#FFF7ED', border: '1px solid #FFEDD5' }}>
              <div><span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6B7280' }}>HSL</span><p style={{ fontSize: '1.125rem', fontFamily: 'monospace', fontWeight: 700, color: '#1F2937' }}>hsl({colors.hsl.h}, {colors.hsl.s}%, {colors.hsl.l}%)</p></div>
              <CopyBtn text={`hsl(${colors.hsl.h}, ${colors.hsl.s}%, ${colors.hsl.l}%)`} label="hsl" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
