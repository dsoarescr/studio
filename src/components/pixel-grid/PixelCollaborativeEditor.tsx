'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
// Lucide imports removed
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CollaborativeUser {
  id: string;
  name: string;
  avatar: string;
  color: string;
  cursor: { x: number; y: number };
  tool: string;
  isActive: boolean;
}

interface PixelCollaborativeEditorProps {
  children: React.ReactNode;
  pixelData?: {
    x: number;
    y: number;
    owner: string;
  };
}

const mockCollaborators: CollaborativeUser[] = [
  {
    id: '1',
    name: 'ArtistaPro',
    avatar: 'https://placehold.co/40x40.png',
    color: '#FF6B6B',
    cursor: { x: 150, y: 200 },
    tool: 'brush',
    isActive: true
  },
  {
    id: '2',
    name: 'PixelMaster',
    avatar: 'https://placehold.co/40x40.png',
    color: '#4ECDC4',
    cursor: { x: 300, y: 150 },
    tool: 'bucket',
    isActive: true
  }
];

export default function PixelCollaborativeEditor({ children, pixelData }: PixelCollaborativeEditorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [collaborators, setCollaborators] = useState<CollaborativeUser[]>(mockCollaborators);
  const [selectedTool, setSelectedTool] = useState('brush');
  const [selectedColor, setSelectedColor] = useState('#D4A757');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [chatMessages, setChatMessages] = useState<Array<{
    id: string;
    user: string;
    message: string;
    timestamp: string;
  }>>([]);
  const [newMessage, setNewMessage] = useState('');
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  // Simular movimento de cursores dos colaboradores
  useEffect(() => {
    if (!isOpen) return;
    
    const interval = setInterval(() => {
      setCollaborators(prev => prev.map(collab => ({
        ...collab,
        cursor: {
          x: Math.max(0, Math.min(400, collab.cursor.x + (Math.random() - 0.5) * 20)),
          y: Math.max(0, Math.min(400, collab.cursor.y + (Math.random() - 0.5) * 20))
        }
      })));
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen]);

  // Timer de gravação
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const tools = [
    { id: 'brush', icon: Brush, label: 'Pincel' },
    { id: 'eraser', icon: Eraser, label: 'Borracha' },
    { id: 'bucket', icon: PaintBucket, label: 'Balde' },
    { id: 'hand', icon: Hand, label: 'Mover' }
  ];

  const colors = [
    '#D4A757', '#7DF9FF', '#FF6B6B', '#4ECDC4', '#45B7D1', 
    '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'
  ];

  const startRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    toast({
      title: "Gravação Iniciada",
      description: "A gravar o processo de criação...",
    });
  };

  const stopRecording = () => {
    setIsRecording(false);
    toast({
      title: "Gravação Concluída",
      description: `Timelapse de ${recordingTime}s criado com sucesso!`,
    });
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    
    const message = {
      id: Date.now().toString(),
      user: 'Você',
      message: newMessage,
      timestamp: new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })
    };
    
    setChatMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const inviteCollaborator = () => {
    const newCollaborator: CollaborativeUser = {
      id: Date.now().toString(),
      name: `Artista${Math.floor(Math.random() * 1000)}`,
      avatar: 'https://placehold.co/40x40.png',
      color: colors[Math.floor(Math.random() * colors.length)],
      cursor: { x: 200, y: 200 },
      tool: 'brush',
      isActive: true
    };
    
    setCollaborators(prev => [...prev, newCollaborator]);
    
    toast({
      title: "Colaborador Convidado",
      description: `${newCollaborator.name} juntou-se à sessão!`,
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      
      <DialogContent className="max-w-6xl h-[90vh] p-0">
        <DialogHeader className="p-4 border-b bg-gradient-to-r from-primary/10 to-accent/10">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2 text-primary" />
              Editor Colaborativo
              {pixelData && (
                <Badge variant="outline" className="ml-2">
                  Pixel ({pixelData.x}, {pixelData.y})
                </Badge>
              )}
            </DialogTitle>
            
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {collaborators.map(collab => (
                  <Avatar key={collab.id} className="h-8 w-8 border-2 border-background">
                    <AvatarImage src={collab.avatar} />
                    <AvatarFallback>{collab.name[0]}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
              
              <Button variant="outline" size="sm" onClick={inviteCollaborator}>
                <Users className="h-4 w-4 mr-2" />
                Convidar
              </Button>
            </div>
          </div>
        </DialogHeader>
        
        <div className="flex-1 flex overflow-hidden">
          {/* Área do Canvas */}
          <div className="flex-1 flex flex-col">
            {/* Toolbar */}
            <div className="p-4 border-b bg-muted/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Ferramentas */}
                  <div className="flex gap-2">
                    {tools.map(tool => (
                      <Button
                        key={tool.id}
                        variant={selectedTool === tool.id ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedTool(tool.id)}
                      >
                        <tool.icon className="h-4 w-4" />
                      </Button>
                    ))}
                  </div>
                  
                  {/* Cores */}
                  <div className="flex gap-1">
                    {colors.slice(0, 6).map(color => (
                      <button
                        key={color}
                        className={cn(
                          "w-8 h-8 rounded border-2 transition-transform hover:scale-110",
                          selectedColor === color ? "border-foreground scale-110" : "border-border"
                        )}
                        style={{ backgroundColor: color }}
                        onClick={() => setSelectedColor(color)}
                      />
                    ))}
                  </div>
                  
                  {/* Ações */}
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Undo className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Redo className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Save className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Gravação */}
                <div className="flex items-center gap-2">
                  {isRecording && (
                    <div className="flex items-center gap-2 text-red-500">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                      <span className="font-mono text-sm">{formatTime(recordingTime)}</span>
                    </div>
                  )}
                  
                  <Button
                    variant={isRecording ? 'destructive' : 'default'}
                    size="sm"
                    onClick={isRecording ? stopRecording : startRecording}
                  >
                    {isRecording ? (
                      <>
                        <Pause className="h-4 w-4 mr-2" />
                        Parar
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Gravar
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Canvas Principal */}
            <div className="flex-1 relative bg-muted/10 flex items-center justify-center">
              <div className="relative">
                <canvas
                  ref={canvasRef}
                  width={400}
                  height={400}
                  className="border-2 border-primary/30 rounded-lg bg-white cursor-crosshair"
                  style={{ imageRendering: 'pixelated' }}
                />
                
                {/* Cursores dos Colaboradores */}
                <AnimatePresence>
                  {collaborators.map(collab => (
                    <motion.div
                      key={collab.id}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      className="absolute pointer-events-none z-10"
                      style={{
                        left: collab.cursor.x,
                        top: collab.cursor.y,
                        transform: 'translate(-50%, -50%)'
                      }}
                    >
                      <div className="relative">
                        <TextCursor 
                          className="h-6 w-6" 
                          style={{ color: collab.color }}
                        />
                        <div 
                          className="absolute -bottom-8 left-0 bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap"
                          style={{ borderColor: collab.color }}
                        >
                          {collab.name}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>
          
          {/* Painel Lateral */}
          <div className="w-80 border-l flex flex-col">
            {/* Colaboradores */}
            <div className="p-4 border-b">
              <h3 className="font-semibold mb-3 flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Colaboradores ({collaborators.length})
              </h3>
              
              <div className="space-y-2">
                {collaborators.map(collab => (
                  <div key={collab.id} className="flex items-center gap-3 p-2 bg-muted/20 rounded">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={collab.avatar} />
                      <AvatarFallback>{collab.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{collab.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {collab.tool} • {collab.isActive ? 'Ativo' : 'Inativo'}
                      </p>
                    </div>
                    <div 
                      className="w-4 h-4 rounded-full border-2 border-background"
                      style={{ backgroundColor: collab.color }}
                    />
                  </div>
                ))}
              </div>
            </div>
            
            {/* Chat */}
            <div className="flex-1 flex flex-col">
              <div className="p-3 border-b">
                <h3 className="font-semibold flex items-center">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Chat
                </h3>
              </div>
              
              <ScrollArea className="flex-1 p-3">
                <div className="space-y-2">
                  {chatMessages.map(msg => (
                    <div key={msg.id} className="text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-primary">{msg.user}</span>
                        <span className="text-xs text-muted-foreground">{msg.timestamp}</span>
                      </div>
                      <p className="text-foreground">{msg.message}</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              
              <div className="p-3 border-t">
                <div className="flex gap-2">
                  <Input
                    placeholder="Escrever mensagem..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    className="text-sm"
                  />
                  <Button size="icon" onClick={sendMessage}>
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
