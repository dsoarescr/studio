// src/components/features/LiveCollaboration.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Users, Video, Mic, MicOff, VideoOff, Share2, MessageSquare,
  Hand, Palette, Brush, Eraser, Crown, Star, Zap, Eye,
  Settings, Volume2, VolumeX, Phone, PhoneOff, UserPlus,
  Copy, Link, Send, Smile, Heart, ThumbsUp, Gift, Camera
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

interface Collaborator {
  id: string;
  name: string;
  avatar: string;
  role: 'owner' | 'editor' | 'viewer';
  isOnline: boolean;
  cursor?: { x: number; y: number };
  currentTool?: string;
  color: string;
}

interface ChatMessage {
  id: string;
  user: string;
  message: string;
  timestamp: string;
  type: 'text' | 'emoji' | 'system';
}

interface LiveCollaborationProps {
  children: React.ReactNode;
  pixelId?: string;
}

export default function LiveCollaboration({ children, pixelId }: LiveCollaborationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [collaborators, setCollaborators] = useState<Collaborator[]>([
    {
      id: '1',
      name: 'Você',
      avatar: 'https://placehold.co/40x40.png',
      role: 'owner',
      isOnline: true,
      color: '#FF6B6B'
    },
    {
      id: '2',
      name: 'ArtistaPro',
      avatar: 'https://placehold.co/40x40.png',
      role: 'editor',
      isOnline: true,
      cursor: { x: 150, y: 200 },
      currentTool: 'brush',
      color: '#4ECDC4'
    },
    {
      id: '3',
      name: 'PixelMaster',
      avatar: 'https://placehold.co/40x40.png',
      role: 'viewer',
      isOnline: true,
      color: '#45B7D1'
    }
  ]);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      user: 'ArtistaPro',
      message: 'Que tal adicionarmos mais azul nesta área?',
      timestamp: '14:23',
      type: 'text'
    },
    {
      id: '2',
      user: 'Sistema',
      message: 'PixelMaster juntou-se à sessão',
      timestamp: '14:25',
      type: 'system'
    }
  ]);

  const [newMessage, setNewMessage] = useState('');
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [sessionCode, setSessionCode] = useState('PXL-2024-ABC');

  const { toast } = useToast();

  // Simulate real-time cursor movement
  useEffect(() => {
    if (!isOpen) return;
    
    const interval = setInterval(() => {
      setCollaborators(prev => prev.map(collab => {
        if (collab.cursor) {
          return {
            ...collab,
            cursor: {
              x: Math.max(0, Math.min(400, collab.cursor.x + (Math.random() - 0.5) * 20)),
              y: Math.max(0, Math.min(400, collab.cursor.y + (Math.random() - 0.5) * 20))
            }
          };
        }
        return collab;
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    
    const message: ChatMessage = {
      id: Date.now().toString(),
      user: 'Você',
      message: newMessage,
      timestamp: new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }),
      type: 'text'
    };
    
    setChatMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const inviteCollaborator = () => {
    navigator.clipboard.writeText(`${window.location.origin}/collaborate/${sessionCode}`);
    toast({
      title: "Link Copiado!",
      description: "Partilhe este link para convidar colaboradores.",
    });
  };

  const toggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled);
    toast({
      title: isVideoEnabled ? "Vídeo Desligado" : "Vídeo Ligado",
      description: isVideoEnabled ? "Sua câmara foi desligada." : "Sua câmara foi ligada.",
    });
  };

  const toggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled);
    toast({
      title: isAudioEnabled ? "Microfone Desligado" : "Microfone Ligado",
      description: isAudioEnabled ? "Seu microfone foi desligado." : "Seu microfone foi ligado.",
    });
  };

  const startScreenShare = () => {
    setIsScreenSharing(!isScreenSharing);
    toast({
      title: isScreenSharing ? "Partilha Parada" : "Partilha Iniciada",
      description: isScreenSharing ? "Parou de partilhar o ecrã." : "Começou a partilhar o ecrã.",
    });
  };

  const changeRole = (userId: string, newRole: 'editor' | 'viewer') => {
    setCollaborators(prev => prev.map(collab => 
      collab.id === userId ? { ...collab, role: newRole } : collab
    ));
    
    const user = collaborators.find(c => c.id === userId);
    toast({
      title: "Permissões Alteradas",
      description: `${user?.name} agora é ${newRole === 'editor' ? 'editor' : 'visualizador'}.`,
    });
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner': return 'bg-yellow-500';
      case 'editor': return 'bg-green-500';
      case 'viewer': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'owner': return 'Proprietário';
      case 'editor': return 'Editor';
      case 'viewer': return 'Visualizador';
      default: return 'Desconhecido';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      
      <DialogContent className="max-w-6xl h-[90vh] p-0">
        <DialogHeader className="p-4 border-b bg-gradient-to-r from-green-500/10 to-blue-500/10">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2 text-green-500" />
              Colaboração ao Vivo
              <Badge className="ml-2 bg-green-500 animate-pulse">
                <div className="w-2 h-2 bg-white rounded-full mr-1" />
                AO VIVO
              </Badge>
            </DialogTitle>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Código:</span>
              <Badge variant="outline" className="font-mono">{sessionCode}</Badge>
              <Button variant="outline" size="sm" onClick={inviteCollaborator}>
                <Copy className="h-4 w-4 mr-2" />
                Copiar Link
              </Button>
            </div>
          </div>
        </DialogHeader>
        
        <div className="flex-1 flex overflow-hidden">
          {/* Main Canvas Area */}
          <div className="flex-1 flex flex-col">
            {/* Video Call Bar */}
            <div className="p-3 border-b bg-muted/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {collaborators.filter(c => c.isOnline).map(collab => (
                    <div key={collab.id} className="relative">
                      <Avatar className="h-8 w-8 border-2 border-green-500">
                        <AvatarImage src={collab.avatar} />
                        <AvatarFallback>{collab.name[0]}</AvatarFallback>
                      </Avatar>
                      {collab.id === '1' && isVideoEnabled && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full" />
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant={isVideoEnabled ? 'default' : 'outline'}
                    size="sm"
                    onClick={toggleVideo}
                  >
                    {isVideoEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                  </Button>
                  
                  <Button
                    variant={isAudioEnabled ? 'default' : 'outline'}
                    size="sm"
                    onClick={toggleAudio}
                  >
                    {isAudioEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                  </Button>
                  
                  <Button
                    variant={isScreenSharing ? 'default' : 'outline'}
                    size="sm"
                    onClick={startScreenShare}
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                  
                  <Button variant="destructive" size="sm">
                    <PhoneOff className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Canvas with Real-time Cursors */}
            <div className="flex-1 relative bg-muted/10 flex items-center justify-center">
              <div className="relative w-96 h-96 bg-white border-2 border-primary/30 rounded-lg">
                <canvas
                  width={384}
                  height={384}
                  className="w-full h-full cursor-crosshair"
                  style={{ imageRendering: 'pixelated' }}
                />
                
                {/* Real-time Cursors */}
                <AnimatePresence>
                  {collaborators
                    .filter(collab => collab.cursor && collab.id !== '1')
                    .map(collab => (
                      <motion.div
                        key={collab.id}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        className="absolute pointer-events-none z-10"
                        style={{
                          left: collab.cursor!.x,
                          top: collab.cursor!.y,
                          transform: 'translate(-50%, -50%)'
                        }}
                      >
                        <div className="relative">
                          <div 
                            className="w-4 h-4 rounded-full border-2 border-white shadow-lg"
                            style={{ backgroundColor: collab.color }}
                          />
                          <div 
                            className="absolute -bottom-8 left-0 bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap"
                            style={{ borderColor: collab.color }}
                          >
                            {collab.name}
                            {collab.currentTool && (
                              <span className="ml-1">• {collab.currentTool}</span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                </AnimatePresence>
              </div>
            </div>
            
            {/* Toolbar */}
            <div className="p-4 border-t bg-muted/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Brush className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Eraser className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Palette className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex gap-1">
                    {['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'].map(color => (
                      <button
                        key={color}
                        className="w-6 h-6 rounded border-2 border-border hover:scale-110 transition-transform"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {collaborators.filter(c => c.isOnline).length} online
                  </span>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Sidebar */}
          <div className="w-80 border-l flex flex-col">
            {/* Collaborators List */}
            <div className="p-4 border-b">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Colaboradores ({collaborators.length})</h3>
                <Button variant="outline" size="sm" onClick={inviteCollaborator}>
                  <UserPlus className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-2">
                {collaborators.map(collab => (
                  <div key={collab.id} className="flex items-center gap-3 p-2 bg-muted/20 rounded">
                    <div className="relative">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={collab.avatar} />
                        <AvatarFallback>{collab.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${
                        collab.isOnline ? 'bg-green-500' : 'bg-gray-500'
                      }`} />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{collab.name}</span>
                        <Badge className={`text-xs ${getRoleColor(collab.role)}`}>
                          {getRoleLabel(collab.role)}
                        </Badge>
                      </div>
                      {collab.currentTool && (
                        <p className="text-xs text-muted-foreground">
                          Usando: {collab.currentTool}
                        </p>
                      )}
                    </div>
                    
                    {collab.role !== 'owner' && collab.id !== '1' && (
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => changeRole(collab.id, collab.role === 'editor' ? 'viewer' : 'editor')}
                        >
                          {collab.role === 'editor' ? <Eye className="h-3 w-3" /> : <Brush className="h-3 w-3" />}
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Live Chat */}
            <div className="flex-1 flex flex-col">
              <div className="p-3 border-b">
                <h3 className="font-semibold flex items-center">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Chat ao Vivo
                </h3>
              </div>
              
              <ScrollArea className="flex-1 p-3">
                <div className="space-y-3">
                  <AnimatePresence>
                    {chatMessages.map(msg => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`${
                          msg.type === 'system' 
                            ? 'text-center text-xs text-muted-foreground italic' 
                            : ''
                        }`}
                      >
                        {msg.type === 'system' ? (
                          <p>{msg.message}</p>
                        ) : (
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm text-primary">{msg.user}</span>
                              <span className="text-xs text-muted-foreground">{msg.timestamp}</span>
                            </div>
                            <p className="text-sm">{msg.message}</p>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </ScrollArea>
              
              {/* Chat Input */}
              <div className="p-3 border-t">
                <div className="flex gap-2 mb-2">
                  <Input
                    placeholder="Escrever mensagem..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    className="text-sm"
                  />
                  <Button size="icon" onClick={sendMessage}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                
                {/* Quick Reactions */}
                <div className="flex gap-1">
                  {['👍', '❤️', '😊', '🎨', '✨', '🔥'].map(emoji => (
                    <Button
                      key={emoji}
                      variant="ghost"
                      size="sm"
                      className="text-lg p-1 h-8 w-8"
                      onClick={() => {
                        const emojiMsg: ChatMessage = {
                          id: Date.now().toString(),
                          user: 'Você',
                          message: emoji,
                          timestamp: new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }),
                          type: 'emoji'
                        };
                        setChatMessages(prev => [...prev, emojiMsg]);
                      }}
                    >
                      {emoji}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}