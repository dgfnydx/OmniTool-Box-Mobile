/**
 * 单位换算工具逻辑
 */

export const UNIT_CATEGORIES = {
  length: {
    name: '长度',
    units: {
      meters: { name: '米', ratio: 1 },
      kilometers: { name: '千米', ratio: 1000 },
      centimeters: { name: '厘米', ratio: 0.01 },
      millimeters: { name: '毫米', ratio: 0.001 },
      miles: { name: '英里', ratio: 1609.34 },
      yards: { name: '码', ratio: 0.9144 },
      feet: { name: '英尺', ratio: 0.3048 },
      inches: { name: '英寸', ratio: 0.0254 }
    }
  },
  weight: {
    name: '重量',
    units: {
      kilograms: { name: '千克', ratio: 1 },
      grams: { name: '克', ratio: 0.001 },
      milligrams: { name: '毫克', ratio: 0.000001 },
      tonnes: { name: '吨', ratio: 1000 },
      pounds: { name: '磅', ratio: 0.453592 },
      ounces: { name: '盎司', ratio: 0.0283495 }
    }
  },
  digital: {
    name: '数字存储',
    units: {
      bytes: { name: 'B', ratio: 1 },
      kilobytes: { name: 'KB', ratio: 1024 },
      megabytes: { name: 'MB', ratio: 1024 * 1024 },
      gigabytes: { name: 'GB', ratio: 1024 * 1024 * 1024 },
      terabytes: { name: 'TB', ratio: 1024 * 1024 * 1024 * 1024 }
    }
  },
  area: {
    name: '面积',
    units: {
      squareMeters: { name: '平方米', ratio: 1 },
      squareKilometers: { name: '平方千米', ratio: 1000000 },
      squareFeet: { name: '平方英尺', ratio: 0.092903 },
      acres: { name: '英亩', ratio: 4046.86 },
      hectares: { name: '公顷', ratio: 10000 }
    }
  },
  temperature: {
    name: '温度',
    units: {
      celsius: { name: '摄氏度', ratio: 0 },
      fahrenheit: { name: '华氏度', ratio: 0 },
      kelvin: { name: '开氏度', ratio: 0 }
    }
  }
};

/**
 * 执行转换
 */
export function convertUnit(val, from, to, category) {
  const value = Number(val);
  if (isNaN(value)) return 0;

  if (category === 'temperature') {
    if (from === 'celsius' && to === 'fahrenheit') return (value * 9/5) + 32;
    if (from === 'fahrenheit' && to === 'celsius') return (value - 32) * 5/9;
    if (from === 'celsius' && to === 'kelvin') return value + 273.15;
    if (from === 'kelvin' && to === 'celsius') return value - 273.15;
    if (from === 'fahrenheit' && to === 'kelvin') return (value - 32) * 5/9 + 273.15;
    if (from === 'kelvin' && to === 'fahrenheit') return (value - 273.15) * 9/5 + 32;
    return value;
  }
  
  const fromRatio = UNIT_CATEGORIES[category].units[from].ratio;
  const toRatio = UNIT_CATEGORIES[category].units[to].ratio;
  
  return (value * fromRatio) / toRatio;
}
