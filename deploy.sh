#!/bin/bash

# 🚀 Script de Deploy Automatizado para Produção
# Sistema de Visualização de Fontes

set -e  # Para o script se houver erro

echo "🚀 Iniciando deploy do Sistema de Visualização de Fontes..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para log colorido
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] ⚠️  $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ❌ $1${NC}"
}

info() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] ℹ️  $1${NC}"
}

# Verificar se o PM2 está instalado
if ! command -v pm2 &> /dev/null; then
    error "PM2 não está instalado. Instalando..."
    npm install -g pm2
fi

# Verificar se o Node.js está na versão correta
log "Verificando versão do Node.js..."
nvm use
NODE_VERSION=$(node --version)
log "Node.js versão: $NODE_VERSION"

# Parar aplicação se estiver rodando
log "Parando aplicação anterior..."
pm2 stop myfonts-app 2>/dev/null || warn "Aplicação não estava rodando"

# Limpar build anterior
log "Limpando build anterior..."
rm -rf dist/

# Instalar dependências
log "Instalando dependências..."
npm install

# Fazer build para produção
log "Fazendo build para produção..."
npm run build

# Verificar se o build foi bem-sucedido
if [ ! -d "dist" ]; then
    error "Build falhou! Pasta dist não foi criada."
    exit 1
fi

log "Build concluído com sucesso!"

# Iniciar aplicação com PM2
log "Iniciando aplicação com PM2..."
pm2 start ecosystem.config.cjs --env production

# Aguardar um pouco para a aplicação inicializar
sleep 3

# Verificar status
log "Verificando status da aplicação..."
pm2 status

# Verificar se a aplicação está respondendo
log "Testando aplicação..."
if curl -s http://localhost:3000 > /dev/null; then
    log "✅ Aplicação está respondendo corretamente!"
else
    warn "⚠️  Aplicação pode não estar respondendo ainda. Verifique os logs:"
    pm2 logs myfonts-app --lines 10
fi

# Mostrar informações úteis
echo ""
log "🎉 Deploy concluído com sucesso!"
echo ""
info "📊 Comandos úteis:"
echo "   pm2 status                    - Ver status da aplicação"
echo "   pm2 logs myfonts-app          - Ver logs"
echo "   pm2 monit                     - Monitorar em tempo real"
echo "   pm2 restart myfonts-app       - Reiniciar aplicação"
echo "   pm2 stop myfonts-app          - Parar aplicação"
echo ""
info "🌐 Acesse a aplicação em:"
echo "   http://localhost:3000"
echo "   http://seu-ip:3000 (para acesso externo)"
echo ""
info "📁 Logs disponíveis em:"
echo "   logs/err.log      - Logs de erro"
echo "   logs/out.log      - Logs de saída"
echo "   logs/combined.log - Logs combinados"
echo ""

# Salvar configuração do PM2 para reinicialização automática
log "Configurando reinicialização automática..."
pm2 save

log "✅ Deploy finalizado! A aplicação está rodando em produção." 