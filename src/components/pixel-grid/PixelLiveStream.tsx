'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Gift,
  Heart,
  Star,
  Radio,
  Video,
  VideoOff,
  Mic,
  MicOff,
  X,
  Eye,
  Share2,
  MessageSquare,
  Send,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LiveStream {
  id: string;
  streamer: {
    name: string;
    avatar: string;
    verified: boolean;
    level: number;
    followers: number;
  };
  title: string;
  description: string;
  viewers: number;
  duration: string;
  pixel: {
    x: number;
    y: number;
    region: string;
  };
  isLive: boolean;
  category: 'pixel-art' | 'tutorial' | 'showcase' | 'auction';
}

interface ChatMessage {
  id: string;
  user: {
    name: string;
    avatar: string;
    verified: boolean;
    level: number;
  };
  message: string;
  timestamp: string;
  type: 'message' | 'gift' | 'follow' | 'system';
  giftValue?: number;
}

interface PixelLiveStreamProps {
  children: React.ReactNode;
}

const mockStreams: LiveStream[] = [
  {
    id: '1',
    streamer: {
      name: 'PixelMaster',
      avatar: 'https://placehold.co/40x40.png',
      verified: true,
      level: 25,
      followers: 1234,
    },
    title: 'Criando Arte Pixel em Tempo Real - Lisboa',
    description: 'Vamos criar uma obra-prima juntos!',
    viewers: 156,
    duration: '1:23:45',
    pixel: { x: 245, y: 156, region: 'Lisboa' },
    isLive: true,
    category: 'pixel-art',
  },
  {
    id: '2',
    streamer: {
      name: 'TutorialGuru',
      avatar: 'https://placehold.co/40x40.png',
      verified: false,
      level: 18,
      followers: 567,
    },
    title: 'Tutorial: Como Maximizar o Valor dos Seus Pixels',
    description: 'Dicas e estratégias para investidores',
    viewers: 89,
    duration: '45:12',
    pixel: { x: 300, y: 200, region: 'Porto' },
    isLive: true,
    category: 'tutorial',
  },
];

const mockChatMessages: ChatMessage[] = [
  {
    id: '1',
    user: { name: 'Viewer1', avatar: 'https://placehold.co/30x30.png', verified: false, level: 5 },
    message: 'Incrível! Como consegues fazer isso tão rápido?',
    timestamp: '14:23',
    type: 'message',
  },
  {
    id: '2',
    user: { name: 'ArtLover', avatar: 'https://placehold.co/30x30.png', verified: true, level: 12 },
    message: 'Enviou 50 créditos',
    timestamp: '14:24',
    type: 'gift',
    giftValue: 50,
  },
  {
    id: '3',
    user: {
      name: 'NewFollower',
      avatar: 'https://placehold.co/30x30.png',
      verified: false,
      level: 3,
    },
    message: 'começou a seguir',
    timestamp: '14:25',
    type: 'follow',
  },
];

export default function PixelLiveStream({ children }: PixelLiveStreamProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStream, setSelectedStream] = useState<LiveStream | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(mockChatMessages);
  const [newMessage, setNewMessage] = useState('');
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [viewerCount, setViewerCount] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Simular atualizações em tempo real
  useEffect(() => {
    if (selectedStream) {
      const interval = setInterval(() => {
        setViewerCount(prev => prev + Math.floor(Math.random() * 5) - 2);

        // Adicionar mensagem aleatória
        if (Math.random() > 0.7) {
          const randomMessages = [
            'Que pixel incrível!',
            'Quanto custa esse?',
            'Posso comprar agora?',
            'Tutorial fantástico!',
            'Onde fica esse pixel?',
          ];

          const newMsg: ChatMessage = {
            id: Date.now().toString(),
            user: {
              name: `Viewer${Math.floor(Math.random() * 1000)}`,
              avatar: 'https://placehold.co/30x30.png',
              verified: Math.random() > 0.8,
              level: Math.floor(Math.random() * 20) + 1,
            },
            message: randomMessages[Math.floor(Math.random() * randomMessages.length)],
            timestamp: new Date().toLocaleTimeString('pt-PT', {
              hour: '2-digit',
              minute: '2-digit',
            }),
            type: 'message',
          };

          setChatMessages(prev => [...prev, newMsg].slice(-50));
        }
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [selectedStream]);

  // Auto-scroll chat
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const startStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsStreaming(true);
        setViewerCount(1);

        toast({
          title: 'Stream Iniciada!',
          description: 'Você está agora ao vivo no Pixel Universe.',
        });
      }
    } catch {
      toast({
        title: 'Erro na Stream',
        description: 'Não foi possível iniciar a transmissão.',
        variant: 'destructive',
      });
    }
  };

  const stopStream = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    setIsStreaming(false);
    setViewerCount(0);

    toast({
      title: 'Stream Terminada',
      description: 'A sua transmissão foi encerrada.',
    });
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      user: {
        name: 'Você',
        avatar: 'https://placehold.co/30x30.png',
        verified: true,
        level: 15,
      },
      message: newMessage,
      timestamp: new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }),
      type: 'message',
    };

    setChatMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const sendGift = (amount: number) => {
    const giftMessage: ChatMessage = {
      id: Date.now().toString(),
      user: {
        name: 'Você',
        avatar: 'https://placehold.co/30x30.png',
        verified: true,
        level: 15,
      },
      message: `Enviou ${amount} créditos`,
      timestamp: new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }),
      type: 'gift',
      giftValue: amount,
    };

    setChatMessages(prev => [...prev, giftMessage]);

    toast({
      title: 'Presente Enviado!',
      description: `Você enviou ${amount} créditos para o streamer.`,
    });
  };

  const renderChatMessage = (msg: ChatMessage) => {
    switch (msg.type) {
      case 'gift':
        return (
          <div className="flex items-center gap-2 rounded bg-gradient-to-r from-yellow-500/20 to-orange-500/20 p-2">
            <Gift className="h-4 w-4 text-yellow-500" />
            <Avatar className="h-6 w-6">
              <AvatarImage src={msg.user.avatar} />
              <AvatarFallback className="text-xs">{msg.user.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <span className="font-medium text-yellow-500">{msg.user.name}</span>
              <span className="text-sm"> {msg.message}</span>
              {msg.giftValue && (
                <Badge className="ml-2 bg-yellow-500 text-black">+{msg.giftValue}</Badge>
              )}
            </div>
          </div>
        );

      case 'follow':
        return (
          <div className="flex items-center gap-2 rounded bg-blue-500/20 p-2">
            <Heart className="h-4 w-4 text-blue-500" />
            <span className="font-medium text-blue-500">{msg.user.name}</span>
            <span className="text-sm">{msg.message}</span>
          </div>
        );

      default:
        return (
          <div className="flex items-start gap-2 p-1">
            <Avatar className="h-6 w-6">
              <AvatarImage src={msg.user.avatar} />
              <AvatarFallback className="text-xs">{msg.user.name[0]}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium">{msg.user.name}</span>
                {msg.user.verified && <Star className="h-3 w-3 fill-current text-yellow-500" />}
                <Badge variant="outline" className="text-xs">
                  {msg.user.level}
                </Badge>
              </div>
              <p className="break-words text-sm text-foreground">{msg.message}</p>
            </div>
            <span className="text-xs text-muted-foreground">{msg.timestamp}</span>
          </div>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="h-[90vh] max-w-4xl p-0">
        <DialogHeader className="border-b p-4">
          <DialogTitle className="flex items-center">
            <Radio className="mr-2 h-5 w-5 animate-pulse text-red-500" />
            Pixel Live Streams
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden">
          {!selectedStream ? (
            // Lista de streams
            <div className="flex-1 p-4">
              <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                {mockStreams.map(stream => (
                  <Card
                    key={stream.id}
                    className="cursor-pointer transition-shadow hover:shadow-lg"
                    onClick={() => {
                      setSelectedStream(stream);
                      setViewerCount(stream.viewers);
                    }}
                  >
                    <div className="relative">
                      <div className="flex aspect-video items-center justify-center rounded-t-lg bg-gradient-to-br from-primary/20 to-accent/20">
                        <Video className="h-12 w-12 text-primary" />
                      </div>

                      {stream.isLive && (
                        <Badge className="absolute left-2 top-2 animate-pulse bg-red-500">
                          <Radio className="mr-1 h-3 w-3" />
                          AO VIVO
                        </Badge>
                      )}

                      <div className="absolute bottom-2 right-2 rounded bg-black/60 px-2 py-1 text-xs text-white">
                        {stream.duration}
                      </div>
                    </div>

                    <CardContent className="p-4">
                      <div className="mb-2 flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={stream.streamer.avatar} />
                          <AvatarFallback>{stream.streamer.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-1">
                            <span className="text-sm font-medium">{stream.streamer.name}</span>
                            {stream.streamer.verified && (
                              <Star className="h-3 w-3 fill-current text-yellow-500" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {stream.streamer.followers.toLocaleString()} seguidores
                          </p>
                        </div>
                      </div>

                      <h3 className="mb-1 font-semibold">{stream.title}</h3>
                      <p className="mb-2 text-sm text-muted-foreground">{stream.description}</p>

                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <Eye className="h-3 w-3" />
                          <span>{stream.viewers} espectadores</span>
                        </div>
                        <Badge variant="outline">
                          ({stream.pixel.x}, {stream.pixel.y}) {stream.pixel.region}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="bg-gradient-to-r from-primary/10 to-accent/10">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Video className="mr-2 h-5 w-5" />
                    Iniciar Sua Própria Stream
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-muted-foreground">
                    Partilhe a sua criação de pixel art em tempo real e ganhe créditos dos
                    espectadores!
                  </p>
                  <Button onClick={startStream} className="w-full">
                    <Radio className="mr-2 h-4 w-4" />
                    Começar a Transmitir
                  </Button>
                </CardContent>
              </Card>
            </div>
          ) : (
            // Visualizador de stream
            <div className="flex flex-1">
              {/* Área do vídeo */}
              <div className="flex flex-1 flex-col">
                <div className="relative flex-1 bg-black">
                  {isStreaming ? (
                    <video ref={videoRef} autoPlay muted className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
                      <div className="text-center text-white">
                        <Video className="mx-auto mb-4 h-16 w-16" />
                        <h3 className="mb-2 text-xl font-bold">{selectedStream.title}</h3>
                        <p className="text-white/80">{selectedStream.description}</p>
                      </div>
                    </div>
                  )}

                  {/* Stream info overlay */}
                  <div className="absolute left-4 right-4 top-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border-2 border-white">
                        <AvatarImage src={selectedStream.streamer.avatar} />
                        <AvatarFallback>{selectedStream.streamer.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-white">
                            {selectedStream.streamer.name}
                          </span>
                          {selectedStream.streamer.verified && (
                            <Star className="h-4 w-4 fill-current text-yellow-400" />
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-white/80">
                          <Badge className="animate-pulse bg-red-500">AO VIVO</Badge>
                          <span>{viewerCount} espectadores</span>
                        </div>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedStream(null)}
                      className="text-white hover:bg-white/20"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Stream controls */}
                  {isStreaming && (
                    <div className="absolute bottom-4 left-4 flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsVideoEnabled(!isVideoEnabled)}
                        className="bg-black/60 text-white hover:bg-black/80"
                      >
                        {isVideoEnabled ? (
                          <Video className="h-4 w-4" />
                        ) : (
                          <VideoOff className="h-4 w-4" />
                        )}
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsAudioEnabled(!isAudioEnabled)}
                        className="bg-black/60 text-white hover:bg-black/80"
                      >
                        {isAudioEnabled ? (
                          <Mic className="h-4 w-4" />
                        ) : (
                          <MicOff className="h-4 w-4" />
                        )}
                      </Button>

                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={stopStream}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Parar Stream
                      </Button>
                    </div>
                  )}
                </div>

                {/* Pixel info */}
                <div className="border-t bg-card p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{selectedStream.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        Pixel ({selectedStream.pixel.x}, {selectedStream.pixel.y}) em{' '}
                        {selectedStream.pixel.region}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Share2 className="mr-2 h-4 w-4" />
                        Partilhar
                      </Button>
                      <Button size="sm">
                        <Eye className="mr-2 h-4 w-4" />
                        Ver Pixel
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chat */}
              <div className="flex w-80 flex-col border-l">
                <div className="border-b bg-muted/50 p-3">
                  <h3 className="flex items-center font-medium">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Chat ao Vivo
                  </h3>
                </div>

                <ScrollArea className="flex-1 p-2" ref={chatScrollRef}>
                  <div className="space-y-2">
                    <AnimatePresence>
                      {chatMessages.map(msg => (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                        >
                          {renderChatMessage(msg)}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </ScrollArea>

                {/* Gift buttons */}
                <div className="border-t p-2">
                  <div className="mb-2 grid grid-cols-3 gap-1">
                    {[10, 50, 100].map(amount => (
                      <Button
                        key={amount}
                        variant="outline"
                        size="sm"
                        onClick={() => sendGift(amount)}
                        className="text-xs"
                      >
                        <Gift className="mr-1 h-3 w-3" />
                        {amount}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Message input */}
                <div className="border-t p-2">
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
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
