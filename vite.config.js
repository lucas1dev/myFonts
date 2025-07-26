import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readdirSync } from 'fs'
import { join } from 'path'
import path from 'path'

// Plugin para criar API de fontes
function fontsApiPlugin() {
  return {
    name: 'fonts-api',
    configureServer(server) {
      server.middlewares.use('/api/fonts', (req, res) => {
        if (req.method === 'GET') {
          try {
            const fontsDir = join(process.cwd(), 'public', 'fonts')
            const files = readdirSync(fontsDir)
            
            const fontFiles = files
              .filter(file => {
                const ext = file.toLowerCase().split('.').pop()
                return ['woff2', 'woff', 'ttf', 'otf'].includes(ext)
              })
              .map(file => {
                const name = file.split('.')[0]
                // Converter nome do arquivo para nome da fonte (ex: "OpenSans.woff2" -> "Open Sans")
                const displayName = name
                  .replace(/([A-Z])/g, ' $1') // Adiciona espaço antes de maiúsculas
                  .replace(/^./, str => str.toUpperCase()) // Primeira letra maiúscula
                  .trim()
                
                return {
                  name: displayName,
                  file: file,
                  path: `/fonts/${file}`
                }
              })
            
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(fontFiles))
          } catch (error) {
            console.error('Erro ao ler fontes:', error)
            res.statusCode = 500
            res.end(JSON.stringify({ error: 'Erro ao ler fontes' }))
          }
        } else {
          res.statusCode = 405
          res.end(JSON.stringify({ error: 'Método não permitido' }))
        }
      })
    }
  }
}

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  const isProduction = mode === 'production'
  
  return {
    plugins: [react(), fontsApiPlugin()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: !isProduction,
      minify: isProduction ? 'terser' : false,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            ui: ['@radix-ui/react-toggle', '@radix-ui/react-slider']
          }
        }
      }
    },
    server: {
      host: '0.0.0.0',
      port: 3000
    },
    preview: {
      host: '0.0.0.0',
      port: 3000
    }
  }
})
