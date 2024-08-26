export default {
  endOfLine: 'auto',
  overrides: [
    {
      files: ['*.json5'],
      options: {
        quoteProps: 'preserve',
        singleQuote: false,
      },
    },
    {
      files: ['*.yaml', '*.yml'],
      options: {
        singleQuote: false,
      },
    },
  ],
  printWidth: 100,
  proseWrap: 'never',
  semi: false,
  singleQuote: true,
  trailingComma: 'none',
}
