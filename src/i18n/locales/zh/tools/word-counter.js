export default {
  name: '字数统计',
  description: '统计文本的单词数、字符数及句子数。',
  placeholder: '在此输入或粘贴您的文本...',
  words: '单词数',
  chars: '字符数',
  lines: '行数',
  sentences: '句子数',
  readingTime: '阅读时长',
  charsNoSpaces: '字符 (不含空格)',
  uppercase: '转大写',
  lowercase: '转小写',
  converted: '文本已转换！',
  definitions: {
    title: '统计规则说明',
    words: '单词数：连续的英文/数字序列计为一个词，每个汉字（及日韩文字）独立计为一个词。',
    chars: '字符数：包含空格、标点符号及换行符在内的字符总长度。',
    lines: '行数：基于文本中的换行符进行统计。',
    sentences: '句子数：以中英文终结标点（。 ！ ？ . ! ?）结尾的文本片段。',
    readingTime: '阅读时长：基于每分钟 200 个词的平均阅读速度估算。'
  }
};
