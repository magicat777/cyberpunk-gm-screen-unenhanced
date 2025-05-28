# Phase 1: Environment Setup & Tooling

## Quick Start Commands

```bash
# Initialize the project
npm init -y

# Install development dependencies
npm install --save-dev \
  typescript \
  vite \
  @vitejs/plugin-legacy \
  eslint \
  @typescript-eslint/parser \
  @typescript-eslint/eslint-plugin \
  prettier \
  eslint-config-prettier \
  eslint-plugin-prettier \
  stylelint \
  stylelint-config-standard \
  husky \
  lint-staged \
  @playwright/test \
  vitest \
  @vitest/ui \
  @axe-core/playwright \
  lighthouse \
  @commitlint/cli \
  @commitlint/config-conventional

# Install production dependencies
npm install \
  @types/node \
  dotenv
```

## Configuration Files

### 1. TypeScript Configuration (tsconfig.json)
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@utils/*": ["src/utils/*"],
      "@panels/*": ["src/panels/*"]
    }
  },
  "include": ["src/**/*", "tests/**/*"],
  "exclude": ["node_modules", "dist", "build"]
}
```

### 2. Vite Configuration (vite.config.ts)
```typescript
import { defineConfig } from 'vite';
import legacy from '@vitejs/plugin-legacy';
import path from 'path';

export default defineConfig({
  root: 'src',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'src/index.html'),
        app: path.resolve(__dirname, 'src/app.html'),
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@panels': path.resolve(__dirname, './src/panels'),
    },
  },
  plugins: [
    legacy({
      targets: ['defaults', 'not IE 11'],
    }),
  ],
  server: {
    port: 3000,
    open: true,
    cors: true,
  },
});
```

### 3. ESLint Configuration (.eslintrc.json)
```json
{
  "env": {
    "browser": true,
    "es2021": true,
    "node": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "prettier"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module",
    "project": "./tsconfig.json"
  },
  "plugins": ["@typescript-eslint", "prettier"],
  "rules": {
    "prettier/prettier": "error",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "no-console": ["warn", { "allow": ["warn", "error"] }]
  }
}
```

### 4. Prettier Configuration (.prettierrc.json)
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

### 5. Stylelint Configuration (.stylelintrc.json)
```json
{
  "extends": "stylelint-config-standard",
  "rules": {
    "selector-class-pattern": "^[a-z][a-zA-Z0-9]+$",
    "color-hex-length": "short",
    "declaration-block-no-redundant-longhand-properties": true,
    "shorthand-property-no-redundant-values": true,
    "function-url-quotes": "always",
    "number-max-precision": 4,
    "unit-case": "lower",
    "value-keyword-case": "lower",
    "declaration-colon-space-after": "always",
    "declaration-colon-space-before": "never",
    "selector-pseudo-element-colon-notation": "double",
    "media-feature-range-operator-space-after": "always",
    "media-feature-range-operator-space-before": "always"
  }
}
```

### 6. Husky Setup
```bash
# Initialize husky
npx husky-init && npm install

# Add pre-commit hook
npx husky add .husky/pre-commit "npx lint-staged"

# Add commit-msg hook
npx husky add .husky/commit-msg "npx --no -- commitlint --edit $1"
```

### 7. Lint-staged Configuration (.lintstagedrc.json)
```json
{
  "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
  "*.{css,scss,sass}": ["stylelint --fix", "prettier --write"],
  "*.{json,md,yml,yaml}": ["prettier --write"]
}
```

### 8. Commitlint Configuration (commitlint.config.js)
```javascript
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'perf',
        'test',
        'chore',
        'revert',
        'ci',
        'build',
      ],
    ],
  },
};
```

### 9. Playwright Configuration (playwright.config.ts)
```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    port: 3000,
    reuseExistingServer: !process.env.CI,
  },
});
```

### 10. Vitest Configuration (vitest.config.ts)
```typescript
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.ts',
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'tests/', '**/*.d.ts', '**/*.config.*', '**/mockData/**'],
      threshold: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@panels': path.resolve(__dirname, './src/panels'),
    },
  },
});
```

### 11. Environment Variables (.env.example)
```bash
# Application
VITE_APP_TITLE="Cyberpunk GM Screen"
VITE_APP_VERSION="2.0.0"

# Features
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_PWA=true
VITE_ENABLE_COLLABORATION=false

# Monitoring (ODIN)
VITE_PROMETHEUS_ENDPOINT="http://localhost:9090"
VITE_GRAFANA_ENDPOINT="http://localhost:3000"

# Development
VITE_DEBUG_MODE=true
VITE_MOCK_API=true
```

### 12. NPM Scripts (package.json)
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "lint": "eslint . --ext .ts,.tsx,.js,.jsx",
    "lint:fix": "eslint . --ext .ts,.tsx,.js,.jsx --fix",
    "stylelint": "stylelint \"src/**/*.{css,scss}\"",
    "stylelint:fix": "stylelint \"src/**/*.{css,scss}\" --fix",
    "format": "prettier --write \"src/**/*.{js,jsx,ts,tsx,json,css,scss,md}\"",
    "format:check": "prettier --check \"src/**/*.{js,jsx,ts,tsx,json,css,scss,md}\"",
    "type-check": "tsc --noEmit",
    "prepare": "husky install",
    "pre-commit": "lint-staged",
    "commit": "cz",
    "clean": "rm -rf dist node_modules",
    "audit": "npm audit --audit-level=moderate",
    "lighthouse": "lighthouse http://localhost:3000 --output html --output-path ./lighthouse-report.html"
  }
}
```

## Folder Structure

```
cyberpunk-gm-screen/
├── .husky/                 # Git hooks
├── .vscode/               # VS Code settings
├── dist/                  # Build output
├── docs/                  # Documentation
├── node_modules/          # Dependencies
├── public/                # Static assets
├── scripts/               # Build scripts
├── src/                   # Source code
│   ├── components/        # Reusable components
│   ├── panels/           # Panel implementations
│   ├── styles/           # Global styles
│   ├── utils/            # Utility functions
│   ├── types/            # TypeScript types
│   ├── app.html          # Main application
│   └── index.html        # Landing page
├── tests/                 # Test files
│   ├── e2e/              # Playwright tests
│   ├── unit/             # Unit tests
│   └── setup.ts          # Test setup
├── .env.example          # Environment example
├── .eslintrc.json        # ESLint config
├── .gitignore            # Git ignore
├── .prettierrc.json      # Prettier config
├── .stylelintrc.json     # Stylelint config
├── commitlint.config.js  # Commit lint config
├── package.json          # NPM config
├── playwright.config.ts  # Playwright config
├── tsconfig.json         # TypeScript config
├── vite.config.ts        # Vite config
└── vitest.config.ts      # Vitest config
```

## VS Code Settings (.vscode/settings.json)

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.fixAll.stylelint": true
  },
  "eslint.validate": ["javascript", "javascriptreact", "typescript", "typescriptreact"],
  "stylelint.validate": ["css", "scss"],
  "typescript.tsdk": "node_modules/typescript/lib",
  "files.associations": {
    "*.css": "css"
  },
  "emmet.includeLanguages": {
    "javascript": "javascriptreact",
    "typescript": "typescriptreact"
  }
}
```

## Next Steps

1. Run `npm install` to install all dependencies
2. Copy `.env.example` to `.env` and configure
3. Run `npm run dev` to start development server
4. Run `npm test` to verify test setup
5. Make a test commit to verify git hooks

## Verification Checklist

- [ ] TypeScript compiles without errors
- [ ] ESLint runs without errors
- [ ] Prettier formats code correctly
- [ ] Stylelint checks CSS files
- [ ] Husky pre-commit hooks work
- [ ] Vitest runs successfully
- [ ] Playwright can run a basic test
- [ ] Vite dev server starts
- [ ] Build completes successfully