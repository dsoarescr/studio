'use client';

import React from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Home, MessageSquare, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  const { toast } = useToast();

  const handleReportError = () => {
    // Enviar relatório de erro
    const errorReport = {
      message: error.message,
      stack: error.stack,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      url: window.location.href
    };

    // Em produção, enviaria para serviço de logging
    console.error('Error Report:', errorReport);
    
    toast({
      title: "Erro Reportado",
      description: "O erro foi reportado à nossa equipa. Obrigado!",
    });
  };

  const handleDownloadErrorLog = () => {
    const errorLog = {
      error: {
        message: error.message,
        stack: error.stack
      },
      context: {
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        localStorage: Object.keys(localStorage)
      }
    };

    const blob = new Blob([JSON.stringify(errorLog, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pixel-universe-error-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-red-500/5 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full shadow-2xl border-red-500/30">
        <CardHeader className="text-center bg-gradient-to-r from-red-500/10 to-orange-500/10 border-b">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
          <CardTitle className="text-2xl font-headline text-red-500">
            Oops! Algo correu mal
          </CardTitle>
          <p className="text-muted-foreground mt-2">
            Encontrámos um erro inesperado. Não se preocupe, os seus dados estão seguros.
          </p>
        </CardHeader>
        
        <CardContent className="p-6 space-y-6">
          {/* Detalhes do Erro (apenas em desenvolvimento) */}
          {process.env.NODE_ENV === 'development' && (
            <Card className="bg-muted/30">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2 text-red-500">Detalhes do Erro:</h3>
                <pre className="text-xs bg-background/50 p-3 rounded overflow-auto max-h-32">
                  {error.message}
                </pre>
              </CardContent>
            </Card>
          )}

          {/* Ações de Recuperação */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              onClick={resetErrorBoundary}
              className="h-12 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
            >
              <RefreshCw className="h-5 w-5 mr-2" />
              Tentar Novamente
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => window.location.href = '/'}
              className="h-12"
            >
              <Home className="h-5 w-5 mr-2" />
              Voltar ao Início
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              onClick={handleReportError}
              className="h-12"
            >
              <MessageSquare className="h-5 w-5 mr-2" />
              Reportar Erro
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleDownloadErrorLog}
              className="h-12"
            >
              <Download className="h-5 w-5 mr-2" />
              Descarregar Log
            </Button>
          </div>

          {/* Informações de Ajuda */}
          <Card className="bg-blue-500/10 border-blue-500/30">
            <CardContent className="p-4">
              <h3 className="font-semibold text-blue-500 mb-2">O que pode fazer:</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Tente recarregar a página</li>
                <li>• Verifique a sua conexão à internet</li>
                <li>• Limpe o cache do browser</li>
                <li>• Contacte o suporte se o problema persistir</li>
              </ul>
            </CardContent>
          </Card>

          {/* Contacto de Suporte */}
          <div className="text-center text-sm text-muted-foreground">
            <p>Precisa de ajuda? Contacte-nos em:</p>
            <a 
              href="mailto:suporte@pixeluniverse.pt" 
              className="text-primary hover:underline font-medium"
            >
              suporte@pixeluniverse.pt
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<ErrorFallbackProps>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

export function ErrorBoundary({ 
  children, 
  fallback: Fallback = ErrorFallback,
  onError 
}: ErrorBoundaryProps) {
  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    // Log do erro
    console.error('Error Boundary caught an error:', error, errorInfo);
    
    // Enviar para serviço de logging em produção
    if (process.env.NODE_ENV === 'production') {
      // analytics.track('error', {
      //   message: error.message,
      //   stack: error.stack,
      //   componentStack: errorInfo.componentStack
      // });
    }
    
    onError?.(error, errorInfo);
  };

  return (
    <ReactErrorBoundary
      FallbackComponent={Fallback}
      onError={handleError}
      onReset={() => {
        // Limpar estado de erro se necessário
        window.location.reload();
      }}
    >
      {children}
    </ReactErrorBoundary>
  );
}

// HOC para componentes críticos
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Partial<ErrorBoundaryProps>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );
  
  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}