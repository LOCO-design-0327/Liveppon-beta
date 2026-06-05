import { defineConfig } from 'vite'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id: string) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, 'src/assets', filename)
      }
    },
  }
}

export default defineConfig({
  plugins: [
    figmaAssetResolver(),
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['liveppon-icon-192.png', 'liveppon-icon-512.png'],
      manifest: {
        name: 'Liveppon',
        short_name: 'Liveppon',
        description: 'ライブ物販を、もっとスマートに。',
        theme_color: '#06C56D',
        background_color: '#1A1A1A',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/liveppon-icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/liveppon-icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
})
