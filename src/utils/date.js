/**
 * 日期与时间戳处理工具
 */

/**
 * 将时间戳转换为可读日期字符串
 * 支持秒级(10位)和毫秒级(13位)
 */
export function formatTimestamp(ts) {
  try {
    const val = typeof ts === 'string' ? parseInt(ts) : ts;
    if (isNaN(val)) return '';
    
    // 自动识别秒级和毫秒级
    const date = new Date(val * (val.toString().length > 11 ? 1 : 1000));
    
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  } catch (e) {
    return '';
  }
}

/**
 * 将日期字符串转换为秒级时间戳
 */
export function parseDateToTimestamp(dateStr) {
  try {
    // 适配各平台日期解析差异
    const normalizedStr = dateStr.replace(/-/g, '/');
    const date = new Date(normalizedStr);
    const time = date.getTime();
    if (isNaN(time)) return null;
    return Math.floor(time / 1000);
  } catch (e) {
    return null;
  }
}

/**
 * 获取当前的日期时间字符串 (YYYY-MM-DD HH:mm:ss)
 */
export function getCurrentDateTimeString() {
  const date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
