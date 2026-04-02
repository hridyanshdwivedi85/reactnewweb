# reactnewweb

## 1) Install Node.js

If Node.js is not installed yet, install **Node 20 LTS** (recommended) using one of these options:

- **Official installer**: https://nodejs.org/
- **nvm (Linux/macOS)**:
  ```bash
  curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
  nvm install 20
  nvm use 20
  node -v
  npm -v
  ```
- **nvm-windows** (Windows): https://github.com/coreybutler/nvm-windows

## 2) Install project dependencies (creates `node_modules/`)

From the repo root:

```bash
npm install
```

> `node_modules/` is generated locally and is not committed to Git.

## 3) One-command bootstrap (install + production build)

```bash
npm run setup
```

This command runs dependency install and then verifies the project builds.

## 4) Run locally

```bash
npm run dev
```

## 5) Production build

```bash
npm run build
npm run preview
```
