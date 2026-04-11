export default {
  name: '进制转换',
  description: '在二进制、八进制、十进制、十六进制等任意进制间进行转换（2-36）。',
  input: '输入数值',
  fromBase: '原始进制',
  toBase: '目标进制',
  result: '转换结果',
  invalidInput: '当前输入对于所选进制无效',
  tip: '支持 2 到 36 之间的进制。对于 10 以上的进制，请使用字母 A-Z（如 A=10, F=15）。',
  quick: {
    bin: '二进制',
    oct: '八进制',
    dec: '十进制',
    hex: '十六进制'
  }
};
