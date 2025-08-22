'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
// Lucide imports removed
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

interface PixelARProps {
  children: React.ReactNode;
}

export default function PixelAR({ children }: PixelARProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isARActive, setIsARActive] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [nearbyPixels, setNearbyPixels] = useState<Array<{
    id: string;
    x: number;
    y: number;
    distance: number;
    price: number;
    owner?: string;
  }>>([]);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setHasPermission(true);
        setIsARActive(true);
        
        // Simular busca por pixels próximos
        setTimeout(() => {
          setNearbyPixels([
            { id: '1', x: 245, y: 156, distance: 50, price: 150, owner: 'Sistema' },
            { id: '2', x: 250, y: 160, distance: 75, price: 200 },
            { id: '3', x: 240, y: 150, distance: 100, price: 120, owner: 'PixelMaster' }
          ]);
        }, 2000);
      }
    } catch (error) {
      toast({
        title: "Erro de Câmara",
        description: "Não foi possível aceder à câmara. Verifique as permissões.",
        variant: "destructive"
      });
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        (error) => {
          toast({
            title: "Erro de Localização",
            description: "Não foi possível obter a sua localização.",
            variant: "destructive"
          });
        }
      );
    }
  };

  const stopAR = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    setIsARActive(false);
    setHasPermission(false);
    setNearbyPixels([]);
  };

  const captureARPhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0);
        
        // Adicionar overlay de pixels
        nearbyPixels.forEach(pixel => {
          const x = Math.random() * canvas.width;
          const y = Math.random() * canvas.height;
          
          ctx.fillStyle = 'rgba(212, 167, 87, 0.8)';
          ctx.fillRect(x - 10, y - 10, 20, 20);
          ctx.strokeStyle = '#7DF9FF';
          ctx.lineWidth = 2;
          ctx.strokeRect(x - 10, y - 10, 20, 20);
          
          ctx.fillStyle = 'white';
          ctx.font = '12px Arial';
          ctx.fillText(`€${pixel.price}`, x - 15, y - 15);
        });
        
        // Download da imagem
        const link = document.createElement('a');
        link.download = 'pixel-ar-capture.png';
        link.href = canvas.toDataURL();
        link.click();
        
        toast({
          title: "Foto Capturada!",
          description: "A sua foto AR foi guardada com sucesso.",
        });
      }
    }
  };

  useEffect(() => {
    if (isOpen) {
      getCurrentLocation();
    }
    
    return () => {
      if (isARActive) {
        stopAR();
      }
    };
  }, [isOpen, getCurrentLocation, isARActive, stopAR]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      
      <DialogContent className="max-w-md h-[90vh] p-0 bg-black">
        <DialogHeader className="p-4 bg-gradient-to-r from-primary/20 to-accent/20 text-white">
          <DialogTitle className="flex items-center">
            <Camera className="h-5 w-5 mr-2" />
            Realidade Aumentada
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 relative overflow-hidden">
          {!isARActive ? (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="mb-6"
              >
                <div className="w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                  <Scan className="h-12 w-12 text-white" />
                </div>
              </motion.div>
              
              <h3 className="text-xl font-bold text-white mb-4">
                Descubra Pixels no Mundo Real
              </h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Use a câmara para encontrar pixels próximos da sua localização e comprá-los diretamente através de AR.
              </p>
              
              <div className="space-y-3 w-full">
                <Button 
                  onClick={requestCameraPermission}
                  className="w-full bg-gradient-to-r from-primary to-accent"
                  size="lg"
                >
                  <Camera className="h-5 w-5 mr-2" />
                  Ativar Câmara AR
                </Button>
                
                <div className="flex items-center justify-center text-xs text-gray-400">
                  <MapPin className="h-3 w-3 mr-1" />
                  {location ? 
                    `Localização: ${location.lat.toFixed(4)}, ${location.lon.toFixed(4)}` :
                    'A obter localização...'
                  }
                </div>
              </div>
            </div>
          ) : (
            <div className="relative h-full">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              
              {/* AR Overlay */}
              <div className="absolute inset-0 pointer-events-none">
                {/* Crosshair central */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <Crosshair className="h-8 w-8 text-primary animate-pulse" />
                </div>
                
                {/* Pixels próximos */}
                {nearbyPixels.map((pixel, index) => (
                  <motion.div
                    key={pixel.id}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.3 }}
                    className="absolute pointer-events-auto"
                    style={{
                      left: `${20 + index * 25}%`,
                      top: `${30 + index * 15}%`
                    }}
                  >
                    <div className="bg-black/80 backdrop-blur-sm rounded-lg p-2 border border-primary/50">
                      <div className="text-center">
                        <div className="w-6 h-6 bg-primary rounded mx-auto mb-1" />
                        <p className="text-white text-xs font-bold">€{pixel.price}</p>
                        <p className="text-gray-300 text-xs">{pixel.distance}m</p>
                        {pixel.owner && (
                          <Badge variant="outline" className="text-xs mt-1">
                            {pixel.owner}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {/* Informações no topo */}
                <div className="absolute top-4 left-4 right-4">
                  <Card className="bg-black/60 backdrop-blur-sm border-primary/30">
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between text-white">
                        <div>
                          <p className="text-sm font-medium">Pixels Encontrados</p>
                          <p className="text-xs text-gray-300">{nearbyPixels.length} próximos</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">Raio de Busca</p>
                          <p className="text-xs text-gray-300">100m</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              {/* Controles */}
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={stopAR}
                  className="bg-black/60 border-white/30 text-white"
                >
                  <X className="h-4 w-4" />
                </Button>
                
                <Button
                  onClick={captureARPhoto}
                  className="bg-white text-black hover:bg-gray-200"
                  size="lg"
                >
                  <Camera className="h-5 w-5 mr-2" />
                  Capturar
                </Button>
                
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-black/60 border-white/30 text-white"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
        
        <canvas ref={canvasRef} className="hidden" />
      </DialogContent>
    </Dialog>
  );
}
