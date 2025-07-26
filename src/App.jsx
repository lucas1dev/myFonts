import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Toggle } from '@/components/ui/toggle'
import { Slider } from '@/components/ui/slider'
import { RefreshCw, Type, FileText, Grid3X3, List, AlignLeft, AlignCenter, AlignRight, Folder, Monitor, Info } from 'lucide-react'
// Removendo import do font-list do frontend - será usado apenas via API

function App() {
  const [text, setText] = useState('')
  const [fonts, setFonts] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
  const [fontSize, setFontSize] = useState(16) // Default font size
  const [textAlign, setTextAlign] = useState('left') // 'left', 'center', 'right'
  const [fontSource, setFontSource] = useState('folder') // 'folder' or 'system'
  const [systemInfo, setSystemInfo] = useState(null)
  const [fontCategories, setFontCategories] = useState({})
  const [selectedCategory, setSelectedCategory] = useState('all') // Novo estado para categoria selecionada
  const [selectedWeight, setSelectedWeight] = useState('all') // Novo estado para peso selecionado

  // Função para carregar uma fonte dinamicamente
  const loadFontFace = (fontName, fontPath) => {
    const fontFace = new FontFace(fontName, `url(${fontPath})`)
    return fontFace.load().then(() => {
      document.fonts.add(fontFace)
      return fontFace
    }).catch(error => {
      console.error(`Erro ao carregar fonte ${fontName}:`, error)
      return null
    })
  }

  // Função para ler dinamicamente as fontes da pasta
  const loadFontsFromFolder = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Buscar as fontes disponíveis na pasta public/fonts
      const response = await fetch('/api/fonts')
      if (!response.ok) {
        throw new Error('Erro ao carregar fontes')
      }
      
      const fontFiles = await response.json()
      
      // Carregar cada fonte dinamicamente
      const fontPromises = fontFiles.map(font => 
        loadFontFace(font.name, font.path)
      )
      
      await Promise.allSettled(fontPromises)
      setFonts(fontFiles.map(font => ({ ...font, type: 'folder' })))
    } catch (error) {
      console.error('Erro ao carregar fontes:', error)
      setError('Erro ao carregar fontes da pasta. Verifique se a pasta public/fonts existe.')
      setFonts([])
    } finally {
      setIsLoading(false)
    }
  }

  // Função para carregar fontes do sistema via API
  const loadSystemFonts = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/system-fonts')
      if (!response.ok) {
        throw new Error('Erro ao carregar fontes do sistema')
      }
      
      const result = await response.json()
      setFonts(result.fonts)
      setSystemInfo(result.config)
      
      // Organizar fontes por categoria
      const categories = {}
      result.fonts.forEach(font => {
        if (!categories[font.category]) {
          categories[font.category] = []
        }
        categories[font.category].push(font)
      })
      setFontCategories(categories)
      
    } catch (error) {
      console.error('Erro ao carregar fontes do sistema:', error)
      setError('Erro ao carregar fontes do sistema.')
      setFonts([])
    } finally {
      setIsLoading(false)
    }
  }

  // Função para carregar fontes baseada na fonte selecionada
  const loadFonts = async () => {
    // Limpar fontes e categorias ao mudar de fonte
    setFonts([])
    setFontCategories({})
    setSelectedCategory('all')
    setSelectedWeight('all') // Resetar peso ao mudar fonte
    
    if (fontSource === 'folder') {
      loadFontsFromFolder()
    } else {
      await loadSystemFonts()
    }
  }

  useEffect(() => {
    // Carregar as fontes quando o componente montar ou quando mudar a fonte
    loadFonts()
  }, [fontSource])

  // Detectar sistema na inicialização
  useEffect(() => {
    const platform = navigator.platform || navigator.userAgent
    let os = 'Unknown'
    let osConfig = { name: 'Unknown', icon: '❓' }
    
    if (platform.includes('Mac') || platform.includes('macOS')) {
      os = 'macos'
      osConfig = { name: 'macOS', icon: '🍎' }
    } else if (platform.includes('Win') || platform.includes('Windows')) {
      os = 'windows'
      osConfig = { name: 'Windows', icon: '🪟' }
    } else if (platform.includes('Linux') || platform.includes('X11')) {
      os = 'linux'
      osConfig = { name: 'Linux', icon: '🐧' }
    }
    
    setSystemInfo(osConfig)
  }, [])

  // Função para detectar peso da fonte baseado no nome
  const getFontWeight = (fontName) => {
    const name = fontName.toLowerCase()
    
    // Detecção por palavras-chave específicas
    if (name.includes('thin') || name.includes('100')) {
      return 'thin'
    } else if (name.includes('extra light') || name.includes('ultra light') || name.includes('200')) {
      return 'extraLight'
    } else if (name.includes('light') || name.includes('300')) {
      return 'light'
    } else if (name.includes('regular') || name.includes('normal') || name.includes('400')) {
      return 'regular'
    } else if (name.includes('medium') || name.includes('500')) {
      return 'medium'
    } else if (name.includes('semi bold') || name.includes('semibold') || name.includes('demi bold') || name.includes('600')) {
      return 'semiBold'
    } else if (name.includes('bold') || name.includes('700')) {
      return 'bold'
    } else if (name.includes('extra bold') || name.includes('ultra bold') || name.includes('800')) {
      return 'extraBold'
    } else if (name.includes('black') || name.includes('heavy') || name.includes('900')) {
      return 'black'
    }
    
    // Se não encontrar nenhum peso específico, assume regular
    return 'regular'
  }

  // Função para obter pesos únicos das fontes
  const getUniqueWeights = () => {
    const weights = [...new Set(fonts.map(font => getFontWeight(font.name)))]
    return weights.sort()
  }

  // Função para obter nome amigável do peso
  const getWeightDisplayName = (weight) => {
    const weightNames = {
      'thin': 'Thin (100)',
      'extraLight': 'Extra Light (200)',
      'light': 'Light (300)',
      'regular': 'Regular (400)',
      'medium': 'Medium (500)',
      'semiBold': 'Semi Bold (600)',
      'bold': 'Bold (700)',
      'extraBold': 'Extra Bold (800)',
      'black': 'Black (900)'
    }
    return weightNames[weight] || weight
  }

  // Função para filtrar fontes por categoria e peso
  const getFilteredFonts = () => {
    let filtered = fonts
    
    // Filtrar por categoria
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(font => font.category === selectedCategory)
    }
    
    // Filtrar por peso
    if (selectedWeight !== 'all') {
      filtered = filtered.filter(font => getFontWeight(font.name) === selectedWeight)
    }
    
    return filtered
  }

  const applyFonts = () => {
    if (!text.trim()) {
      alert('Por favor, insira algum texto primeiro!')
      return
    }
    
    if (fonts.length === 0) {
      // Carregar fontes baseada na fonte selecionada atual
      if (fontSource === 'folder') {
        loadFontsFromFolder()
      } else {
        loadSystemFonts()
      }
    }
  }

  const reloadFonts = () => {
    // Recarregar fontes baseada na fonte selecionada atual
    if (fontSource === 'folder') {
      loadFontsFromFolder()
    } else {
      loadSystemFonts()
    }
  }

  const toggleViewMode = () => {
    setViewMode(viewMode === 'grid' ? 'list' : 'grid')
  }

  const toggleFontSource = () => {
    setFontSource(fontSource === 'folder' ? 'system' : 'folder')
  }

  // Função para obter categorias únicas das fontes
  const getUniqueCategories = () => {
    const categories = [...new Set(fonts.map(font => font.category).filter(Boolean))]
    return categories.sort()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 flex items-center justify-center gap-2">
            <Type className="h-8 w-8 text-blue-600" />
            Visualização de Fontes
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Visualize seu texto com diferentes fontes
          </p>
        </div>

        {/* Input Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Digite seu texto
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="text-input" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Texto para visualizar:
              </label>
              <Textarea
                id="text-input"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Digite aqui o texto que deseja visualizar com diferentes fontes..."
                rows={4}
                className="resize-none"
              />
            </div>
            
            <div className="flex gap-3 flex-wrap">
              <Button 
                onClick={applyFonts}
                disabled={!text.trim() || isLoading}
                className="flex-1 min-w-[200px]"
              >
                {isLoading ? 'Carregando...' : 'Aplicar Fontes'}
              </Button>
              
              <Button 
                variant="outline"
                onClick={reloadFonts}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                Recarregar
              </Button>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
                ⚠️ {error}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Controls Section */}
        {text && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Controles de Visualização</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Font Source Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Fonte das Fontes:
                </label>
                <div className="flex gap-2">
                  <Toggle
                    pressed={fontSource === 'folder'}
                    onPressedChange={() => setFontSource('folder')}
                    className="flex items-center gap-2"
                    title="Usar fontes da pasta"
                  >
                    <Folder className="h-4 w-4" />
                    Pasta
                  </Toggle>
                  <Toggle
                    pressed={fontSource === 'system'}
                    onPressedChange={() => setFontSource('system')}
                    className="flex items-center gap-2"
                    title="Usar fontes do sistema"
                  >
                    <Monitor className="h-4 w-4" />
                    Sistema
                  </Toggle>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {fontSource === 'folder' 
                    ? 'Carregando fontes da pasta public/fonts' 
                    : systemInfo 
                      ? `Usando fontes do ${systemInfo.icon} ${systemInfo.name}`
                      : 'Usando fontes do sistema'
                  }
                </p>
              </div>

              {/* Font Size Slider */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Tamanho da Fonte: {fontSize}px
                </label>
                <Slider
                  value={[fontSize]}
                  onValueChange={(value) => setFontSize(value[0])}
                  min={8}
                  max={280}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>8px</span>
                  <span>280px</span>
                </div>
              </div>

              {/* Text Alignment */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Alinhamento do Texto:
                </label>
                <div className="flex gap-2">
                  <Toggle
                    pressed={textAlign === 'left'}
                    onPressedChange={() => setTextAlign('left')}
                    className="flex items-center gap-2"
                    title="Alinhar à esquerda"
                  >
                    <AlignLeft className="h-4 w-4" />
                    Esquerda
                  </Toggle>
                  <Toggle
                    pressed={textAlign === 'center'}
                    onPressedChange={() => setTextAlign('center')}
                    className="flex items-center gap-2"
                    title="Alinhar ao centro"
                  >
                    <AlignCenter className="h-4 w-4" />
                    Centro
                  </Toggle>
                  <Toggle
                    pressed={textAlign === 'right'}
                    onPressedChange={() => setTextAlign('right')}
                    className="flex items-center gap-2"
                    title="Alinhar à direita"
                  >
                    <AlignRight className="h-4 w-4" />
                    Direita
                  </Toggle>
                </div>
              </div>

              {/* View Mode Toggle */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Modo de Visualização:
                </label>
                <div className="flex gap-2">
                  <Toggle
                    pressed={viewMode === 'grid'}
                    onPressedChange={() => setViewMode('grid')}
                    className="flex items-center gap-2"
                  >
                    <Grid3X3 className="h-4 w-4" />
                    Grid
                  </Toggle>
                  <Toggle
                    pressed={viewMode === 'list'}
                    onPressedChange={() => setViewMode('list')}
                    className="flex items-center gap-2"
                  >
                    <List className="h-4 w-4" />
                    Lista
                  </Toggle>
                </div>
              </div>

              {fontSource === 'system' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Categoria da Fonte:
                  </label>
                  <select
                    className="w-full rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm"
                    value={selectedCategory}
                    onChange={e => setSelectedCategory(e.target.value)}
                  >
                    <option value="all">Todas as Categorias ({fonts.length})</option>
                    {getUniqueCategories().map(category => {
                      const count = fonts.filter(font => font.category === category).length
                      return (
                        <option key={category} value={category}>
                          {category} ({count})
                        </option>
                      )
                    })}
                  </select>
                </div>
              )}

              {/* Peso da Fonte - Mostrar apenas quando há fontes carregadas */}
              {fonts.length > 0 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Peso da Fonte:
                  </label>
                  <select
                    className="w-full rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm"
                    value={selectedWeight}
                    onChange={e => setSelectedWeight(e.target.value)}
                  >
                    <option value="all">Todos os Pesos ({getFilteredFonts().length})</option>
                    {getUniqueWeights().map(weight => {
                      const count = fonts.filter(font => getFontWeight(font.name) === weight).length
                      return (
                        <option key={weight} value={weight}>
                          {getWeightDisplayName(weight)} ({count})
                        </option>
                      )
                    })}
                  </select>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Results Section */}
        {text && (
          <Card>
            <CardHeader>
              <CardTitle>Resultado com diferentes fontes</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8 text-gray-600 dark:text-gray-400">
                  Carregando fontes...
                </div>
              ) : fonts.length === 0 ? (
                <div className="text-center py-8 text-gray-600 dark:text-gray-400 space-y-2">
                  {fontSource === 'folder' ? (
                    <>
                      <p>Nenhuma fonte encontrada na pasta <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">public/fonts</code></p>
                      <p>Adicione arquivos de fonte (.woff2, .ttf, .otf) e clique em "Recarregar"</p>
                    </>
                  ) : (
                    <p>Nenhuma fonte do sistema disponível</p>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-center space-y-2">
                    <Badge variant="secondary" className="text-sm">
                      {fontSource === 'folder' ? '📁' : systemInfo?.icon || '🖥️'} {fonts.length} fonte(s) encontrada(s) ({fontSource === 'folder' ? 'pasta' : systemInfo?.name || 'sistema'})
                    </Badge>
                    {fontSource === 'system' && systemInfo && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Sistema: {systemInfo.icon} {systemInfo.name} | Plataforma: {systemInfo.platform}
                      </div>
                    )}
                  </div>
                  
                  {viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {getFilteredFonts().map((font, index) => (
                        <Card key={index} className="hover:shadow-lg transition-shadow">
                          <CardContent className="p-4">
                            <div 
                              className="leading-relaxed text-gray-900 dark:text-white mb-3 min-h-[80px] break-words whitespace-pre-wrap"
                              style={{ 
                                fontFamily: `'${font.name}', sans-serif`,
                                fontSize: `${fontSize}px`,
                                textAlign: textAlign,
                              }}
                            >
                              {text}
                            </div>
                            <div className="space-y-2">
                              <Badge className="w-full justify-center">
                                {font.name}
                              </Badge>
                              <div className="text-xs text-gray-500 dark:text-gray-400 text-center font-mono bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded">
                                {font.file}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {getFilteredFonts().map((font, index) => (
                        <Card key={index} className="hover:shadow-lg transition-shadow">
                          <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                              <div className="flex-1">
                                <div 
                                  className="leading-relaxed text-gray-900 dark:text-white mb-3 break-words whitespace-pre-wrap"
                                  style={{ 
                                    fontFamily: `'${font.name}', sans-serif`,
                                    fontSize: `${fontSize}px`,
                                    textAlign: textAlign,
                                  }}
                                >
                                  {text}
                                </div>
                              </div>
                              <div className="flex flex-col items-end gap-2 min-w-[120px]">
                                <Badge>
                                  {font.name}
                                </Badge>
                                <div className="text-xs text-gray-500 dark:text-gray-400 text-center font-mono bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded">
                                  {font.file}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-600 dark:text-gray-400">
          <p>
            {fontSource === 'folder' 
              ? 'Adicione mais fontes na pasta public/fonts e clique em "Recarregar" para expandir as opções'
              : systemInfo 
                ? `Usando fontes do ${systemInfo.icon} ${systemInfo.name}. Mude para "Pasta" para usar fontes customizadas.`
                : 'Usando fontes padrão do sistema. Mude para "Pasta" para usar fontes customizadas.'
            }
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
