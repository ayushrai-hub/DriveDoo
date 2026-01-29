module.exports = {
  // Basic Configuration
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  quoteProps: 'as-needed',
  trailingComma: 'es5',
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: 'avoid',
  
  // JSX Configuration
  jsxSingleQuote: false,
  
  // End of Line
  endOfLine: 'lf',
  
  // HTML Configuration
  htmlWhitespaceSensitivity: 'css',
  
  // Embedded Languages
  embeddedLanguageFormatting: 'auto',
  
  // Plugin Options
  plugins: [
    'prettier-plugin-organize-imports',
    'prettier-plugin-tailwindcss',
  ],
  
  // Organize Imports Options
  organizeImportsSkipDestructiveCodeActions: true,
  organizeImportsTabBehavior: 'indent',
  organizeImportsSpaceBeforeQuotes: true,
  
  // Overrides for specific file types
  overrides: [
    {
      files: '*.json',
      options: {
        printWidth: 80,
      },
    },
    {
      files: '*.md',
      options: {
        printWidth: 120,
        proseWrap: 'always',
      },
    },
    {
      files: '*.css',
      options: {
        parser: 'css',
      },
    },
    {
      files: '*.scss',
      options: {
        parser: 'scss',
      },
    },
    {
      files: '*.module.css',
      options: {
        parser: 'css',
      },
    },
    {
      files: '*.module.scss',
      options: {
        parser: 'scss',
      },
    },
  ],
};