## 📡 WebSocket Events (Tempo Real)

### **Connection**
```typescript
// Conectar ao WebSocket
const ws = new WebSocket('wss://api.pixeluniverse.pt/ws');
```

### **Eventos Disponíveis**
```typescript
// Pixel updates em tempo real
ws.on('pixel_purchased', (data) => {
  console.log(`Pixel (${data.x}, ${data.y}) foi comprado por ${data.buyer}`);
});

ws.on('pixel_updated', (data) => {
  console.log(`Pixel (${data.x}, ${data.y}) foi atualizado`);
});

// User activity
ws.on('user_online', (data) => {
  console.log(`${data.username} ficou online`);
});

// Achievements
ws.on('achievement_unlocked', (data) => {
  console.log(`${data.username} desbloqueou ${data.achievement}`);
});

// Marketplace
ws.on('auction_bid', (data) => {
  console.log(`Novo lance de €${data.amount} no pixel (${data.x}, ${data.y})`);
});
```

## 🔄 Webhooks

### **Stripe Webhooks**
```typescript
// Endpoint: /api/webhooks/stripe
// Events: payment_intent.succeeded, subscription.updated, etc.
```

### **Custom Webhooks**
```typescript
// Para integrações externas
POST /webhooks/pixel-purchase
POST /webhooks/user-achievement
POST /webhooks/marketplace-activity
```

## 📊 Response Formats

### **Success Response**
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully",
  "timestamp": "2024-03-15T10:30:00Z"
}
```

### **Error Response**
```json
{
  "success": false,
  "error": {
    "code": "INSUFFICIENT_CREDITS",
    "message": "Não tem créditos suficientes para esta operação",
    "details": {
      "required": 150,
      "available": 100
    }
  },
  "timestamp": "2024-03-15T10:30:00Z"
}
```

### **Pagination**
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1500,
    "totalPages": 75,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## 🚀 SDK e Integrações

### **JavaScript SDK**
```typescript
import { PixelUniverseAPI } from '@pixeluniverse/sdk';

const api = new PixelUniverseAPI({
  apiKey: 'your_api_key',
  environment: 'production'
});

// Comprar pixel
const result = await api.pixels.purchase(123, 456, {
  paymentMethod: 'credits',
  customization: { name: 'Meu Pixel' }
});
```

### **Webhook Verification**
```typescript
import crypto from 'crypto';

const verifyWebhook = (payload: string, signature: string, secret: string) => {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
};
```

## 📈 Métricas e Monitorização

### **Health Check**
```typescript
GET /health

Response:
{
  "status": "healthy",
  "version": "1.0.0",
  "uptime": 86400,
  "services": {
    "database": "healthy",
    "redis": "healthy",
    "stripe": "healthy"
  }
}
```

### **Métricas**
```typescript
GET /metrics

Response:
{
  "activeUsers": 1247,
  "pixelsSold": 12543,
  "totalTransactions": 45678,
  "averageResponseTime": 120,
  "errorRate": 0.01
}
```

## 🔧 Códigos de Erro

### **Autenticação (401)**
- `INVALID_TOKEN` - Token inválido ou expirado
- `USER_NOT_FOUND` - Utilizador não encontrado
- `ACCOUNT_DISABLED` - Conta desativada

### **Autorização (403)**
- `INSUFFICIENT_PERMISSIONS` - Permissões insuficientes
- `PIXEL_NOT_OWNED` - Pixel não pertence ao utilizador
- `PREMIUM_REQUIRED` - Funcionalidade requer premium

### **Recursos (404)**
- `PIXEL_NOT_FOUND` - Pixel não encontrado
- `USER_NOT_FOUND` - Utilizador não encontrado
- `ACHIEVEMENT_NOT_FOUND` - Conquista não encontrada

### **Validação (422)**
- `INVALID_COORDINATES` - Coordenadas inválidas
- `INVALID_COLOR` - Cor inválida
- `INSUFFICIENT_CREDITS` - Créditos insuficientes
- `PIXEL_ALREADY_OWNED` - Pixel já tem proprietário

### **Rate Limiting (429)**
- `RATE_LIMIT_EXCEEDED` - Limite de requests excedido

### **Servidor (500)**
- `INTERNAL_ERROR` - Erro interno do servidor
- `DATABASE_ERROR` - Erro na base de dados
- `PAYMENT_ERROR` - Erro no processamento de pagamento

## 🎯 Exemplos de Uso

### **Comprar um Pixel**
```typescript
const purchasePixel = async (x: number, y: number) => {
  try {
    const response = await fetch(`/api/pixels/${x}/${y}/purchase`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${userToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        paymentMethod: 'credits',
        customization: {
          name: 'Meu Pixel Especial',
          description: 'Um pixel único',
          color: '#D4A757',
          tags: ['arte', 'especial']
        }
      })
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('Pixel comprado com sucesso!');
    }
  } catch (error) {
    console.error('Erro na compra:', error);
  }
};
```

### **Listar Pixels de um Utilizador**
```typescript
const getUserPixels = async (userId: string) => {
  const response = await fetch(`/api/users/${userId}/pixels`, {
    headers: {
      'Authorization': `Bearer ${userToken}`
    }
  });
  
  return response.json();
};
```

### **Subscrever a Eventos em Tempo Real**
```typescript
const subscribeToPixelUpdates = (region: string) => {
  const ws = new WebSocket('wss://api.pixeluniverse.pt/ws');
  
  ws.onopen = () => {
    ws.send(JSON.stringify({
      type: 'subscribe',
      channel: `pixels:${region}`
    }));
  };
  
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log('Pixel update:', data);
  };
};
```

## 🔐 Segurança

### **API Keys**
```typescript
// Para integrações externas
X-API-Key: your_api_key

// Scopes disponíveis
- read:pixels
- write:pixels
- read:users
- write:users
- read:analytics
```

### **HTTPS Obrigatório**
Todas as requests devem usar HTTPS em produção.

### **Input Sanitization**
Todos os inputs são validados e sanitizados.

### **SQL Injection Protection**
Queries parametrizadas e ORM seguro.

## 📚 Recursos Adicionais

### **Postman Collection**
Disponível em: `/docs/postman-collection.json`

### **OpenAPI Specification**
Disponível em: `/docs/openapi.yaml`

### **SDK Packages**
- `@pixeluniverse/js-sdk` - JavaScript/TypeScript
- `@pixeluniverse/react-hooks` - React Hooks
- `@pixeluniverse/vue-composables` - Vue Composables

---

Esta API fornece uma base sólida para integrações e expansão futura do Pixel Universe.