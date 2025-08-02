// Prettier configuration for Ha Linh Vietnamese Astrology Project
module.exports = {
  // Basic formatting
  semi: true,
  trailingComma: 'es5',
  singleQuote: true,
  doubleQuote: false,
  tabWidth: 2,
  useTabs: false,
  
  // Line formatting
  printWidth: 100,
  endOfLine: 'lf',
  
  // Bracket formatting
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: 'avoid',
  
  // Vietnamese-specific formatting
  proseWrap: 'preserve', // Preserve Vietnamese text wrapping
  
  // File-specific overrides
  overrides: [
    // JSON files (including Vietnamese translation files)
    {
      files: ['*.json', '**/*.json'],
      options: {
        tabWidth: 2,
        parser: 'json'
      }
    },
    // Markdown files (Vietnamese documentation)
    {
      files: ['*.md', '**/*.md'],
      options: {
        proseWrap: 'preserve',
        tabWidth: 2,
        printWidth: 80
      }
    },
    // YAML files (Docker compose, etc.)
    {
      files: ['*.yml', '*.yaml', '**/*.yml', '**/*.yaml'],
      options: {
        tabWidth: 2,
        singleQuote: false
      }
    },
    // Package.json files
    {
      files: ['package.json', '**/package.json'],
      options: {
        tabWidth: 2,
        printWidth: 120
      }
    },
    // TypeScript React files
    {
      files: ['*.tsx', '**/*.tsx'],
      options: {
        jsxSingleQuote: true,
        jsxBracketSameLine: false
      }
    },
    // Configuration files
    {
      files: [
        '*.config.js',
        '*.config.ts',
        '.eslintrc.js',
        '.prettierrc.js',
        'jest.config.js',
        'vitest.config.ts',
        'vite.config.ts'
      ],
      options: {
        printWidth: 120
      }
    }
  ]
};