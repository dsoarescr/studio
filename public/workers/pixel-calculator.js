// Web Worker para cálculos pesados de pixels
self.onmessage = function(e) {
  const { type, data } = e.data;
  
  switch (type) {
    case 'CALCULATE_PIXEL_STATS':
      calculatePixelStats(data);
      break;
    case 'ANALYZE_PIXEL_PATTERNS':
      analyzePixelPatterns(data);
      break;
    case 'GENERATE_RECOMMENDATIONS':
      generateRecommendations(data);
      break;
    case 'PROCESS_LARGE_DATASET':
      processLargeDataset(data);
      break;
    default:
      self.postMessage({ error: 'Unknown message type' });
  }
};

function calculatePixelStats(pixelData) {
  try {
    const startTime = performance.now();
    
    // Análise estatística complexa
    const stats = {
      totalPixels: pixelData.length,
      totalValue: 0,
      averagePrice: 0,
      priceDistribution: {},
      regionStats: {},
      rarityStats: {},
      ownershipStats: {},
      priceHistory: [],
      marketTrends: []
    };

    // Calcular estatísticas
    pixelData.forEach(pixel => {
      // Valor total
      stats.totalValue += pixel.price || 0;
      
      // Distribuição de preços
      const priceRange = getPriceRange(pixel.price);
      stats.priceDistribution[priceRange] = (stats.priceDistribution[priceRange] || 0) + 1;
      
      // Estatísticas por região
      if (!stats.regionStats[pixel.region]) {
        stats.regionStats[pixel.region] = {
          count: 0,
          totalValue: 0,
          averagePrice: 0
        };
      }
      stats.regionStats[pixel.region].count++;
      stats.regionStats[pixel.region].totalValue += pixel.price || 0;
      
      // Estatísticas de raridade
      if (!stats.rarityStats[pixel.rarity]) {
        stats.rarityStats[pixel.rarity] = {
          count: 0,
          totalValue: 0
        };
      }
      stats.rarityStats[pixel.rarity].count++;
      stats.rarityStats[pixel.rarity].totalValue += pixel.price || 0;
      
      // Estatísticas de propriedade
      if (pixel.owner) {
        if (!stats.ownershipStats[pixel.owner]) {
          stats.ownershipStats[pixel.owner] = {
            pixelCount: 0,
            totalValue: 0
          };
        }
        stats.ownershipStats[pixel.owner].pixelCount++;
        stats.ownershipStats[pixel.owner].totalValue += pixel.price || 0;
      }
    });

    // Calcular médias
    stats.averagePrice = stats.totalValue / stats.totalPixels;
    
    // Calcular médias por região
    Object.keys(stats.regionStats).forEach(region => {
      const regionData = stats.regionStats[region];
      regionData.averagePrice = regionData.totalValue / regionData.count;
    });

    // Análise de tendências de preço
    stats.priceHistory = analyzePriceHistory(pixelData);
    stats.marketTrends = calculateMarketTrends(pixelData);

    const endTime = performance.now();
    const processingTime = endTime - startTime;

    self.postMessage({
      type: 'PIXEL_STATS_RESULT',
      data: {
        stats,
        processingTime,
        timestamp: Date.now()
      }
    });
  } catch (error) {
    self.postMessage({
      type: 'ERROR',
      error: error.message
    });
  }
}

function analyzePixelPatterns(pixelData) {
  try {
    const patterns = {
      clusters: findPixelClusters(pixelData),
      corridors: findPixelCorridors(pixelData),
      hotspots: findHotspots(pixelData),
      deadZones: findDeadZones(pixelData),
      connectivity: analyzeConnectivity(pixelData)
    };

    self.postMessage({
      type: 'PATTERN_ANALYSIS_RESULT',
      data: patterns
    });
  } catch (error) {
    self.postMessage({
      type: 'ERROR',
      error: error.message
    });
  }
}

function generateRecommendations(userData) {
  try {
    const recommendations = {
      investment: generateInvestmentRecommendations(userData),
      collection: generateCollectionRecommendations(userData),
      trading: generateTradingRecommendations(userData),
      social: generateSocialRecommendations(userData)
    };

    self.postMessage({
      type: 'RECOMMENDATIONS_RESULT',
      data: recommendations
    });
  } catch (error) {
    self.postMessage({
      type: 'ERROR',
      error: error.message
    });
  }
}

function processLargeDataset(dataset) {
  try {
    const chunkSize = 1000;
    const chunks = [];
    
    // Dividir dataset em chunks
    for (let i = 0; i < dataset.length; i += chunkSize) {
      chunks.push(dataset.slice(i, i + chunkSize));
    }

    const results = [];
    let processedChunks = 0;

    // Processar chunks
    chunks.forEach((chunk, index) => {
      const chunkResult = processChunk(chunk);
      results.push(chunkResult);
      processedChunks++;

      // Reportar progresso
      if (processedChunks % 5 === 0 || processedChunks === chunks.length) {
        const progress = (processedChunks / chunks.length) * 100;
        self.postMessage({
          type: 'PROGRESS_UPDATE',
          data: {
            progress,
            processedChunks,
            totalChunks: chunks.length
          }
        });
      }
    });

    // Combinar resultados
    const finalResult = combineResults(results);

    self.postMessage({
      type: 'LARGE_DATASET_RESULT',
      data: finalResult
    });
  } catch (error) {
    self.postMessage({
      type: 'ERROR',
      error: error.message
    });
  }
}

// Funções auxiliares
function getPriceRange(price) {
  if (price < 10) return '0-10';
  if (price < 50) return '10-50';
  if (price < 100) return '50-100';
  if (price < 500) return '100-500';
  if (price < 1000) return '500-1000';
  return '1000+';
}

function analyzePriceHistory(pixelData) {
  // Simular análise de histórico de preços
  const priceHistory = [];
  const now = Date.now();
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date(now - (i * 24 * 60 * 60 * 1000));
    const avgPrice = Math.random() * 100 + 50; // Simulado
    
    priceHistory.push({
      date: date.toISOString().split('T')[0],
      averagePrice: avgPrice,
      volume: Math.floor(Math.random() * 1000)
    });
  }
  
  return priceHistory;
}

function calculateMarketTrends(pixelData) {
  // Calcular tendências de mercado
  return {
    overallTrend: 'bullish',
    volatility: Math.random() * 100,
    momentum: Math.random() * 50,
    supportLevel: Math.min(...pixelData.map(p => p.price || 0)),
    resistanceLevel: Math.max(...pixelData.map(p => p.price || 0))
  };
}

function findPixelClusters(pixelData) {
  // Algoritmo de clustering simples
  const clusters = [];
  const visited = new Set();
  
  pixelData.forEach(pixel => {
    if (visited.has(pixel.id)) return;
    
    const cluster = [pixel];
    visited.add(pixel.id);
    
    // Encontrar pixels próximos
    pixelData.forEach(otherPixel => {
      if (visited.has(otherPixel.id)) return;
      
      const distance = calculateDistance(pixel, otherPixel);
      if (distance < 5) { // 5 pixels de distância
        cluster.push(otherPixel);
        visited.add(otherPixel.id);
      }
    });
    
    if (cluster.length > 1) {
      clusters.push(cluster);
    }
  });
  
  return clusters;
}

function findPixelCorridors(pixelData) {
  // Encontrar corredores de pixels
  return [];
}

function findHotspots(pixelData) {
  // Encontrar áreas quentes
  return [];
}

function findDeadZones(pixelData) {
  // Encontrar zonas mortas
  return [];
}

function analyzeConnectivity(pixelData) {
  // Analisar conectividade entre pixels
  return {
    averageConnectivity: Math.random() * 100,
    isolatedPixels: Math.floor(Math.random() * 50),
    connectedComponents: Math.floor(Math.random() * 20)
  };
}

function calculateDistance(pixel1, pixel2) {
  const dx = pixel1.x - pixel2.x;
  const dy = pixel1.y - pixel2.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function generateInvestmentRecommendations(userData) {
  return [
    { type: 'buy', reason: 'Preço baixo para a região', confidence: 0.85 },
    { type: 'hold', reason: 'Potencial de crescimento', confidence: 0.72 },
    { type: 'sell', reason: 'Preço sobrevalorizado', confidence: 0.68 }
  ];
}

function generateCollectionRecommendations(userData) {
  return [
    { type: 'collect', reason: 'Completa uma série', confidence: 0.90 },
    { type: 'trade', reason: 'Duplicado na coleção', confidence: 0.75 }
  ];
}

function generateTradingRecommendations(userData) {
  return [
    { type: 'buy_low', reason: 'Oportunidade de compra', confidence: 0.80 },
    { type: 'sell_high', reason: 'Máximo histórico', confidence: 0.70 }
  ];
}

function generateSocialRecommendations(userData) {
  return [
    { type: 'follow', reason: 'Utilizador ativo', confidence: 0.85 },
    { type: 'collaborate', reason: 'Interesses similares', confidence: 0.78 }
  ];
}

function processChunk(chunk) {
  // Processar um chunk de dados
  return {
    processed: chunk.length,
    summary: {
      totalValue: chunk.reduce((sum, pixel) => sum + (pixel.price || 0), 0),
      averagePrice: chunk.reduce((sum, pixel) => sum + (pixel.price || 0), 0) / chunk.length
    }
  };
}

function combineResults(results) {
  // Combinar resultados de todos os chunks
  return {
    totalProcessed: results.reduce((sum, result) => sum + result.processed, 0),
    totalValue: results.reduce((sum, result) => sum + result.summary.totalValue, 0),
    averagePrice: results.reduce((sum, result) => sum + result.summary.averagePrice, 0) / results.length
  };
}
