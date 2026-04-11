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
