import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const isNetlify = process.env.NETLIFY === 'true'
const isGitHubPages = process.env.GITHUB_ACTIONS === 'true'

// Netlify serves from domain root, while GitHub Pages serves from /reactnewweb/.
// This avoids blank pages on Netlify caused by hardcoded /reactnewweb/ asset paths.
const base = isGitHubPages && !isNetlify ? '/reactnewweb/' : '/'

export default defineConfig({
  plugins: [react()],
  base,
})
