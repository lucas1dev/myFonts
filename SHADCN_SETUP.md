# 🎨 Shadcn/ui - Configuração

## 📋 O que é o Shadcn/ui?

O Shadcn/ui é uma biblioteca de componentes React que oferece:
- **Componentes acessíveis** baseados em Radix UI
- **Design system consistente** com Tailwind CSS
- **Customização total** - você possui o código dos componentes
- **Modo escuro** automático
- **Animações suaves** com Framer Motion

## 🧩 Componentes Utilizados

### Button
- Botões com diferentes variantes (default, outline, secondary, etc.)
- Estados de loading e disabled
- Ícones integrados

### Card
- Cards com header, content e footer
- Sombras e bordas consistentes
- Responsivo automaticamente

### Textarea
- Campo de texto com foco e estados
- Placeholder e validação
- Redimensionável

### Badge
- Badges para informações e status
- Diferentes variantes de cor
- Tamanhos flexíveis

## 🎨 Ícones Lucide React

Utilizamos ícones da biblioteca Lucide React:
- `Type` - Ícone principal do título
- `FileText` - Ícone do campo de texto
- `RefreshCw` - Ícone de recarregamento (com animação)

## 🌙 Modo Escuro

O sistema suporta modo escuro automaticamente:
- Detecta preferência do sistema
- Transições suaves entre temas
- Cores consistentes em ambos os modos

## 📱 Responsividade

Todos os componentes são responsivos:
- **Mobile**: Layout em coluna única
- **Tablet**: Grid 2 colunas
- **Desktop**: Grid 3 colunas

## 🔧 Adicionando Novos Componentes

Para adicionar novos componentes do Shadcn:

```bash
# Instalar componente
npx shadcn@latest add [nome-do-componente]

# Exemplo:
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
npx shadcn@latest add toast
```

## 🎯 Personalização

### Cores
As cores são definidas em `src/index.css`:
```css
:root {
  --primary: 221.2 83.2% 53.3%;
  --secondary: 210 40% 96%;
  /* ... outras cores */
}
```

### Tema
O tema base é "slate" mas pode ser alterado em `components.json`:
```json
{
  "tailwind": {
    "baseColor": "blue" // ou "green", "red", etc.
  }
}
```

## 📚 Recursos Adicionais

- [Documentação Shadcn/ui](https://ui.shadcn.com/)
- [Componentes disponíveis](https://ui.shadcn.com/docs/components)
- [Lucide Icons](https://lucide.dev/)
- [Tailwind CSS](https://tailwindcss.com/) 