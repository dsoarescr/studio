'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Brush,
  Eraser,
  PaintBucket,
  Hand,
  Undo,
  Redo,
  Save,
  Play,
  Pause,
  MessageSquare,
  Send,
  Users,
  UserPlus,
  TextCursor,
  Eye,
  Mic,
  MicOff,
  PhoneOff,
  Settings,
  Share2,
  Video,
  VideoOff,
  Copy,
} from 'lucide-react';
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

interface ChatMessage {
  id: string;
  user: string;
  message: string;
  timestamp: string;
  type: 'text' | 'emoji' | 'system';
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
    isActive: true,
  },
  {
    id: '2',
    name: 'PixelMaster',
    avatar: 'https://placehold.co/40x40.png',
    color: '#4ECDC4',
    cursor: { x: 300, y: 150 },
    tool: 'bucket',
    isActive: true,
  },
];

export default function PixelCollaborativeEditor({
  children,
  pixelData,
}: PixelCollaborativeEditorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [collaborators, setCollaborators] = useState<CollaborativeUser[]>(mockCollaborators);
  const [selectedTool, setSelectedTool] = useState('brush');
  const [selectedColor, setSelectedColor] = useState('#D4A757');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [chatMessages, setChatMessages] = useState<
    Array<{
      id: string;
      user: string;
      message: string;
      timestamp: string;
    }>
  >([]);
  const [newMessage, setNewMessage] = useState('');

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  // Simular movimento de cursores dos colaboradores
  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      setCollaborators(prev =>
        prev.map(collab => ({
          ...collab,
          cursor: {
            x: Math.max(0, Math.min(400, collab.cursor.x + (Math.random() - 0.5) * 20)),
            y: Math.max(0, Math.min(400, collab.cursor.y + (Math.random() - 0.5) * 20)),
          },
        }))
      );
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
    { id: 'hand', icon: Hand, label: 'Mover' },
  ];

  const colors = [
    '#D4A757',
    '#7DF9FF',
    '#FF6B6B',
    '#4ECDC4',
    '#45B7D1',
    '#96CEB4',
    '#FFEAA7',
    '#DDA0DD',
    '#98D8C8',
    '#F7DC6F',
  ];

  const startRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    toast({
      title: 'Gravação Iniciada',
      description: 'A gravar o processo de criação...',
    });
  };

  const stopRecording = () => {
    setIsRecording(false);
    toast({
      title: 'Gravação Concluída',
      description: `Timelapse de ${recordingTime}s criado com sucesso!`,
    });
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now().toString(),
      user: 'Você',
      message: newMessage,
      timestamp: new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }),
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
      isActive: true,
    };

    setCollaborators(prev => [...prev, newCollaborator]);

    toast({
      title: 'Colaborador Convidado',
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
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="h-[90vh] max-w-6xl p-0">
        <DialogHeader className="border-b bg-gradient-to-r from-primary/10 to-accent/10 p-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5 text-primary" />
              Editor Colaborativo
              {pixelData && (
                <Badge variant="outline" className="ml-2">
                  {(pixelData as any).id
                    ? `Pixel #${(pixelData as any).id}`
                    : `Pixel (${pixelData.x}, ${pixelData.y})`}
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
                <UserPlus className="mr-2 h-4 w-4" />
                Convidar
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden">
          {/* Área do Canvas */}
          <div className="flex flex-1 flex-col">
            {/* Toolbar */}
            <div className="border-b bg-muted/20 p-4">
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
                          'h-8 w-8 rounded border-2 transition-transform hover:scale-110',
                          selectedColor === color ? 'scale-110 border-foreground' : 'border-border'
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
                      <div className="h-3 w-3 animate-pulse rounded-full bg-red-500" />
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
                        <Pause className="mr-2 h-4 w-4" />
                        Parar
                      </>
                    ) : (
                      <>
                        <Play className="mr-2 h-4 w-4" />
                        Gravar
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Canvas Principal */}
            <div className="relative flex flex-1 items-center justify-center bg-muted/10">
              <div className="relative">
                <canvas
                  ref={canvasRef}
                  width={400}
                  height={400}
                  className="cursor-crosshair rounded-lg border-2 border-primary/30 bg-white"
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
                      className="pointer-events-none absolute z-10"
                      style={{
                        left: collab.cursor.x,
                        top: collab.cursor.y,
                        transform: 'translate(-50%, -50%)',
                      }}
                    >
                      <div className="relative">
                        <TextCursor className="h-6 w-6" style={{ color: collab.color }} />
                        <div
                          className="absolute -bottom-8 left-0 whitespace-nowrap rounded bg-black/80 px-2 py-1 text-xs text-white"
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
          <div className="flex w-80 flex-col border-l">
            {/* Colaboradores */}
            <div className="border-b p-4">
              <h3 className="mb-3 flex items-center font-semibold">
                <Users className="mr-2 h-4 w-4" />
                Colaboradores ({collaborators.length})
              </h3>

              <div className="space-y-2">
                {collaborators.map(collab => (
                  <div key={collab.id} className="flex items-center gap-3 rounded bg-muted/20 p-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={collab.avatar} />
                      <AvatarFallback>{collab.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{collab.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {collab.tool} • {collab.isActive ? 'Ativo' : 'Inativo'}
                      </p>
                    </div>
                    <div
                      className="h-4 w-4 rounded-full border-2 border-background"
                      style={{ backgroundColor: collab.color }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Chat */}
            <div className="flex flex-1 flex-col">
              <div className="border-b p-3">
                <h3 className="flex items-center font-semibold">
                  <MessageSquare className="mr-2 h-4 w-4" />
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

              <div className="border-t p-3">
                <div className="flex gap-2">
                  <Input
                    placeholder="Escrever mensagem..."
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && sendMessage()}
                    className="text-sm"
                  />
                  <Button size="icon" onClick={sendMessage}>
                    <Send className="h-4 w-4" />
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
