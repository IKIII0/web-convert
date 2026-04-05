// Color conversion helper utilities

export function hexToRgb(hex) {
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) {
    hex = hex.split('').map((c) => c + c).join('');
  }
  const num = parseInt(hex, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

export function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map((x) => {
    const hex = Math.max(0, Math.min(255, Math.round(x))).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

export function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s;
  const l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

export function hslToRgb(h, s, l) {
  h /= 360;
  s /= 100;
  l /= 100;

  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

export function convertColor(input, fromFormat, toFormat) {
  let rgb;

  // Parse input to RGB
  switch (fromFormat) {
    case 'hex':
      rgb = hexToRgb(input);
      break;
    case 'rgb':
      rgb = typeof input === 'string'
        ? (() => {
            const match = input.match(/(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
            if (!match) throw new Error('Invalid RGB format');
            return { r: parseInt(match[1]), g: parseInt(match[2]), b: parseInt(match[3]) };
          })()
        : input;
      break;
    case 'hsl':
      const hsl = typeof input === 'string'
        ? (() => {
            const match = input.match(/(\d+)\s*,\s*(\d+)%?\s*,\s*(\d+)%?/);
            if (!match) throw new Error('Invalid HSL format');
            return { h: parseInt(match[1]), s: parseInt(match[2]), l: parseInt(match[3]) };
          })()
        : input;
      rgb = hslToRgb(hsl.h, hsl.s, hsl.l);
      break;
    default:
      throw new Error(`Unknown color format: ${fromFormat}`);
  }

  // Convert RGB to target format
  switch (toFormat) {
    case 'hex':
      return rgbToHex(rgb.r, rgb.g, rgb.b);
    case 'rgb':
      return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    case 'hsl': {
      const hslResult = rgbToHsl(rgb.r, rgb.g, rgb.b);
      return `hsl(${hslResult.h}, ${hslResult.s}%, ${hslResult.l}%)`;
    }
    default:
      throw new Error(`Unknown color format: ${toFormat}`);
  }
}
