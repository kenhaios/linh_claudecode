// ESLint configuration for Ha Linh Vietnamese Astrology Project
module.exports = {
  root: true,
  env: {
    node: true,
    es2022: true
  },
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'prettier'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    project: ['./tsconfig.json', './backend/tsconfig.json', './frontend/tsconfig.json']
  },
  plugins: ['@typescript-eslint'],
  rules: {
    // TypeScript specific rules
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-non-null-assertion': 'warn',
    
    // Vietnamese-specific naming conventions
    'camelcase': ['error', { 
      allow: [
        'birth_data', 'lunar_date', 'traditional_hour',
        'momo_partner_code', 'vnpay_tmn_code', 'zalopay_app_id',
        'user_id', 'chart_id', 'session_id',
        'access_token', 'refresh_token'
      ]
    }],
    
    // General code quality
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'prefer-const': 'error',
    'no-var': 'error',
    
    // Security rules for Vietnamese payment processing
    'no-eval': 'error',
    'no-implied-eval': 'error',
    'no-new-func': 'error',
    
    // Import rules
    'sort-imports': ['error', {
      ignoreCase: true,
      ignoreDeclarationSort: true,
      ignoreMemberSort: false,
      memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single']
    }]
  },
  overrides: [
    // Backend specific rules
    {
      files: ['backend/**/*.ts'],
      env: {
        node: true
      },
      rules: {
        // Node.js specific rules
        'no-process-env': 'off',
        '@typescript-eslint/no-var-requires': 'error'
      }
    },
    // Frontend specific rules
    {
      files: ['frontend/**/*.{ts,tsx}'],
      env: {
        browser: true,
        es2022: true
      },
      extends: [
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'plugin:jsx-a11y/recommended'
      ],
      plugins: ['react', 'react-hooks', 'jsx-a11y'],
      settings: {
        react: {
          version: 'detect'
        }
      },
      rules: {
        // React specific rules
        'react/react-in-jsx-scope': 'off',
        'react/prop-types': 'off',
        'react/display-name': 'off',
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn',
        
        // Vietnamese accessibility
        'jsx-a11y/lang': 'error',
        'jsx-a11y/aria-props': 'error',
        
        // Ant Design specific
        'react/no-unknown-property': ['error', { ignore: ['css'] }]
      }
    },
    // Test files
    {
      files: ['**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}', '**/tests/**/*.{ts,tsx}'],
      env: {
        jest: true,
        node: true
      },
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        'no-console': 'off'
      }
    },
    // Configuration files
    {
      files: ['*.config.{js,ts}', '*.conf.{js,ts}'],
      env: {
        node: true
      },
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
        'no-console': 'off'
      }
    }
  ],
  ignorePatterns: [
    'node_modules/',
    'dist/',
    'build/',
    'coverage/',
    '.next/',
    'docker/',
    'logs/',
    'uploads/'
  ]
};