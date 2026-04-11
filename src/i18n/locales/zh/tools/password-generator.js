export default {
  name: '随机密码',
  description: '生成高强度安全随机密码，支持多种字符组合。',
  length: '密码长度',
  generate: '生成密码',
  copied: '密码已复制！',
  another: '换一个',
  copy: '复制密码',
  strength: '安全性评级',
  tips: '安全小贴士',
  tipsDesc: '12位以上且包含数字、符号、大小写字母的密码通常被认为是非常安全的。',
  weak: '弱 (不安全)',
  medium: '中 (基本安全)',
  strong: '强 (极度安全)',
  options: {
    uppercase: '大写字母 (A-Z)',
    lowercase: '小写字母 (a-z)',
    numbers: '数字 (0-9)',
    symbols: '特殊符号 (!@#$)'
  }
};
