import { useRef, useCallback, useEffect } from 'react';

interface WorkerMessage {
  type: string;
  data: any;
}

interface WorkerResponse {
  type: string;
  data: any;
  error?: string;
}

export const useWebWorker = (workerPath: string) => {
  const workerRef = useRef<Worker | null>(null);
  const messageHandlersRef = useRef<Map<string, (data: any) => void>>(new Map());

  // Initialize worker
  useEffect(() => {
    if (typeof window !== 'undefined') {
      workerRef.current = new Worker(workerPath);

      workerRef.current.onmessage = (event: MessageEvent<WorkerResponse>) => {
        const { type, data, error } = event.data;

        if (error) {
          console.error('Web Worker error:', error);
          return;
        }

        const handler = messageHandlersRef.current.get(type);
        if (handler) {
          handler(data);
        }
      };

      workerRef.current.onerror = error => {
        console.error('Web Worker error:', error);
      };
    }

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, [workerPath]);

  // Send message to worker
  const sendMessage = useCallback((message: WorkerMessage) => {
    if (workerRef.current) {
      workerRef.current.postMessage(message);
    }
  }, []);

  // Register message handler
  const onMessage = useCallback((type: string, handler: (data: any) => void) => {
    messageHandlersRef.current.set(type, handler);
  }, []);

  // Remove message handler
  const removeMessageHandler = useCallback((type: string) => {
    messageHandlersRef.current.delete(type);
  }, []);

  // Calculate pixel statistics
  const calculatePixelStats = useCallback(
    (pixelData: any[]) => {
      sendMessage({
        type: 'CALCULATE_PIXEL_STATS',
        data: pixelData,
      });
    },
    [sendMessage]
  );

  // Analyze pixel patterns
  const analyzePixelPatterns = useCallback(
    (pixelData: any[]) => {
      sendMessage({
        type: 'ANALYZE_PIXEL_PATTERNS',
        data: pixelData,
      });
    },
    [sendMessage]
  );

  // Generate recommendations
  const generateRecommendations = useCallback(
    (userData: any) => {
      sendMessage({
        type: 'GENERATE_RECOMMENDATIONS',
        data: userData,
      });
    },
    [sendMessage]
  );

  // Process large dataset
  const processLargeDataset = useCallback(
    (dataset: any[]) => {
      sendMessage({
        type: 'PROCESS_LARGE_DATASET',
        data: dataset,
      });
    },
    [sendMessage]
  );

  return {
    sendMessage,
    onMessage,
    removeMessageHandler,
    calculatePixelStats,
    analyzePixelPatterns,
    generateRecommendations,
    processLargeDataset,
    isSupported: typeof window !== 'undefined' && 'Worker' in window,
  };
};
