# 🧩 Guia de Componentes do Pixel Universe

## 📚 Índice de Componentes

### 🎯 **Core Components**
Componentes fundamentais da aplicação.

#### `PixelGrid`
- **Localização:** `src/components/pixel-grid/PixelGrid.tsx`
- **Função:** Mapa interativo principal com navegação e seleção de pixels
- **Props:** Nenhuma (usa stores internos)
- **Funcionalidades:**
  - Zoom e pan do mapa
  - Seleção de pixels
  - Renderização canvas otimizada
  - Integração com IA para descrições

#### `PortugalMapSvg`
- **Localização:** `src/components/pixel-grid/PortugalMapSvg.tsx`
- **Função:** Carrega e processa o SVG do mapa de Portugal
- **Props:** `onMapDataLoaded`, `className`
- **Funcionalidades:**
  - Carregamento de dados do mapa
  - Mapeamento de distritos
  - Otimização de performance

#### `EnhancedPixelPurchaseModal`
- **Localização:** `src/components/pixel-grid/EnhancedPixelPurchaseModal.tsx`
- **Função:** Modal avançado para compra de pixels
- **Props:** `isOpen`, `onClose`, `pixelData`, `userCredits`, `onPurchase`
- **Funcionalidades:**
  - Fluxo de compra em 3 passos
  - Personalização de identidade
  - Múltiplos métodos de pagamento
  - Validação de saldo

### 🎨 **Feature Components**
Funcionalidades avançadas e especializadas.

#### `PremiumSubscription`
- **Localização:** `src/components/features/PremiumSubscription.tsx`
- **Função:** Sistema de subscrições premium
- **Funcionalidades:**
  - Planos de subscrição
  - Integração Stripe
  - Comparação de funcionalidades

#### `AIPixelAssistant`
- **Localização:** `src/components/features/AIPixelAssistant.tsx`
- **Função:** Assistente IA para pixels
- **Funcionalidades:**
  - Geração de descrições
  - Sugestões de cores
  - Análise de tendências

#### `LiveCollaboration`
- **Localização:** `src/components/features/LiveCollaboration.tsx`
- **Função:** Colaboração em tempo real
- **Funcionalidades:**
  - Edição simultânea
  - Chat integrado
  - Cursores em tempo real

### 📱 **Mobile Components**
Otimizações específicas para dispositivos móveis.

#### `MobileOptimizations`
- **Localização:** `src/components/mobile/MobileOptimizations.tsx`
- **Função:** Otimizações automáticas para mobile
- **Funcionalidades:**
  - Detecção de performance
  - Ajustes automáticos
  - Monitorização de bateria

#### `SwipeGestures`
- **Localização:** `src/components/mobile/SwipeGestures.tsx`
- **Função:** Gestos touch avançados
- **Funcionalidades:**
  - Swipe em 4 direções
  - Feedback visual
  - Ações personalizáveis

#### `HapticFeedback`
- **Localização:** `src/components/mobile/HapticFeedback.tsx`
- **Função:** Feedback tátil para mobile
- **Funcionalidades:**
  - Padrões de vibração
  - Integração com ações
  - Configurável

### 🔐 **Security Components**

#### `SecurityDashboard`
- **Localização:** `src/components/security/SecurityDashboard.tsx`
- **Função:** Painel de segurança da conta
- **Funcionalidades:**
  - Pontuação de segurança
  - Sessões ativas
  - Histórico de atividade

#### `TwoFactorAuth`
- **Localização:** `src/components/security/TwoFactorAuth.tsx`
- **Função:** Configuração de 2FA
- **Funcionalidades:**
  - QR Code generation
  - Verificação de códigos
  - Chaves de recuperação

### 💳 **Payment Components**

#### `StripePaymentProvider`
- **Localização:** `src/components/payment/StripePaymentProvider.tsx`
- **Função:** Provider para pagamentos Stripe
- **Funcionalidades:**
  - Context para pagamentos
  - Criação de payment intents
  - Gestão de subscrições

#### `CheckoutForm`
- **Localização:** `src/components/payment/CheckoutForm.tsx`
- **Função:** Formulário de checkout
- **Funcionalidades:**
  - Elementos Stripe
  - Validação de pagamento
  - Feedback de sucesso/erro

### 🎮 **Pixel Grid Components**
Componentes específicos do mapa de pixels.

#### `PixelAI`
- **Localização:** `src/components/pixel-grid/PixelAI.tsx`
- **Função:** IA integrada para pixels
- **Funcionalidades:**
  - Múltiplas funcionalidades IA
  - Templates e prompts
  - Histórico de resultados

#### `PixelAR`
- **Localização:** `src/components/pixel-grid/PixelAR.tsx`
- **Função:** Realidade aumentada
- **Funcionalidades:**
  - Câmara AR
  - Overlay de pixels
  - Captura de fotos

#### `PixelStories`
- **Localização:** `src/components/pixel-grid/PixelStories.tsx`
- **Função:** Stories estilo Instagram
- **Funcionalidades:**
  - Visualização de stories
  - Criação de conteúdo
  - Interações sociais

### 🎨 **UI Components**
Componentes base do design system.

#### Componentes shadcn/ui
- **Button, Card, Dialog, etc.** - Componentes base
- **Customizados** para o tema do Pixel Universe
- **Acessíveis** e responsivos

#### Componentes Customizados
- **Confetti** - Efeitos de celebração
- **SoundEffect** - Sistema de sons
- **EnhancedTooltip** - Tooltips avançados
- **LoadingStates** - Estados de carregamento

## 🔗 Padrões de Integração

### **Props Interface**
```typescript
interface ComponentProps {
  // Props obrigatórias
  data: RequiredData;
  onAction: (data: any) => void;
  
  // Props opcionais
  className?: string;
  variant?: 'default' | 'outline';
  
  // Children para composição
  children?: React.ReactNode;
}
```

### **Event Handling**
```typescript
// Padrão consistente para eventos
const handleAction = async (data: any) => {
  try {
    setLoading(true);
    await performAction(data);
    toast({ title: "Sucesso!", description: "Ação completada." });
  } catch (error) {
    toast({ title: "Erro", description: "Falha na ação.", variant: "destructive" });
  } finally {
    setLoading(false);
  }
};
```

### **Store Integration**
```typescript
// Uso consistente de stores
const { credits, addCredits } = useUserStore();
const { soldPixels, addSoldPixel } = usePixelStore();
const { theme, setTheme } = useSettingsStore();
```

## 🎭 Padrões de Animação

### **Framer Motion**
- **Page transitions** - Transições entre páginas
- **Component animations** - Animações de entrada/saída
- **Gesture handling** - Gestos e interações
- **Layout animations** - Mudanças de layout

### **CSS Animations**
- **Utility classes** - Animações reutilizáveis
- **Keyframes** - Animações customizadas
- **Performance** - GPU-accelerated
- **Reduced motion** - Acessibilidade

## 🔧 Utilitários e Helpers

### **Utils Functions**
- **Color manipulation** - Hex, RGB, HSL
- **Date formatting** - Internacionalização
- **Number formatting** - K, M, B suffixes
- **Validation** - Email, password, etc.

### **Custom Hooks**
- **useIsMobile** - Detecção de mobile
- **useMediaQuery** - Media queries reativas
- **useToast** - Sistema de notificações

## 📊 Performance Patterns

### **Lazy Loading**
```typescript
const LazyComponent = lazy(() => import('./Component'));
```

### **Memoization**
```typescript
const MemoizedComponent = memo(Component);
const memoizedValue = useMemo(() => calculation, [deps]);
const memoizedCallback = useCallback(() => action, [deps]);
```

### **Virtual Scrolling**
```typescript
<VirtualizedList
  items={items}
  itemSize={80}
  renderItem={(item) => <ItemComponent item={item} />}
/>
```

## 🌐 Internacionalização

### **i18next Integration**
- **Namespace organization** - Separação por funcionalidade
- **Lazy loading** - Carregamento sob demanda
- **Pluralization** - Suporte a plurais
- **Interpolation** - Variáveis dinâmicas

### **Supported Languages**
- **pt-PT** - Português (Portugal) - Principal
- **en-US** - English (US) - Secundário
- **es-ES** - Español - Futuro

## 🔒 Security Patterns

### **Authentication**
- **Protected routes** - RequireAuth wrapper
- **Token management** - Automatic refresh
- **Role-based access** - Permissions system

### **Data Validation**
- **Input sanitization** - XSS prevention
- **Type checking** - TypeScript strict
- **API validation** - Server-side checks

## 📱 Mobile Patterns

### **Touch Interactions**
- **Gesture recognition** - Swipe, pinch, tap
- **Haptic feedback** - Vibration patterns
- **Touch targets** - Minimum 44px
- **Accessibility** - Screen reader support

### **Performance**
- **Adaptive rendering** - Quality based on device
- **Battery awareness** - Power saving modes
- **Network awareness** - Data saving options

## 🎯 Best Practices

### **Component Design**
1. **Single Responsibility** - Uma função por componente
2. **Composition over Inheritance** - Flexibilidade
3. **Props Interface** - TypeScript strict
4. **Error Boundaries** - Graceful failures

### **State Management**
1. **Local vs Global** - Escolha apropriada
2. **Immutability** - Estado imutável
3. **Normalization** - Estrutura eficiente
4. **Persistence** - Dados importantes salvos

### **Performance**
1. **Bundle Splitting** - Carregamento otimizado
2. **Tree Shaking** - Código não usado removido
3. **Caching** - Estratégias de cache
4. **Monitoring** - Métricas de performance

---

Esta arquitetura garante que o Pixel Universe seja **escalável**, **manutenível** e **performante**, proporcionando uma base sólida para crescimento futuro.