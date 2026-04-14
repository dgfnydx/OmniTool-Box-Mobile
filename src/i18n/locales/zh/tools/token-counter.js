export default {
  name: 'AI Token 计算器',
  description: '准确计算 GPT-3.5/GPT-4 模型的 Token 数量。',
  input: '输入文本',
  tokens: 'Token 数量',
  characters: '字符数',
  model: '分词模型',
  placeholder: '在此粘贴文本以计算 Token...',
  models: {
    cl100k_base: 'GPT-4、GPT-3.5-Turbo 以及 text-embedding-ada-002 使用。这是目前最现代且最高效的编码方式。',
    p50k_base: '较早的 GPT-3 模型（如 davinci）和代码模型（如 Codex）使用。',
    r50k_base: 'GPT-2 和更早的模型使用。对非英语文本的编码效率较低。',
    chinese_general: '通用中国大模型 (通义千问、百川、智谱等)。使用估算规则：1 个汉字约 0.6-1.5 个 token，英文单词按 1.3 比例估算。'
  }
};
