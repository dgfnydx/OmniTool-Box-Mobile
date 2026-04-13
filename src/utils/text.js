/**
 * 文本/字符处理工具
 */

export const PASSWORD_CHARSET = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+~`|}{[]:;?><,./-='
};

/**
 * 生成随机密码
 */
export function generateRandomPassword(options = {}) {
  const {
    length = 16,
    uppercase = true,
    lowercase = true,
    numbers = true,
    symbols = true
  } = options;

  let characters = '';
  if (uppercase) characters += PASSWORD_CHARSET.uppercase;
  if (lowercase) characters += PASSWORD_CHARSET.lowercase;
  if (numbers) characters += PASSWORD_CHARSET.numbers;
  if (symbols) characters += PASSWORD_CHARSET.symbols;

  if (characters === '') return '';

  let result = '';
  // 移动端/小程序兼容性随机数生成
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  return result;
}

/**
 * 评估密码强度 (0-5)
 */
export function evaluatePasswordStrength(pwd) {
  if (!pwd) return 0;
  let strength = 0;
  if (pwd.length >= 12) strength += 1;
  if (/[A-Z]/.test(pwd)) strength += 1;
  if (/[a-z]/.test(pwd)) strength += 1;
  if (/[0-9]/.test(pwd)) strength += 1;
  if (/[^A-Za-z0-9]/.test(pwd)) strength += 1;
  return strength;
}

/**
 * 统计文本各项指标
 */
export function analyzeText(content) {
  if (!content) {
    return { words: 0, charsWithSpaces: 0, charsNoSpaces: 0, lines: 0, sentences: 0, readingTime: 0 };
  }

  // 单词/字数统计 (支持中英文混排)
  const enWords = content.match(/[a-zA-Z0-9']+/g) || [];
  const cjkChars = content.match(/[\u4e00-\u9fa5\u3040-\u30ff\uac00-\ud7af]/g) || [];
  const words = enWords.length + cjkChars.length;

  const charsWithSpaces = content.length;
  const charsNoSpaces = content.replace(/\s/g, '').length;
  const lines = content.split('\n').length;
  
  // 句子统计 (匹配 . ! ? 以及中文的 。 ！ ？)
  const sentences = content.match(/[^.!?。！？]+[.!?。！？]+/g) || [];
  
  // 阅读时长 (基于 200 词/分钟)
  const readingTime = Math.ceil(words / 200);

  return { 
    words, 
    charsWithSpaces, 
    charsNoSpaces, 
    lines, 
    sentences: sentences.length, 
    readingTime 
  };
}

const MORSE_CODE_MAP = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
  'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
  'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
  'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
  'Y': '-.--', 'Z': '--..',
  '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
  '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
  '.': '.-.-.-', ',': '--..--', '?': '..--..', "'": '.----.', '!': '-.-.--',
  '/': '-..-.', '(': '-.--.', ')': '-.--.-', '&': '.-...', ':': '---...',
  ';': '-.-.-.', '=': '-...-', '+': '.-.-.', '-': '-....-', '_': '..--.-',
  '"': '.-..-.', '$': '...-..-', '@': '.--.-.', '\\': '.-..-.',
  ' ': '/'
};

const REVERSE_MORSE_MAP = Object.entries(MORSE_CODE_MAP).reduce(
  (acc, [key, value]) => ({ ...acc, [value]: key }),
  {}
);

/**
 * 转换为摩尔斯电码
 */
export function textToMorse(text) {
  if (!text) return '';
  const morseArray = [];
  for (const char of text) {
    if (char === '\n') {
      morseArray.push('\n');
      continue;
    }
    const upperChar = char.toUpperCase();
    if (MORSE_CODE_MAP[upperChar]) {
      morseArray.push(MORSE_CODE_MAP[upperChar]);
    } else {
      // 非 ASCII 字符处理为 Unicode 转义序列的摩尔斯
      const unicodeHex = char.charCodeAt(0).toString(16).padStart(4, '0').toUpperCase();
      const escapeSeq = `\\U${unicodeHex}`;
      for (const s of escapeSeq) {
        morseArray.push(MORSE_CODE_MAP[s] || '');
      }
    }
  }
  return morseArray.filter(s => s !== '').join(' ');
}

/**
 * 从摩尔斯电码还原
 */
export function morseToText(morse, invalidErrorMsg = 'Invalid Morse') {
  if (!morse) return '';
  const codes = morse.trim().split(/\s+/);
  let decodedText = '';
  for (const code of codes) {
    if (code === '/') {
      decodedText += ' ';
      continue;
    }
    const char = REVERSE_MORSE_MAP[code];
    if (!char && code !== '') {
      throw new Error(`${invalidErrorMsg}: ${code}`);
    }
    decodedText += char || '';
  }
  // 处理 Unicode 转义回字符
  return decodedText.replace(/\\U([0-9A-F]{4})/gi, (_, hex) => {
    return String.fromCharCode(parseInt(hex, 16));
  });
}

/**
 * 分析词频
 */
export function getWordFrequency(text, options = {}) {
  const {
    ignoreCase = true,
    ignorePunctuation = true,
    filterStopWords = false,
    minFrequency = 1,
    stopWords = []
  } = options;

  if (!text.trim()) return [];

  let content = text;
  if (ignoreCase) content = content.toLowerCase();
  
  if (ignorePunctuation) {
    // 包含中英文常见标点
    content = content.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()！？。，；：“”（）《》]/g, ' ');
  }

  const freqMap = new Map();
  const stopWordsSet = new Set(stopWords.map(w => ignoreCase ? w.toLowerCase() : w));
  
  // 分割单词
  const words = content.split(/\s+/);
  
  words.forEach(rawWord => {
    if (!rawWord) return;

    // 正则匹配：英文序列 或 单个中日韩字符
    const matches = rawWord.match(/[a-zA-Z0-9']+|[\u4e00-\u9fa5\u3040-\u30ff\uac00-\ud7af]/g);
    
    if (matches) {
      matches.forEach(item => {
        if (filterStopWords && stopWordsSet.has(item)) return;
        freqMap.set(item, (freqMap.get(item) || 0) + 1);
      });
    }
  });

  const total = Array.from(freqMap.values()).reduce((a, b) => a + b, 0);
  
  return Array.from(freqMap.entries())
    .map(([word, count]) => ({
      word,
      count,
      percentage: ((count / total) * 100).toFixed(2)
    }))
    .filter(item => item.count >= minFrequency)
    .sort((a, b) => b.count - a.count);
}
