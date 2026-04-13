/**
 * 工具注册表 (Central Registry)
 * 已适配 i18n 并校对路径
 */

export const CATEGORIES = [
  { id: 'all', nameKey: 'home.categories.all' },
  { id: 'developer', nameKey: 'home.categories.developer' },
  { id: 'design', nameKey: 'home.categories.design' },
  { id: 'calc', nameKey: 'home.categories.calc' },
  { id: 'life', nameKey: 'home.categories.life' }
];

export const TOOLS = [
  { 
    id: 'mortgage-calc', 
    nameKey: 'tools.mortgage-calculator.name', 
    category: 'calc', 
    emoji: '🏠', 
    grad: 'linear-gradient(135deg, #0ea5e9, #6366f1)', 
    descKey: 'tools.mortgage-calculator.description',
    path: '/pages/tools/daily/mortgage'
  },
  { 
    id: 'json-formatter', 
    nameKey: 'tools.json-formatter.name', 
    category: 'developer', 
    emoji: 'JS', 
    grad: 'linear-gradient(135deg, #6366f1, #a855f7)', 
    descKey: 'tools.json-formatter.description',
    path: '/pages/tools/developer/json-formatter'
  },
  { 
    id: 'qr-generator', 
    nameKey: 'tools.qr-generator.name', 
    category: 'design', 
    emoji: 'QR', 
    grad: 'linear-gradient(135deg, #f59e0b, #ef4444)', 
    descKey: 'tools.qr-generator.description',
    path: '/pages/tools/design/qr-generator'
  },
  { 
    id: 'color-palette', 
    nameKey: 'tools.color-palette.name', 
    category: 'design', 
    emoji: '🎨', 
    grad: 'linear-gradient(135deg, #ec4899, #8b5cf6)', 
    descKey: 'tools.color-palette.description',
    path: '/pages/tools/design/color-palette'
  },
  { 
    id: 'image-compressor', 
    nameKey: 'tools.image-compressor.name', 
    category: 'design', 
    emoji: '🖼️', 
    grad: 'linear-gradient(135deg, #10b981, #059669)', 
    descKey: 'tools.image-compressor.description',
    path: '/pages/tools/design/image-compressor'
  },
  { 
    id: 'unit-converter', 
    nameKey: 'tools.unit-converter.name', 
    category: 'calc', 
    emoji: '⚖️', 
    grad: 'linear-gradient(135deg, #34AADC, #007AFF)', 
    descKey: 'tools.unit-converter.description',
    path: '/pages/tools/daily/unit-converter'
  },
  { 
    id: 'password-gen', 
    nameKey: 'tools.password-generator.name', 
    category: 'life', 
    emoji: '🔑', 
    grad: 'linear-gradient(135deg, #64748b, #334155)', 
    descKey: 'tools.password-generator.description',
    path: '/pages/tools/daily/password-gen'
  },
  { 
    id: 'amount-to-uppercase', 
    nameKey: 'tools.amount-to-uppercase.name', 
    category: 'calc', 
    emoji: '💰', 
    grad: 'linear-gradient(135deg, #fbbf24, #f59e0b)', 
    descKey: 'tools.amount-to-uppercase.description',
    path: '/pages/tools/daily/amount-to-uppercase'
  },
  { 
    id: 'chinese-converter', 
    nameKey: 'tools.chinese-converter.name', 
    category: 'life', 
    emoji: '🀄', 
    grad: 'linear-gradient(135deg, #34d399, #059669)', 
    descKey: 'tools.chinese-converter.description',
    path: '/pages/tools/daily/chinese-converter'
  },
  { 
    id: 'pinyin-converter', 
    nameKey: 'tools.pinyin-converter.name', 
    category: 'life', 
    emoji: '🔤', 
    grad: 'linear-gradient(135deg, #60a5fa, #3b82f6)', 
    descKey: 'tools.pinyin-converter.description',
    path: '/pages/tools/daily/pinyin-converter'
  },
  { 
    id: 'due-date-calc', 
    nameKey: 'tools.due-date-calculator.name', 
    category: 'life', 
    emoji: '🤰', 
    grad: 'linear-gradient(135deg, #f472b6, #db2777)', 
    descKey: 'tools.due-date-calculator.description',
    path: '/pages/tools/daily/due-date-calculator'
  },
  { 
    id: 'safe-period-calc', 
    nameKey: 'tools.safe-period-calculator.name', 
    category: 'life', 
    emoji: '🛡️', 
    grad: 'linear-gradient(135deg, #60a5fa, #3b82f6)', 
    descKey: 'tools.safe-period-calculator.description',
    path: '/pages/tools/daily/safe-period-calculator'
  },
  { 
    id: 'solar-terms', 
    nameKey: 'tools.solar-terms.name', 
    category: 'life', 
    emoji: '🍃', 
    grad: 'linear-gradient(135deg, #34d399, #10b981)', 
    descKey: 'tools.solar-terms.description',
    path: '/pages/tools/daily/solar-terms'
  },
  { 
    id: 'timer', 
    nameKey: 'tools.timer.name', 
    category: 'life', 
    emoji: '⏱️', 
    grad: 'linear-gradient(135deg, #f87171, #ef4444)', 
    descKey: 'tools.timer.description',
    path: '/pages/tools/daily/timer'
  },
  { 
    id: 'base64-converter', 
    nameKey: 'tools.base64-converter.name', 
    category: 'developer', 
    emoji: 'B64', 
    grad: 'linear-gradient(135deg, #10b981, #3b82f6)', 
    descKey: 'tools.base64-converter.description',
    path: '/pages/tools/developer/base64-converter'
  },
  { 
    id: 'base-converter', 
    nameKey: 'tools.base-converter.name', 
    category: 'developer', 
    emoji: '101', 
    grad: 'linear-gradient(135deg, #fbbf24, #f59e0b)', 
    descKey: 'tools.base-converter.description',
    path: '/pages/tools/developer/base-converter'
  },
  { 
    id: 'timestamp-converter', 
    nameKey: 'tools.timestamp-converter.name', 
    category: 'developer', 
    emoji: '⏰', 
    grad: 'linear-gradient(135deg, #6366f1, #8b5cf6)', 
    descKey: 'tools.timestamp-converter.description',
    path: '/pages/tools/developer/timestamp-converter'
  },
  { 
    id: 'bmi-calc', 
    nameKey: 'tools.bmi-calculator.name', 
    category: 'calc', 
    emoji: '⚖️', 
    grad: 'linear-gradient(135deg, #6366f1, #8b5cf6)', 
    descKey: 'tools.bmi-calculator.description',
    path: '/pages/tools/daily/bmi'
  },
  { 
    id: 'bmr-calc', 
    nameKey: 'tools.bmr-calculator.name', 
    category: 'calc', 
    emoji: '🔥', 
    grad: 'linear-gradient(135deg, #10b981, #3b82f6)', 
    descKey: 'tools.bmr-calculator.description',
    path: '/pages/tools/daily/bmr'
  },
  { 
    id: 'roi-calc', 
    nameKey: 'tools.roi-calculator.name', 
    category: 'calc', 
    emoji: '📈', 
    grad: 'linear-gradient(135deg, #f59e0b, #ef4444)', 
    descKey: 'tools.roi-calculator.description',
    path: '/pages/tools/daily/roi'
  },
  { 
    id: 'word-counter', 
    nameKey: 'tools.word-counter.name', 
    category: 'design', 
    emoji: '📝', 
    grad: 'linear-gradient(135deg, #6366f1, #10b981)', 
    descKey: 'tools.word-counter.description',
    path: '/pages/tools/design/word-counter'
  },
  { 
    id: 'morse-converter', 
    nameKey: 'tools.morse-converter.name', 
    category: 'developer', 
    emoji: '📡', 
    grad: 'linear-gradient(135deg, #475569, #1e293b)', 
    descKey: 'tools.morse-converter.description',
    path: '/pages/tools/developer/morse-converter'
  },
  { 
    id: 'word-frequency', 
    nameKey: 'tools.word-frequency.name', 
    category: 'design', 
    emoji: '📊', 
    grad: 'linear-gradient(135deg, #f59e0b, #10b981)', 
    descKey: 'tools.word-frequency.description',
    path: '/pages/tools/design/word-frequency'
  },
  { 
    id: 'image-color-picker', 
    nameKey: 'tools.image-color-picker.name', 
    category: 'design', 
    emoji: '🎨', 
    grad: 'linear-gradient(135deg, #6366f1, #ec4899)', 
    descKey: 'tools.image-color-picker.description',
    path: '/pages/tools/design/image-color-picker'
  },
  { 
    id: 'image-cropper', 
    nameKey: 'tools.image-cropper.name', 
    category: 'design', 
    emoji: '✂️', 
    grad: 'linear-gradient(135deg, #10b981, #3b82f6)', 
    descKey: 'tools.image-cropper.description',
    path: '/pages/tools/design/image-cropper'
  },
  { 
    id: 'font-viewer', 
    nameKey: 'tools.font-viewer.name', 
    category: 'design', 
    emoji: 'Aa', 
    grad: 'linear-gradient(135deg, #6366f1, #8b5cf6)', 
    descKey: 'tools.font-viewer.description',
    path: '/pages/tools/design/font-viewer'
  },
  { 
    id: 'markdown-previewer', 
    nameKey: 'tools.markdown-previewer.name', 
    category: 'design', 
    emoji: '📝', 
    grad: 'linear-gradient(135deg, #1e293b, #475569)', 
    descKey: 'tools.markdown-previewer.description',
    path: '/pages/tools/design/markdown-previewer'
  }
];

export const getToolById = (id) => TOOLS.find(t => t.id === id);
export const getToolsByCategory = (cat) => cat === 'all' ? TOOLS : TOOLS.filter(t => t.category === cat);
