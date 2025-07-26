/**
 * Sistema de Carregamento Dinâmico de Fontes do Sistema
 * 
 * Este módulo detecta automaticamente o sistema operacional e carrega
 * as fontes disponíveis usando a biblioteca font-list.
 * 
 * Funcionalidades:
 * - Detecção automática de OS (macOS, Windows, Linux)
 * - Configurações específicas por sistema operacional
 * - Carregamento dinâmico de fontes com font-list
 * - Categorização automática das fontes
 * - Fallback inteligente para fontes similares
 * 
 * Sistemas suportados:
 * - 🍎 macOS: SF Pro, Helvetica Neue, Times, etc.
 * - 🪟 Windows: Segoe UI, Calibri, Arial, etc.
 * - 🐧 Linux: Ubuntu, DejaVu Sans, Liberation Sans, etc.
 */

import { getAvailableFonts } from 'font-list'

// Detectar o sistema operacional
export const detectOS = () => {
  const platform = navigator.platform || navigator.userAgent
  
  if (platform.includes('Mac') || platform.includes('macOS')) {
    return 'macos'
  } else if (platform.includes('Win') || platform.includes('Windows')) {
    return 'windows'
  } else if (platform.includes('Linux') || platform.includes('X11')) {
    return 'linux'
  } else {
    return 'unknown'
  }
}

// Configurações específicas por OS
export const osConfigs = {
  macos: {
    name: 'macOS',
    icon: '🍎',
    defaultFonts: [
      'SF Pro Display',
      'SF Pro Text',
      'Helvetica Neue',
      'Arial',
      'Times',
      'Georgia',
      'Verdana',
      'Courier',
      'Impact',
      'Comic Sans MS',
      'Tahoma',
      'Trebuchet MS',
      'Lucida Console',
      'Palatino',
      'Garamond'
    ],
    fontCategories: {
      system: ['SF Pro Display', 'SF Pro Text', 'Helvetica Neue'],
      serif: ['Times', 'Georgia', 'Palatino', 'Garamond'],
      sansSerif: ['Arial', 'Verdana', 'Tahoma', 'Trebuchet MS'],
      monospace: ['Courier', 'Lucida Console'],
      display: ['Impact', 'Comic Sans MS']
    }
  },
  windows: {
    name: 'Windows',
    icon: '🪟',
    defaultFonts: [
      'Segoe UI',
      'Calibri',
      'Arial',
      'Times New Roman',
      'Georgia',
      'Verdana',
      'Courier New',
      'Impact',
      'Comic Sans MS',
      'Tahoma',
      'Trebuchet MS',
      'Lucida Console',
      'Palatino',
      'Garamond',
      'Bookman'
    ],
    fontCategories: {
      system: ['Segoe UI', 'Calibri'],
      serif: ['Times New Roman', 'Georgia', 'Palatino', 'Garamond', 'Bookman'],
      sansSerif: ['Arial', 'Verdana', 'Tahoma', 'Trebuchet MS'],
      monospace: ['Courier New', 'Lucida Console'],
      display: ['Impact', 'Comic Sans MS']
    }
  },
  linux: {
    name: 'Linux',
    icon: '🐧',
    defaultFonts: [
      'Ubuntu',
      'DejaVu Sans',
      'Liberation Sans',
      'Arial',
      'Times New Roman',
      'Georgia',
      'Verdana',
      'Courier New',
      'Impact',
      'Comic Sans MS',
      'Tahoma',
      'Trebuchet MS',
      'Lucida Console',
      'Palatino',
      'Garamond'
    ],
    fontCategories: {
      system: ['Ubuntu', 'DejaVu Sans', 'Liberation Sans'],
      serif: ['Times New Roman', 'Georgia', 'Palatino', 'Garamond'],
      sansSerif: ['Arial', 'Verdana', 'Tahoma', 'Trebuchet MS'],
      monospace: ['Courier New', 'Lucida Console'],
      display: ['Impact', 'Comic Sans MS']
    }
  },
  unknown: {
    name: 'Unknown',
    icon: '❓',
    defaultFonts: [
      'Arial',
      'Helvetica',
      'Times New Roman',
      'Georgia',
      'Verdana',
      'Courier New',
      'Impact',
      'Comic Sans MS',
      'Tahoma',
      'Trebuchet MS',
      'Lucida Console',
      'Palatino',
      'Garamond',
      'Bookman',
      'Avant Garde'
    ],
    fontCategories: {
      system: ['Arial', 'Helvetica'],
      serif: ['Times New Roman', 'Georgia', 'Palatino', 'Garamond', 'Bookman'],
      sansSerif: ['Arial', 'Verdana', 'Tahoma', 'Trebuchet MS'],
      monospace: ['Courier New', 'Lucida Console'],
      display: ['Impact', 'Comic Sans MS', 'Avant Garde']
    }
  }
}

// Carregar fontes do sistema dinamicamente
export const loadSystemFonts = async () => {
  try {
    const os = detectOS()
    const config = osConfigs[os]
    
    console.log(`🖥️ Sistema detectado: ${config.icon} ${config.name}`)
    
    // Tentar carregar fontes usando font-list
    let availableFonts = []
    
    try {
      // Carregar todas as fontes disponíveis
      const fonts = await getAvailableFonts()
      
      // Filtrar e formatar as fontes
      availableFonts = fonts
        .filter(font => font && typeof font === 'string')
        .map(font => ({
          name: font,
          file: font,
          path: font,
          type: 'system',
          os: os,
          category: getFontCategory(font, config)
        }))
        .slice(0, 50) // Limitar a 50 fontes para performance
      
      console.log(`✅ ${availableFonts.length} fontes do sistema carregadas`)
      
    } catch (error) {
      console.warn('⚠️ Erro ao carregar fontes com font-list, usando fallback:', error)
      
      // Fallback para fontes padrão do OS
      availableFonts = config.defaultFonts.map(font => ({
        name: font,
        file: font,
        path: font,
        type: 'system',
        os: os,
        category: getFontCategory(font, config)
      }))
      
      console.log(`🔄 Usando ${availableFonts.length} fontes padrão do ${config.name}`)
    }
    
    return {
      fonts: availableFonts,
      os: os,
      config: config
    }
    
  } catch (error) {
    console.error('❌ Erro ao carregar fontes do sistema:', error)
    
    // Fallback final
    const fallbackFonts = osConfigs.unknown.defaultFonts.map(font => ({
      name: font,
      file: font,
      path: font,
      type: 'system',
      os: 'unknown',
      category: 'unknown'
    }))
    
    return {
      fonts: fallbackFonts,
      os: 'unknown',
      config: osConfigs.unknown
    }
  }
}

// Determinar categoria da fonte
const getFontCategory = (fontName, config) => {
  const name = fontName.toLowerCase()
  
  for (const [category, fonts] of Object.entries(config.fontCategories)) {
    if (fonts.some(font => name.includes(font.toLowerCase()))) {
      return category
    }
  }
  
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
  
  return 'unknown'
}

// Obter informações do sistema
export const getSystemInfo = () => {
  const os = detectOS()
  const config = osConfigs[os]
  
  return {
    os: os,
    name: config.name,
    icon: config.icon,
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
    languages: navigator.languages
  }
} 