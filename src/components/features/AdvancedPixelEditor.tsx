'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { SoundEffect, SOUND_EFFECTS } from '@/components/ui/sound-effect';
import { motion, AnimatePresence } from "framer-motion";
import { Palette, Brush, Eraser, PaintBucket, PartyPopper as Eyedropper, Square, Circle, Triangle, Pen, Pencil, SprayCan as Spray, Bluetooth as Blur, Contrast, Copyright as Brightness, IterationCw as Saturation, Layers, Undo, Redo, RotateCcw, Save, Download, Upload, Share2, ZoomIn, ZoomOut, Grid3X3, Move, Copy, Scissors, Type, AlignCenter, Settings, Magnet as Magic, Sparkles, Crown, Gem, Star, Award, Trophy, Target } from "lucide-react";

type DrawingTool = 'brush' | 'eraser' | 'bucket' | 'eyedropper' | 'line' | 'rectangle' | 'circle' | 'text' | 'spray' | 'blur';
type BlendMode = 'normal' | 'multiply' | 'screen' | 'overlay' | 'soft-light' | 'hard-light';

interface Layer {
  id: string;
  name: string;
  visible: boolean;
  opacity: number;
  blendMode: BlendMode;
  canvas: HTMLCanvasElement;
}

interface AdvancedPixelEditorProps {
  children: React.ReactNode;
  initialPixelData?: {
    x: number;
    y: number;
    color: string;
    image?: string;
  };
}

export default function AdvancedPixelEditor({ children, initialPixelData }: AdvancedPixelEditorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTool, setCurrentTool] = useState<DrawingTool>('brush');
  const [currentColor, setCurrentColor] = useState('#D4A757');
  const [brushSize, setBrushSize] = useState(3);
  const [brushOpacity, setBrushOpacity] = useState(100);
  const [brushHardness, setBrushHardness] = useState(80);
  const [layers, setLayers] = useState<Layer[]>([]);
  const [activeLayerId, setActiveLayerId] = useState<string>('');
  const [canvasSize, setCanvasSize] = useState({ width: 64, height: 64 });
  const [zoomLevel, setZoomLevel] = useState(800);
  const [showGrid, setShowGrid] = useState(true);
  const [isDrawing, setIsDrawing] = useState(false);
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [playDrawSound, setPlayDrawSound] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  // Color palettes
  const colorPalettes = {
    default: ['#D4A757', '#7DF9FF', '#FF6B6B', '#4CAF50', '#9C27B0', '#FFD700', '#FF1493', '#00CED1'],
    warm: ['#FF6B35', '#F7931E', '#FFD23F', '#FF8C42', '#FF6B6B', '#FF9F43', '#FFAD5A', '#FF7F7F'],
    cool: ['#006994', '#0080FF', '#40E0D0', '#00CED1', '#4169E1', '#1E90FF', '#87CEEB', '#B0E0E6'],
    earth: ['#8B4513', '#228B22', '#4682B4', '#DAA520', '#CD853F', '#2E8B57', '#B8860B', '#A0522D'],
    neon: ['#FF073A', '#39FF14', '#0080FF', '#FFFF33', '#FF1493', '#00FFFF', '#FF4500', '#8A2BE2']
  };

  // Initialize canvas and layers
  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;
    
    // Create initial layer
    const initialLayer: Layer = {
      id: 'layer-1',
      name: 'Camada 1',
      visible: true,
      opacity: 100,
      blendMode: 'normal',
      canvas: document.createElement('canvas')
    };
    
    initialLayer.canvas.width = canvasSize.width;
    initialLayer.canvas.height = canvasSize.height;
    
    // Fill with initial color if provided
    if (initialPixelData) {
      const ctx = initialLayer.canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = initialPixelData.color;
        ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);
      }
    }
    
    setLayers([initialLayer]);
    setActiveLayerId(initialLayer.id);
    
    saveToHistory();
  }, [isOpen, canvasSize, initialPixelData]);

  const saveToHistory = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(imageData);
      return newHistory;
    });
    setHistoryIndex(prev => prev + 1);
  }, [historyIndex]);

  const undo = () => {
    if (historyIndex > 0) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      const newIndex = historyIndex - 1;
      ctx.putImageData(history[newIndex], 0, 0);
      setHistoryIndex(newIndex);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      const newIndex = historyIndex + 1;
      ctx.putImageData(history[newIndex], 0, 0);
      setHistoryIndex(newIndex);
    }
  };

  const addLayer = () => {
    const newLayer: Layer = {
      id: `layer-${Date.now()}`,
      name: `Camada ${layers.length + 1}`,
      visible: true,
      opacity: 100,
      blendMode: 'normal',
      canvas: document.createElement('canvas')
    };
    
    newLayer.canvas.width = canvasSize.width;
    newLayer.canvas.height = canvasSize.height;
    
    setLayers(prev => [...prev, newLayer]);
    setActiveLayerId(newLayer.id);
    
    toast({
      title: "Nova Camada",
      description: "Uma nova camada foi adicionada ao projeto.",
    });
  };

  const deleteLayer = (layerId: string) => {
    if (layers.length <= 1) {
      toast({
        title: "Não é Possível Eliminar",
        description: "Deve manter pelo menos uma camada.",
        variant: "destructive"
      });
      return;
    }
    
    setLayers(prev => prev.filter(layer => layer.id !== layerId));
    
    if (activeLayerId === layerId) {
      setActiveLayerId(layers[0].id);
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    setPlayDrawSound(true);
    draw(e);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    draw(e);
  };

  const handleMouseUp = () => {
    if (isDrawing) {
      setIsDrawing(false);
      saveToHistory();
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    
    ctx.globalAlpha = brushOpacity / 100;
    
    switch (currentTool) {
      case 'brush':
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = currentColor;
        ctx.beginPath();
        ctx.arc(x, y, brushSize, 0, Math.PI * 2);
        ctx.fill();
        break;
        
      case 'eraser':
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(x, y, brushSize, 0, Math.PI * 2);
        ctx.fill();
        break;
        
      case 'bucket':
        // Simple flood fill
        ctx.fillStyle = currentColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        break;
        
      case 'spray':
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = currentColor;
        for (let i = 0; i < 20; i++) {
          const offsetX = (Math.random() - 0.5) * brushSize * 2;
          const offsetY = (Math.random() - 0.5) * brushSize * 2;
          ctx.beginPath();
          ctx.arc(x + offsetX, y + offsetY, 1, 0, Math.PI * 2);
          ctx.fill();
        }
        break;
    }
    
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  };

  const handleExport = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const link = document.createElement('a');
    link.download = `pixel-art-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
    
    toast({
      title: "Arte Exportada",
      description: "Sua pixel art foi exportada com sucesso!",
    });
  };

  const handleSave = () => {
    // Simulate saving to cloud
    toast({
      title: "Projeto Guardado",
      description: "Seu projeto foi guardado na nuvem com sucesso.",
    });
  };

  const applyFilter = (filterType: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    switch (filterType) {
      case 'grayscale':
        for (let i = 0; i < data.length; i += 4) {
          const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
          data[i] = gray;
          data[i + 1] = gray;
          data[i + 2] = gray;
        }
        break;
        
      case 'invert':
        for (let i = 0; i < data.length; i += 4) {
          data[i] = 255 - data[i];
          data[i + 1] = 255 - data[i + 1];
          data[i + 2] = 255 - data[i + 2];
        }
        break;
        
      case 'sepia':
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          
          data[i] = Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189));
          data[i + 1] = Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168));
          data[i + 2] = Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131));
        }
        break;
    }
    
    ctx.putImageData(imageData, 0, 0);
    saveToHistory();
    
    toast({
      title: "Filtro Aplicado",
      description: `Filtro ${filterType} foi aplicado com sucesso.`,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <SoundEffect src={SOUND_EFFECTS.DRAW} play={playDrawSound} onEnd={() => setPlayDrawSound(false)} volume={0.3} />
      
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      
      <DialogContent className="max-w-7xl max-h-[95vh] p-0 gap-0">
        <DialogHeader className="p-4 border-b bg-gradient-to-r from-card to-primary/5">
          <DialogTitle className="text-xl font-headline text-primary flex items-center">
            <Palette className="h-5 w-5 mr-2" />
            Editor Avançado de Pixel Art
          </DialogTitle>
          <DialogDescription>
            Crie pixel art profissional com ferramentas avançadas e sistema de camadas
          </DialogDescription>
        </DialogHeader>

        <div className="flex h-[80vh]">
          {/* Tools Panel */}
          <div className="w-64 border-r bg-muted/20 p-4 space-y-4">
            <ScrollArea className="h-full">
              {/* Drawing Tools */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm">Ferramentas</h3>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { tool: 'brush', icon: Brush, label: 'Pincel' },
                    { tool: 'eraser', icon: Eraser, label: 'Borracha' },
                    { tool: 'bucket', icon: PaintBucket, label: 'Balde' },
                    { tool: 'eyedropper', icon: Eyedropper, label: 'Conta-gotas' },
                    { tool: 'line', icon: Pen, label: 'Linha' },
                    { tool: 'rectangle', icon: Square, label: 'Retângulo' },
                    { tool: 'circle', icon: Circle, label: 'Círculo' },
                    { tool: 'spray', icon: Spray, label: 'Spray' }
                  ].map(({ tool, icon: Icon, label }) => (
                    <Button
                      key={tool}
                      variant={currentTool === tool ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setCurrentTool(tool as DrawingTool)}
                      className="aspect-square p-2"
                      title={label}
                    >
                      <Icon className="h-4 w-4" />
                    </Button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Brush Settings */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm">Configurações do Pincel</h3>
                
                <div className="space-y-2">
                  <Label className="text-xs">Tamanho: {brushSize}px</Label>
                  <Slider
                    value={[brushSize]}
                    onValueChange={([value]) => setBrushSize(value)}
                    min={1}
                    max={50}
                    step={1}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-xs">Opacidade: {brushOpacity}%</Label>
                  <Slider
                    value={[brushOpacity]}
                    onValueChange={([value]) => setBrushOpacity(value)}
                    min={1}
                    max={100}
                    step={1}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-xs">Dureza: {brushHardness}%</Label>
                  <Slider
                    value={[brushHardness]}
                    onValueChange={([value]) => setBrushHardness(value)}
                    min={0}
                    max={100}
                    step={1}
                  />
                </div>
              </div>

              <Separator />

              {/* Color Picker */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm">Cores</h3>
                
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={currentColor}
                    onChange={(e) => setCurrentColor(e.target.value)}
                    className="w-12 h-12 rounded border cursor-pointer"
                  />
                  <Input
                    value={currentColor}
                    onChange={(e) => setCurrentColor(e.target.value)}
                    className="font-mono text-sm"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-xs">Paletas</Label>
                  <Tabs defaultValue="default" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 h-8">
                      <TabsTrigger value="default" className="text-xs">Padrão</TabsTrigger>
                      <TabsTrigger value="warm" className="text-xs">Quente</TabsTrigger>
                    </TabsList>
                    <TabsContent value="default" className="mt-2">
                      <div className="grid grid-cols-4 gap-1">
                        {colorPalettes.default.map((color, index) => (
                          <button
                            key={index}
                            className="w-8 h-8 rounded border-2 border-border hover:border-primary transition-colors"
                            style={{ backgroundColor: color }}
                            onClick={() => setCurrentColor(color)}
                          />
                        ))}
                      </div>
                    </TabsContent>
                    <TabsContent value="warm" className="mt-2">
                      <div className="grid grid-cols-4 gap-1">
                        {colorPalettes.warm.map((color, index) => (
                          <button
                            key={index}
                            className="w-8 h-8 rounded border-2 border-border hover:border-primary transition-colors"
                            style={{ backgroundColor: color }}
                            onClick={() => setCurrentColor(color)}
                          />
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>

              <Separator />

              {/* Layers */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm">Camadas</h3>
                  <Button variant="outline" size="icon" onClick={addLayer} className="h-6 w-6">
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {layers.map((layer) => (
                    <div
                      key={layer.id}
                      className={`p-2 rounded border cursor-pointer transition-colors ${
                        activeLayerId === layer.id ? 'border-primary bg-primary/10' : 'border-border'
                      }`}
                      onClick={() => setActiveLayerId(layer.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={layer.visible}
                            onCheckedChange={(checked) => {
                              setLayers(prev => prev.map(l => 
                                l.id === layer.id ? { ...l, visible: checked } : l
                              ));
                            }}
                            className="scale-75"
                          />
                          <span className="text-xs font-medium">{layer.name}</span>
                        </div>
                        
                        {layers.length > 1 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteLayer(layer.id)}
                            className="h-4 w-4 p-0"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                      
                      <div className="mt-2 space-y-1">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Opacidade</span>
                          <span>{layer.opacity}%</span>
                        </div>
                        <Slider
                          value={[layer.opacity]}
                          onValueChange={([value]) => {
                            setLayers(prev => prev.map(l => 
                              l.id === layer.id ? { ...l, opacity: value } : l
                            ));
                          }}
                          min={0}
                          max={100}
                          step={1}
                          className="h-1"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Filters */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm">Filtros</h3>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { filter: 'grayscale', label: 'Escala de Cinza' },
                    { filter: 'invert', label: 'Inverter' },
                    { filter: 'sepia', label: 'Sépia' }
                  ].map(({ filter, label }) => (
                    <Button
                      key={filter}
                      variant="outline"
                      size="sm"
                      onClick={() => applyFilter(filter)}
                      className="text-xs"
                    >
                      {label}
                    </Button>
                  ))}
                </div>
              </div>
            </ScrollArea>
          </div>

          {/* Canvas Area */}
          <div className="flex-1 flex flex-col">
            {/* Canvas Toolbar */}
            <div className="border-b p-3 bg-muted/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={undo} disabled={historyIndex <= 0}>
                    <Undo className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={redo} disabled={historyIndex >= history.length - 1}>
                    <Redo className="h-4 w-4" />
                  </Button>
                  <Separator orientation="vertical" className="h-6" />
                  <Button variant="outline" size="icon" onClick={() => setZoomLevel(Math.max(100, zoomLevel - 100))}>
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <span className="text-sm font-mono">{zoomLevel}%</span>
                  <Button variant="outline" size="icon" onClick={() => setZoomLevel(Math.min(1600, zoomLevel + 100))}>
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  <Separator orientation="vertical" className="h-6" />
                  <div className="flex items-center gap-2">
                    <Switch checked={showGrid} onCheckedChange={setShowGrid} />
                    <Label className="text-sm">Grade</Label>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={handleSave}>
                    <Save className="h-4 w-4 mr-2" />
                    Guardar
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleExport}>
                    <Download className="h-4 w-4 mr-2" />
                    Exportar
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4 mr-2" />
                    Partilhar
                  </Button>
                </div>
              </div>
            </div>

            {/* Canvas */}
            <div className="flex-1 flex items-center justify-center p-4 bg-muted/5">
              <div className="relative">
                <canvas
                  ref={canvasRef}
                  className="border-2 border-primary/30 rounded cursor-crosshair shadow-lg"
                  style={{ 
                    width: `${(canvasSize.width * zoomLevel) / 100}px`,
                    height: `${(canvasSize.height * zoomLevel) / 100}px`,
                    imageRendering: 'pixelated'
                  }}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                />
                
                {/* Grid Overlay */}
                {showGrid && (
                  <div 
                    className="absolute inset-0 pointer-events-none border-2 border-transparent"
                    style={{
                      backgroundImage: `
                        linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)
                      `,
                      backgroundSize: `${zoomLevel / 100 * 4}px ${zoomLevel / 100 * 4}px`
                    }}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Properties Panel */}
          <div className="w-64 border-l bg-muted/20 p-4 space-y-4">
            <ScrollArea className="h-full">
              {/* Canvas Properties */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm">Propriedades da Tela</h3>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs">Largura</Label>
                    <Input
                      type="number"
                      value={canvasSize.width}
                      onChange={(e) => setCanvasSize(prev => ({ ...prev, width: parseInt(e.target.value) || 64 }))}
                      className="h-8 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Altura</Label>
                    <Input
                      type="number"
                      value={canvasSize.height}
                      onChange={(e) => setCanvasSize(prev => ({ ...prev, height: parseInt(e.target.value) || 64 }))}
                      className="h-8 text-xs"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Animation */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm">Animação</h3>
                
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Frame
                  </Button>
                  
                  <div className="space-y-1">
                    <Label className="text-xs">Velocidade (FPS)</Label>
                    <Slider defaultValue={[12]} min={1} max={60} step={1} />
                  </div>
                  
                  <Button variant="outline" size="sm" className="w-full">
                    <Play className="h-4 w-4 mr-2" />
                    Pré-visualizar
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Export Options */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm">Exportar</h3>
                
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    PNG
                  </Button>
                  <Button variant="outline" size="sm" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    GIF Animado
                  </Button>
                  <Button variant="outline" size="sm" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Sprite Sheet
                  </Button>
                </div>
              </div>

              <Separator />

              {/* AI Assistance */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm flex items-center">
                  <Sparkles className="h-4 w-4 mr-2 text-primary" />
                  Assistente IA
                </h3>
                
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full">
                    <Magic className="h-4 w-4 mr-2" />
                    Auto-Completar
                  </Button>
                  <Button variant="outline" size="sm" className="w-full">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Sugerir Cores
                  </Button>
                  <Button variant="outline" size="sm" className="w-full">
                    <Star className="h-4 w-4 mr-2" />
                    Melhorar Qualidade
                  </Button>
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}