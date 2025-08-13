# 🧪 Guia de Testes do Pixel Universe

## 📋 Visão Geral

O Pixel Universe utiliza uma estratégia de testes abrangente para garantir qualidade, confiabilidade e uma experiência de utilizador excepcional.

## 🏗️ Estrutura de Testes

### **Tipos de Testes**

#### 1. **Testes Unitários**
- **Framework:** Jest + React Testing Library
- **Localização:** `src/tests/`
- **Cobertura:** Componentes, hooks, utilitários, stores
- **Objetivo:** Testar funcionalidades isoladas

#### 2. **Testes de Integração**
- **Framework:** Jest + React Testing Library
- **Foco:** Interação entre componentes
- **Cenários:** Fluxos de compra, autenticação, navegação

#### 3. **Testes E2E** (Futuro)
- **Framework:** Playwright ou Cypress
- **Foco:** Jornadas completas do utilizador
- **Cenários:** Registo → Compra → Personalização

## 📁 Organização dos Testes

```
src/tests/
├── components/           # Testes de componentes
│   ├── auth/            # Autenticação
│   ├── pixel-grid/      # Mapa e pixels
│   ├── ui/              # Componentes UI
│   └── layout/          # Layout e navegação
├── hooks/               # Testes de hooks
├── stores/              # Testes de estado
├── utils/               # Testes de utilitários
├── integration/         # Testes de integração
└── __mocks__/           # Mocks globais
```

## 🎯 Estratégia de Testes

### **Componentes Críticos**
1. **PixelGrid** - Funcionalidade principal
2. **AuthModal** - Sistema de autenticação
3. **UserMenu** - Gestão de utilizador
4. **PurchaseModal** - Fluxo de compra
5. **Stores** - Gestão de estado

### **Cenários de Teste**

#### **Autenticação**
```typescript
describe('Authentication Flow', () => {
  it('should login with valid credentials');
  it('should show error with invalid credentials');
  it('should register new user');
  it('should handle social login');
  it('should reset password');
});
```

#### **Compra de Pixels**
```typescript
describe('Pixel Purchase', () => {
  it('should show pixel details on click');
  it('should handle purchase with sufficient credits');
  it('should show error with insufficient credits');
  it('should require authentication');
  it('should update user stats after purchase');
});
```

#### **Gestão de Estado**
```typescript
describe('User Store', () => {
  it('should add/remove credits correctly');
  it('should handle level progression');
  it('should persist data locally');
  it('should sync with server');
});
```

## 🔧 Configuração de Testes

### **Jest Configuration**
- **Environment:** jsdom para testes de componentes React
- **Setup:** Mocks para Next.js, Firebase, Canvas API
- **Coverage:** 80% threshold para branches, functions, lines
- **Transforms:** Babel para TypeScript/JSX

### **Mocks Essenciais**
- **Next.js Router** - Navegação
- **Firebase** - Autenticação e base de dados
- **Canvas API** - Renderização do mapa
- **Web APIs** - Geolocalização, notificações, etc.

## 🚀 Executar Testes

### **Comandos Disponíveis**
```bash
# Executar todos os testes
npm test

# Executar testes em modo watch
npm run test:watch

# Executar testes com cobertura
npm run test:coverage

# Executar testes específicos
npm test -- --testNamePattern="UserStore"

# Executar testes de um ficheiro
npm test UserStore.test.ts
```

### **Scripts Package.json**
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --ci --coverage --watchAll=false"
  }
}
```

## 📊 Cobertura de Testes

### **Objetivos de Cobertura**
- **Branches:** 80%
- **Functions:** 80%
- **Lines:** 80%
- **Statements:** 80%

### **Áreas Prioritárias**
1. **Lógica de negócio** - 95%
2. **Componentes críticos** - 90%
3. **Utilitários** - 85%
4. **UI Components** - 70%

## 🎭 Mocks e Fixtures

### **Dados de Teste**
```typescript
// Mock user data
export const mockUser = {
  uid: 'test-user-123',
  email: 'test@pixeluniverse.pt',
  displayName: 'Test User',
  level: 5,
  credits: 1000,
  pixels: 10,
};

// Mock pixel data
export const mockPixel = {
  x: 100,
  y: 200,
  region: 'Lisboa',
  price: 150,
  rarity: 'Raro',
  owner: 'Sistema',
};
```

### **Mocks de APIs**
```typescript
// Firebase Auth mock
jest.mock('@/lib/firebase', () => ({
  auth: {
    signInWithEmailAndPassword: jest.fn(),
    createUserWithEmailAndPassword: jest.fn(),
    signOut: jest.fn(),
  },
}));
```

## 🔍 Testes de Performance

### **Métricas Monitorizadas**
- **FPS** - Frames por segundo
- **Memory Usage** - Uso de memória
- **Load Time** - Tempo de carregamento
- **Interaction Delay** - Atraso de interação

### **Testes de Carga**
```typescript
describe('Performance Tests', () => {
  it('should render 1000 pixels without lag');
  it('should handle rapid zoom changes');
  it('should maintain 30+ FPS on mobile');
  it('should load map under 3 seconds');
});
```

## 🎨 Testes Visuais

### **Snapshot Testing**
- Componentes UI críticos
- Estados de loading
- Modais e dialogs
- Layouts responsivos

### **Accessibility Testing**
```typescript
describe('Accessibility', () => {
  it('should have proper ARIA labels');
  it('should support keyboard navigation');
  it('should meet contrast requirements');
  it('should work with screen readers');
});
```

## 🌐 Testes de Internacionalização

### **Multi-idioma**
```typescript
describe('Internationalization', () => {
  it('should display Portuguese by default');
  it('should switch to English');
  it('should format dates correctly');
  it('should handle RTL languages');
});
```

## 📱 Testes Mobile

### **Responsividade**
```typescript
describe('Mobile Experience', () => {
  it('should adapt to mobile viewport');
  it('should handle touch gestures');
  it('should show mobile navigation');
  it('should optimize for performance');
});
```

## 🔐 Testes de Segurança

### **Autenticação e Autorização**
```typescript
describe('Security', () => {
  it('should protect authenticated routes');
  it('should validate user permissions');
  it('should sanitize user inputs');
  it('should handle session expiry');
});
```

## 🚨 Testes de Erro

### **Error Boundaries**
```typescript
describe('Error Handling', () => {
  it('should catch component errors');
  it('should show fallback UI');
  it('should log errors properly');
  it('should recover gracefully');
});
```

## 📈 Métricas de Qualidade

### **Indicadores de Sucesso**
- **Cobertura de testes:** >80%
- **Testes passando:** 100%
- **Tempo de execução:** <30s
- **Flakiness:** <1%

### **Relatórios**
- **Coverage Report** - HTML detalhado
- **Test Results** - JUnit XML
- **Performance Metrics** - JSON
- **Accessibility Report** - WCAG compliance

## 🔄 CI/CD Integration

### **GitHub Actions** (Futuro)
```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run test:ci
      - run: npm run build
```

## 🎯 Boas Práticas

### **Escrita de Testes**
1. **AAA Pattern** - Arrange, Act, Assert
2. **Descriptive Names** - Nomes claros e específicos
3. **Single Responsibility** - Um conceito por teste
4. **Independent Tests** - Testes isolados

### **Manutenção**
1. **Update Regularly** - Manter testes atualizados
2. **Refactor Tests** - Melhorar quando necessário
3. **Remove Obsolete** - Eliminar testes desnecessários
4. **Document Changes** - Documentar alterações importantes

## 🔮 Roadmap de Testes

### **Próximos Passos**
1. **E2E Testing** - Implementar Playwright
2. **Visual Regression** - Testes de regressão visual
3. **Load Testing** - Testes de carga
4. **A/B Testing** - Framework para testes A/B

### **Ferramentas Futuras**
- **Storybook** - Documentação visual de componentes
- **Chromatic** - Testes visuais automatizados
- **Lighthouse CI** - Testes de performance automatizados

---

Esta estratégia de testes garante que o Pixel Universe mantenha alta qualidade e confiabilidade à medida que evolui e cresce.