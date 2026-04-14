export default {
  name: 'AI Token Counter',
  description: 'Count GPT-3.5/GPT-4 tokens accurately.',
  input: 'Input Text',
  tokens: 'Tokens',
  characters: 'Characters',
  model: 'Tokenizer Model',
  placeholder: 'Paste your text here to count tokens...',
  models: {
    cl100k_base: 'Used by GPT-4, GPT-3.5-Turbo, and text-embedding-ada-002. It is the most modern and efficient encoding.',
    p50k_base: 'Used by older GPT-3 models like davinci, and code models like Codex.',
    r50k_base: 'Used by GPT-2 and older models. Less efficient for non-English text.',
    chinese_general: 'General Chinese Models (Qwen, Baichuan, ChatGLM). Uses an estimated rule: 1 Chinese char ≈ 0.6-1.5 tokens.'
  }
};
