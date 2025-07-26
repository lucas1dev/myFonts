import { createServer } from 'http'
import { readFileSync, readdirSync, existsSync } from 'fs'
import { join, extname } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const PORT = process.env.PORT || 3000

// MIME types
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf'
}

// Função para servir arquivos estáticos
function serveStaticFile(path, res) {
  try {
    const ext = extname(path)
    const contentType = mimeTypes[ext] || 'application/octet-stream'
    
    const filePath = join(__dirname, path)
    const content = readFileSync(filePath)
    
    res.writeHead(200, { 'Content-Type': contentType })
    res.end(content)
  } catch (error) {
    res.writeHead(404, { 'Content-Type': 'text/plain' })
    res.end('File not found')
  }
}

// Função para listar fontes da pasta
function getFonts() {
  try {
    const fontsDir = join(__dirname, 'public', 'fonts')
    const files = readdirSync(fontsDir)
    
    const fontFiles = files
      .filter(file => {
        const ext = file.toLowerCase().split('.').pop()
        return ['woff2', 'woff', 'ttf', 'otf'].includes(ext)
      })
      .map(file => {
        const name = file.split('.')[0]
        const displayName = name
          .replace(/([A-Z])/g, ' $1')
          .replace(/^./, str => str.toUpperCase())
          .trim()
        
        return {
          name: displayName,
          file: file,
          path: `/fonts/${file}`,
          type: 'folder'
        }
      })
    
    return fontFiles
  } catch (error) {
    console.error('Erro ao ler fontes:', error)
    return []
  }
}

// Função para categorizar fontes
function getFontCategory(fontName, os) {
  const name = fontName.toLowerCase()
  
  // Detecção por palavras-chave
  if (name.includes('serif') || name.includes('times') || name.includes('georgia')) {
    return 'serif'
  } else if (name.includes('sans') || name.includes('arial') || name.includes('helvetica')) {
    return 'sansSerif'
  } else if (name.includes('mono') || name.includes('courier') || name.includes('console')) {
    return 'monospace'
  } else if (name.includes('display') || name.includes('impact') || name.includes('comic')) {
    return 'display'
  }
  
  // Categorias específicas por OS
  if (os === 'macos') {
    if (name.includes('sf pro') || name.includes('helvetica neue')) {
      return 'system'
    }
  } else if (os === 'windows') {
    if (name.includes('segoe') || name.includes('calibri')) {
      return 'system'
    }
  } else if (os === 'linux') {
    if (name.includes('ubuntu') || name.includes('dejavu') || name.includes('liberation')) {
      return 'system'
    }
  }
  
  return 'unknown'
}

// Função para detectar fontes do sistema dinamicamente
async function getSystemFonts(platform) {
  try {
    let fonts = []
    
    if (platform === 'darwin') {
      // macOS - usar system_profiler

      const { stdout } = await execAsync('system_profiler SPFontsDataType', { 
        maxBuffer: 10 * 1024 * 1024 // 10MB buffer
      })
      
      // Parsear saída do system_profiler
      const lines = stdout.split('\n')
      let currentFont = null
      
      for (const line of lines) {
        const trimmed = line.trim()
        
        // Procurar por arquivos .ttf, .otf, etc.
        if (trimmed.endsWith('.ttf:') || trimmed.endsWith('.otf:') || trimmed.endsWith('.woff:') || trimmed.endsWith('.woff2:')) {
          const fontName = trimmed.replace(/\.(ttf|otf|woff|woff2):$/, '')
          if (fontName) {
            fonts.push({
              name: fontName,
              file: fontName,
              path: fontName
            })
          }
        }
        // Procurar por "Family:" que contém o nome da família da fonte
        else if (trimmed.startsWith('Family:')) {
          const familyName = trimmed.replace('Family:', '').trim()
          if (familyName && familyName !== '') {
            fonts.push({
              name: familyName,
              file: familyName,
              path: familyName
            })
          }
        }
      }
      
    } else if (platform === 'win32') {
      // Windows - usar reg query

      const { stdout } = await execAsync('reg query "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Fonts"', {
        maxBuffer: 5 * 1024 * 1024 // 5MB buffer
      })
      
      // Parsear saída do reg query
      const lines = stdout.split('\n')
      
      for (const line of lines) {
        const trimmed = line.trim()
        if (trimmed && !trimmed.startsWith('HKEY_') && !trimmed.startsWith('REG_SZ')) {
          const match = trimmed.match(/^(.+?)\s+REG_SZ\s+(.+)$/)
          if (match) {
            const [, name, file] = match
            fonts.push({
              name: name.replace(/"/g, ''),
              file: file.replace(/"/g, ''),
              path: file.replace(/"/g, '')
            })
          }
        }
      }
      
    } else if (platform === 'linux') {
      // Linux - usar fc-list

      const { stdout } = await execAsync('fc-list : family', {
        maxBuffer: 5 * 1024 * 1024 // 5MB buffer
      })
      
      // Parsear saída do fc-list
      const lines = stdout.split('\n')
      
      for (const line of lines) {
        const trimmed = line.trim()
        if (trimmed && !trimmed.startsWith('fc-list:')) {
          // Remover aspas e vírgulas
          const name = trimmed.replace(/"/g, '').replace(/,/g, '').trim()
          if (name) {
            fonts.push({
              name: name,
              file: name,
              path: name
            })
          }
        }
      }
    }
    
    // Filtrar e limitar resultados
    const uniqueFonts = fonts
      .filter(font => font && font.name && font.name.length > 0)
      .filter((font, index, self) => 
        index === self.findIndex(f => f.name === font.name)
      )
      // .slice(0, 100) // Limitar a 100 fontes para performance
    

    return uniqueFonts
    
  } catch (error) {
    console.error('❌ Erro ao detectar fontes do sistema:', error)
    return []
  }
}
async function handleSystemFonts(res) {
  try {

    
    // Detectar sistema operacional
    const platform = process.platform
    let os = 'unknown'
    let osConfig = {
      name: 'Unknown',
      icon: '❓'
    }
    
    if (platform === 'darwin') {
      os = 'macos'
      osConfig = { name: 'macOS', icon: '🍎' }
    } else if (platform === 'win32') {
      os = 'windows'
      osConfig = { name: 'Windows', icon: '🪟' }
    } else if (platform === 'linux') {
      os = 'linux'
      osConfig = { name: 'Linux', icon: '🐧' }
    }
    

    
    // Detectar fontes do sistema dinamicamente
    const systemFonts = await getSystemFonts(platform)
    
    if (systemFonts.length > 0) {
      // Formatar fontes detectadas
      const formattedFonts = systemFonts.map(font => ({
        name: font.name,
        file: font.file,
        path: font.path,
        type: 'system',
        os: os,
        category: getFontCategory(font.name, os)
      }))
      

      
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({
        fonts: formattedFonts,
        os: os,
        config: osConfig
      }))
      
    } else {
      // Fallback se não conseguir detectar fontes

      
      const fallbackFonts = [
        'Arial', 'Helvetica', 'Times New Roman', 'Georgia', 'Verdana',
        'Courier New', 'Impact', 'Comic Sans MS', 'Tahoma', 'Trebuchet MS',
        'Lucida Console', 'Palatino', 'Garamond', 'Bookman', 'Avant Garde'
      ].map(font => ({
        name: font,
        file: font,
        path: font,
        type: 'system',
        os: os,
        category: getFontCategory(font, os)
      }))
      
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({
        fonts: fallbackFonts,
        os: os,
        config: osConfig
      }))
    }
    
  } catch (error) {
    console.error('❌ Erro ao carregar fontes do sistema:', error)
    
    // Fallback para fontes padrão
    const fallbackFonts = [
      'Arial', 'Helvetica', 'Times New Roman', 'Georgia', 'Verdana',
      'Courier New', 'Impact', 'Comic Sans MS', 'Tahoma', 'Trebuchet MS'
    ].map(font => ({
      name: font,
      file: font,
      path: font,
      type: 'system',
      os: 'unknown',
      category: 'unknown'
    }))
    
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({
      fonts: fallbackFonts,
      os: 'unknown',
      config: { name: 'Unknown', icon: '❓' }
    }))
  }
}

// Criar servidor HTTP
const server = createServer((req, res) => {
  const url = req.url
  const method = req.method
  

  
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  
  if (method === 'OPTIONS') {
    res.writeHead(200)
    res.end()
    return
  }
  
  // API de fontes da pasta
  if (url === '/api/fonts' && method === 'GET') {
    const fonts = getFonts()
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(fonts))
    return
  }
  
  // API de fontes do sistema
  if (url === '/api/system-fonts' && method === 'GET') {
    handleSystemFonts(res)
    return
  }
  
  // Servir fontes
  if (url.startsWith('/fonts/')) {
    serveStaticFile(`public${url}`, res)
    return
  }
  
  // Servir arquivos estáticos da pasta dist
  if (url === '/' || url === '/index.html') {
    serveStaticFile('dist/index.html', res)
    return
  }
  
  if (url.startsWith('/assets/')) {
    serveStaticFile(`dist${url}`, res)
    return
  }
  
  // Rota para teste das APIs
  if (url === '/test-api.html') {
    serveStaticFile('dist/test-api.html', res)
    return
  }
  
  // Fallback para SPA - todas as rotas não encontradas vão para index.html
  serveStaticFile('dist/index.html', res)
})

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`)
  console.log(`📁 API de fontes da pasta: http://localhost:${PORT}/api/fonts`)
  console.log(`🖥️ API de fontes do sistema: http://localhost:${PORT}/api/system-fonts`)
  console.log(`🌐 Modo: ${process.env.NODE_ENV || 'development'}`)
  console.log(`📂 Node.js versão: ${process.version}`)
}) 