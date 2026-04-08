import { useState, useMemo } from 'react';
import { HiOutlineScale, HiOutlineSwitchHorizontal } from 'react-icons/hi';
import { useLanguage } from '../LanguageContext';
import ConverterLayout from './ui/ConverterLayout';

const UNIT_DATA = {
  length:      { units: { meter: 1, kilometer: 1000, centimeter: 0.01, millimeter: 0.001, mile: 1609.344, yard: 0.9144, foot: 0.3048, inch: 0.0254, 'nautical mile': 1852 } },
  weight:      { units: { kilogram: 1, gram: 0.001, milligram: 0.000001, ton: 1000, 'metric ton': 1000, pound: 0.453592, ounce: 0.0283495, stone: 6.35029 } },
  temperature: { units: null },
  volume:      { units: { liter: 1, milliliter: 0.001, 'cubic meter': 1000, gallon: 3.78541, quart: 0.946353, pint: 0.473176, cup: 0.236588, tablespoon: 0.0147868, teaspoon: 0.00492892, 'fluid ounce': 0.0295735 } },
  area:        { units: { 'square meter': 1, 'square kilometer': 1e6, 'square centimeter': 0.0001, 'square mile': 2589988.11, 'square yard': 0.836127, 'square foot': 0.092903, 'square inch': 0.00064516, hectare: 10000, acre: 4046.86 } },
  speed:       { units: { 'meter/second': 1, 'kilometer/hour': 0.277778, 'mile/hour': 0.44704, knot: 0.514444, 'foot/second': 0.3048 } },
  time:        { units: { second: 1, minute: 60, hour: 3600, day: 86400, week: 604800, month: 2629746, year: 31556952 } },
  data:        { units: { bit: 0.125, byte: 1, kilobyte: 1024, megabyte: 1048576, gigabyte: 1073741824, terabyte: 1099511627776, petabyte: 1.126e15 } },
  energy:      { units: { joule: 1, kilojoule: 1000, calorie: 4.184, kilocalorie: 4184, 'watt-hour': 3600, 'kilowatt-hour': 3600000, BTU: 1055.06 } },
  pressure:    { units: { pascal: 1, kilopascal: 1000, megapascal: 1e6, bar: 100000, psi: 6894.76, atm: 101325, mmHg: 133.322 } },
};

const TEMP_UNITS = ['celsius', 'fahrenheit', 'kelvin'];

function convertTemp(v, from, to) {
  let c;
  if (from === 'celsius') c = v;
  else if (from === 'fahrenheit') c = (v - 32) * 5 / 9;
  else c = v - 273.15;
  if (to === 'celsius') return c;
  if (to === 'fahrenheit') return c * 9 / 5 + 32;
  return c + 273.15;
}

function formatResult(n) {
  if (isNaN(n)) return '—';
  if (Math.abs(n) === 0) return '0';
  if (Math.abs(n) >= 0.001 && Math.abs(n) < 1e12) return n.toLocaleString('en-US', { maximumFractionDigits: 8 });
  return n.toExponential(4);
}

function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

export default function UnitConverter() {
  const [category, setCategory] = useState('length');
  const [fromUnit, setFromUnit] = useState('meter');
  const [toUnit, setToUnit] = useState('kilometer');
  const [value, setValue] = useState('1');
  const { t } = useLanguage();

  const isTemp = category === 'temperature';
  const units = isTemp ? TEMP_UNITS : Object.keys(UNIT_DATA[category]?.units || {});

  const result = useMemo(() => {
    const num = parseFloat(value);
    if (isNaN(num)) return '';
    if (isTemp) return formatResult(convertTemp(num, fromUnit, toUnit));
    const f = UNIT_DATA[category]?.units;
    if (!f || !f[fromUnit] || !f[toUnit]) return '—';
    return formatResult((num * f[fromUnit]) / f[toUnit]);
  }, [value, fromUnit, toUnit, category]);

  const handleCategory = (cat) => {
    setCategory(cat);
    const u = cat === 'temperature' ? TEMP_UNITS : Object.keys(UNIT_DATA[cat].units);
    setFromUnit(u[0]);
    setToUnit(u[1] || u[0]);
    setValue('1');
  };

  const handleSwap = () => { setFromUnit(toUnit); setToUnit(fromUnit); };

  const categoryKeys = Object.keys(UNIT_DATA);

  return (
    <ConverterLayout
      icon={<HiOutlineScale style={{ width: '2rem', height: '2rem', color: '#F97316' }} />}
      title={t('unitConv.title')}
      subtitle={t('unitConv.subtitle')}
    >
      {/* Category grid */}
      <div style={{ marginBottom: '2rem' }}>
        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>
          {t('unitConv.category')}
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '0.5rem' }}>
          {categoryKeys.map((key) => (
            <button
              key={key}
              onClick={() => handleCategory(key)}
              style={{
                padding: '0.5rem 0.75rem', borderRadius: '0.75rem', border: 'none', cursor: 'pointer',
                background: category === key ? 'linear-gradient(135deg, #F97316, #EA580C)' : '#F9FAFB',
                border: category === key ? 'none' : '1px solid #F3F4F6',
                color: category === key ? 'white' : '#4B5563',
                fontSize: '0.8rem', fontWeight: 600,
                transition: 'all 0.2s ease',
                boxShadow: category === key ? '0 4px 12px rgba(249,115,22,0.25)' : 'none',
              }}
            >
              {capitalize(key)}
            </button>
          ))}
        </div>
      </div>

      {/* Converter */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {/* From */}
        <div style={{ padding: '1.25rem', borderRadius: '1rem', background: 'linear-gradient(135deg, #FFF7ED, white)', border: '1px solid #FFEDD5' }}>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#F97316', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>
            {t('unitConv.from')}
          </label>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="input-field"
              placeholder={t('unitConv.enterValue')}
              style={{ flex: 1, fontSize: '1.5rem', fontWeight: 700, minWidth: '100px' }}
            />
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="select-field"
              style={{ minWidth: '160px' }}
            >
              {units.map((u) => <option key={u} value={u}>{capitalize(u)}</option>)}
            </select>
          </div>
        </div>

        {/* Swap button */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button
            onClick={handleSwap}
            style={{ width: '2.75rem', height: '2.75rem', borderRadius: '50%', background: 'linear-gradient(135deg, #F97316, #EA580C)', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(249,115,22,0.3)', transition: 'all 0.2s ease' }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'rotate(180deg)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'rotate(0deg)'}
          >
            <HiOutlineSwitchHorizontal style={{ width: '1.25rem', height: '1.25rem', transform: 'rotate(90deg)' }} />
          </button>
        </div>

        {/* To */}
        <div style={{ padding: '1.25rem', borderRadius: '1rem', background: 'linear-gradient(135deg, white, #FFF7ED)', border: '1px solid #FFEDD5' }}>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#F97316', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>
            {t('unitConv.to')}
          </label>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div
              className="input-field"
              style={{ flex: 1, fontSize: '1.5rem', fontWeight: 700, background: '#F9FAFB', color: '#EA580C', display: 'flex', alignItems: 'center', minHeight: '3.5rem', minWidth: '100px' }}
            >
              {result || '—'}
            </div>
            <select
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="select-field"
              style={{ minWidth: '160px' }}
            >
              {units.map((u) => <option key={u} value={u}>{capitalize(u)}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Result summary */}
      {value && result && result !== '—' && (
        <div className="animate-fade-in" style={{ marginTop: '1.25rem', padding: '1rem 1.25rem', borderRadius: '0.875rem', background: '#F9FAFB', border: '1px solid #F3F4F6', textAlign: 'center' }}>
          <p style={{ fontSize: '0.9rem', color: '#6B7280' }}>
            <span style={{ fontWeight: 700, color: '#374151' }}>{value} {capitalize(fromUnit)}</span>
            <span style={{ margin: '0 0.5rem', color: '#F97316' }}>=</span>
            <span style={{ fontWeight: 700, color: '#EA580C' }}>{result} {capitalize(toUnit)}</span>
          </p>
        </div>
      )}
    </ConverterLayout>
  );
}
