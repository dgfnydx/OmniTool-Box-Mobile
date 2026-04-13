export default {
  name: 'Word Counter',
  description: 'Count words, characters, and sentences.',
  placeholder: 'Type or paste your text here...',
  words: 'Words',
  chars: 'Characters',
  lines: 'Lines',
  sentences: 'Sentences',
  readingTime: 'Read Time',
  charsNoSpaces: 'characters (no spaces)',
  uppercase: 'UPPERCASE',
  lowercase: 'lowercase',
  converted: 'Text converted!',
  definitions: {
    title: 'How it is calculated?',
    words: 'Counts English word sequences and each CJK (Chinese/Japanese/Korean) character as one word.',
    chars: 'Total number of characters including spaces, punctuation, and line breaks.',
    lines: 'Total number of lines, based on newline characters.',
    sentences: 'Counts groups of text ending with terminal punctuation (. ! ? 。 ！ ？).',
    readingTime: 'Estimated based on an average reading speed of 200 words per minute.'
  }
};
