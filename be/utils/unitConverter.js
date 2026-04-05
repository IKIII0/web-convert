// Unit conversion helper utilities

const conversionFactors = {
  length: {
    meter: 1,
    kilometer: 1000,
    centimeter: 0.01,
    millimeter: 0.001,
    mile: 1609.344,
    yard: 0.9144,
    foot: 0.3048,
    inch: 0.0254,
  },
  weight: {
    kilogram: 1,
    gram: 0.001,
    milligram: 0.000001,
    ton: 1000,
    pound: 0.453592,
    ounce: 0.0283495,
  },
  volume: {
    liter: 1,
    milliliter: 0.001,
    gallon: 3.78541,
    quart: 0.946353,
    pint: 0.473176,
    cup: 0.236588,
    tablespoon: 0.0147868,
    teaspoon: 0.00492892,
  },
  area: {
    'square meter': 1,
    'square kilometer': 1000000,
    'square centimeter': 0.0001,
    'square mile': 2589988.11,
    'square yard': 0.836127,
    'square foot': 0.092903,
    'square inch': 0.00064516,
    hectare: 10000,
    acre: 4046.86,
  },
  speed: {
    'meter/second': 1,
    'kilometer/hour': 0.277778,
    'mile/hour': 0.44704,
    knot: 0.514444,
    'foot/second': 0.3048,
  },
  time: {
    second: 1,
    minute: 60,
    hour: 3600,
    day: 86400,
    week: 604800,
    month: 2629746,
    year: 31556952,
  },
  data: {
    byte: 1,
    kilobyte: 1024,
    megabyte: 1048576,
    gigabyte: 1073741824,
    terabyte: 1099511627776,
  },
};

function convertTemperature(value, from, to) {
  let celsius;

  // Convert to Celsius first
  switch (from) {
    case 'celsius':
      celsius = value;
      break;
    case 'fahrenheit':
      celsius = (value - 32) * (5 / 9);
      break;
    case 'kelvin':
      celsius = value - 273.15;
      break;
    default:
      throw new Error(`Unknown temperature unit: ${from}`);
  }

  // Convert from Celsius to target
  switch (to) {
    case 'celsius':
      return celsius;
    case 'fahrenheit':
      return celsius * (9 / 5) + 32;
    case 'kelvin':
      return celsius + 273.15;
    default:
      throw new Error(`Unknown temperature unit: ${to}`);
  }
}

export function convertUnit(value, from, to, category) {
  if (category === 'temperature') {
    return convertTemperature(value, from, to);
  }

  const factors = conversionFactors[category];
  if (!factors) {
    throw new Error(`Unknown category: ${category}`);
  }

  if (!factors[from] || !factors[to]) {
    throw new Error(`Unknown unit: ${from} or ${to}`);
  }

  // Convert: value in "from" unit → base unit → "to" unit
  const baseValue = value * factors[from];
  return baseValue / factors[to];
}

export function getCategories() {
  const categories = Object.keys(conversionFactors);
  categories.push('temperature');
  return categories;
}

export function getUnits(category) {
  if (category === 'temperature') {
    return ['celsius', 'fahrenheit', 'kelvin'];
  }
  const factors = conversionFactors[category];
  if (!factors) return [];
  return Object.keys(factors);
}
