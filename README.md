# 🎨 Sistema de Visualização de Fontes

Um sistema completo para visualizar texto com diferentes fontes, desenvolvido com React, Vite e Node.js. Suporta fontes da pasta local e fontes do sistema operacional com detecção dinâmica.

## ✨ Funcionalidades

### 🎯 **Funcionalidades Principais**
- **Visualização de texto** com múltiplas fontes simultaneamente
- **Duas fontes de fontes**: Pasta local e Sistema operacional
- **Detecção dinâmica** de fontes do sistema (macOS, Windows, Linux)
- **Interface moderna** com Shadcn/ui e Tailwind CSS
- **Responsivo** para desktop e mobile

### 🎛️ **Controles de Visualização**
- **Tamanho da fonte**: Slider de 8px a 280px
- **Alinhamento de texto**: Esquerda, Centro, Direita
- **Modo de visualização**: Grid ou Lista
- **Peso da fonte**: Para fontes do sistema (normal, bold, 100-900)
- **Filtro por categoria**: Para fontes do sistema (serif, sans-serif, monospace, etc.)

### 📁 **Fontes da Pasta**
- Carrega fontes da pasta `public/fonts`
- Suporta formatos: `.woff2`, `.woff`, `.ttf`, `.otf`
- Detecção automática de arquivos de fonte
- Nomes de fonte formatados automaticamente

### 🖥️ **Fontes do Sistema**
- **macOS**: Usa `system_profiler SPFontsDataType`
- **Windows**: Usa registro do sistema
- **Linux**: Usa `fc-list : family`
- **Categorização automática**: serif, sans-serif, monospace, display, system
- **Fallback inteligente** se detecção falhar

## 🚀 Instalação e Configuração

### Pré-requisitos
- Node.js v22.14.0 (usando NVM)
- npm ou yarn

### Instalação
```bash
# Clonar o repositório
git clone <repository-url>
cd myFonts

# Usar a versão correta do Node.js
nvm use

# Instalar dependências
npm install

# Configurar fontes (opcional)
mkdir -p public/fonts
# Adicionar arquivos de fonte (.woff2, .ttf, .otf) na pasta public/fonts
```

### Desenvolvimento
```bash
# Iniciar servidor de desenvolvimento
npm run dev

# Acessar aplicação
open http://localhost:5173
```

### Produção
```bash
# Build da aplicação
npm run build

# Iniciar servidor de produção
npm run preview

# Acessar aplicação
open http://localhost:3000
```

## 🛠️ Deploy em Produção

### Deploy Automatizado
```bash
# Executar script de deploy
./deploy.sh
```

### Deploy Manual
```bash
# Build da aplicação
npm run build

# Instalar PM2 (se não estiver instalado)
npm install -g pm2

# Iniciar aplicação com PM2
pm2 start ecosystem.config.cjs

# Salvar configuração do PM2
pm2 save

# Verificar status
pm2 status
```

### Comandos PM2
```bash
# Gerenciar aplicação
pm2 start myfonts-app    # Iniciar
pm2 stop myfonts-app     # Parar
pm2 restart myfonts-app  # Reiniciar
pm2 delete myfonts-app   # Remover

# Logs e monitoramento
pm2 logs myfonts-app     # Ver logs
pm2 monit               # Monitoramento em tempo real
```

## 📖 Como Usar

### 1. **Configuração Inicial**
- Digite o texto que deseja visualizar
- Escolha entre "Pasta" ou "Sistema" para fonte das fontes

### 2. **Controles de Visualização**
- **Tamanho**: Ajuste o slider (8px - 280px)
- **Alinhamento**: Escolha entre Esquerda, Centro, Direita
- **Modo**: Grid (cards) ou Lista (linhas)

### 3. **Fontes da Pasta**
- Adicione arquivos de fonte na pasta `public/fonts`
- Formatos suportados: `.woff2`, `.woff`, `.ttf`, `.otf`
- Clique em "Recarregar" para detectar novas fontes

### 4. **Fontes do Sistema**
- **Peso da fonte**: Selecione normal, bold, ou valores de 100-900
- **Categoria**: Filtre por serif, sans-serif, monospace, display, system
- **Detecção automática** baseada no sistema operacional

### 5. **Resultados**
- Visualize o texto com todas as fontes disponíveis
- Informações da fonte: nome, arquivo, categoria
- Layout responsivo para diferentes tamanhos de tela

## 🎛️ Controles de Visualização

### **Controles Gerais**
- ✅ **Tamanho da fonte**: 8px - 280px
- ✅ **Alinhamento**: Esquerda, Centro, Direita
- ✅ **Modo de visualização**: Grid ou Lista
- ✅ **Fonte das fontes**: Pasta ou Sistema

### **Controles para Fontes do Sistema**
- ✅ **Peso da fonte**: normal, bold, 100-900
- ✅ **Filtro por categoria**: serif, sans-serif, monospace, display, system

### **Controles para Fontes da Pasta**
- ✅ **Recarregamento**: Detecta novas fontes automaticamente
- ✅ **Formatação**: Nomes de fonte formatados automaticamente

## ⚙️ Configuração

### **Variáveis de Ambiente**
```bash
PORT=3000                    # Porta do servidor
NODE_ENV=production          # Ambiente (development/production)
```

### **Estrutura de Pastas**
```
myFonts/
├── public/
│   └── fonts/              # Fontes customizadas
├── src/
│   ├── components/ui/      # Componentes Shadcn/ui
│   ├── App.jsx            # Componente principal
│   └── index.css          # Estilos globais
├── server.js              # Servidor Node.js
├── ecosystem.config.cjs   # Configuração PM2
└── package.json           # Dependências e scripts
```

## 📊 Monitoramento

### **Logs**
```bash
# Ver logs em tempo real
pm2 logs myfonts-app

# Ver logs de erro
pm2 logs myfonts-app --err

# Ver logs de saída
pm2 logs myfonts-app --out
```

### **Status**
```bash
# Status da aplicação
pm2 status

# Informações detalhadas
pm2 show myfonts-app

# Monitoramento em tempo real
pm2 monit
```

## 🌐 Acesso

### **URLs da Aplicação**
- **Desenvolvimento**: http://localhost:5173
- **Produção**: http://localhost:3000

### **APIs Disponíveis**
- **Fontes da pasta**: `GET /api/fonts`
- **Fontes do sistema**: `GET /api/system-fonts`
- **Arquivos estáticos**: `GET /` (HTML, CSS, JS)

## 📝 Scripts Disponíveis

### **Desenvolvimento**
```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build para produção
npm run preview      # Preview da build
```

### **Produção (PM2)**
```bash
npm run prod:start   # Iniciar com PM2
npm run prod:stop    # Parar PM2
npm run prod:restart # Reiniciar PM2
npm run prod:logs    # Ver logs
npm run prod:monit   # Monitoramento
```

## 🔒 Segurança

### **Configurações de Segurança**
- CORS configurado para permitir acesso local
- Headers de segurança básicos
- Validação de tipos de arquivo para fontes
- Buffer limits para comandos do sistema

### **Recomendações**
- Use HTTPS em produção
- Configure firewall adequadamente
- Monitore logs regularmente
- Mantenha dependências atualizadas

## ⚡ Performance

### **Otimizações Implementadas**
- **Build otimizado**: Minificação e compressão
- **Lazy loading**: Carregamento sob demanda
- **Cache**: Headers de cache para assets estáticos
- **Limitação**: Máximo 100 fontes do sistema para performance

### **Métricas**
- **Tempo de carregamento**: < 2s
- **Tamanho do bundle**: ~220KB (gzipped)
- **Fontes carregadas**: Até 100 do sistema + ilimitadas da pasta

## 🐛 Troubleshooting

### **Problemas Comuns**

#### **Fontes não carregam**
```bash
# Verificar pasta de fontes
ls -la public/fonts/

# Verificar logs do servidor
pm2 logs myfonts-app
```

#### **Erro de porta em uso**
```bash
# Encontrar processo usando a porta
lsof -ti:3000

# Matar processo
kill -9 <PID>
```

#### **PM2 não inicia**
```bash
# Verificar configuração
pm2 show myfonts-app

# Reiniciar PM2
pm2 kill && pm2 start ecosystem.config.cjs
```

### **Logs de Debug**
```bash
# Logs detalhados
pm2 logs myfonts-app --lines 50

# Logs de erro
pm2 logs myfonts-app --err --lines 20
```

## 🛠️ Tecnologias

### **Frontend**
- **React 18**: Biblioteca de UI
- **Vite**: Build tool e dev server
- **Tailwind CSS**: Framework CSS
- **Shadcn/ui**: Componentes UI
- **Lucide React**: Ícones

### **Backend**
- **Node.js**: Runtime JavaScript
- **HTTP Server**: Servidor nativo
- **PM2**: Process manager
- **Font Detection**: Comandos nativos do sistema

### **Ferramentas**
- **NVM**: Gerenciamento de versões Node.js
- **npm**: Gerenciador de pacotes
- **Git**: Controle de versão

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📞 Suporte

Para suporte, abra uma issue no repositório ou entre em contato através dos canais oficiais.

---

**Desenvolvido com ❤️ usando React, Vite e Node.js**
