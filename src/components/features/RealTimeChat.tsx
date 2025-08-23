'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/auth-context';
import { useUserStore } from '@/lib/store';
import { 
  MessageSquare, Send, Mic, MicOff, Phone, PhoneOff, Video, VideoOff,
  MoreVertical, Settings, Users, Crown, Star, Shield, Eye, EyeOff,
  Volume2, VolumeX, Smile, Image, FileText, Link as LinkIcon, Copy, Check,
  X, Plus, Minus, Search, Filter, SortAsc, SortDesc, Clock,
  Calendar, MapPin, TrendingUp, Activity, Home, User, LogOut,
  Sun, Moon, Monitor, Smartphone, Tablet, Wifi, WifiOff, Battery,
  BatteryCharging, Volume1, MicOff as MicOffIcon, Headphones,
  Gamepad, Mouse, Keyboard, Laptop, Server, Database, Cloud,
  CloudOff, Lock, Unlock, Eye as EyeIcon, EyeOff as EyeOffIcon,
  ShieldCheck, ShieldAlert, AlertTriangle, CheckCircle, XCircle,
  Info, ExternalLink, ThumbsUp, ThumbsDown, MessageCircle, Mail,
  Maximize, Minimize
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatMessage {
  id: string;
  content: string;
  type: 'text' | 'image' | 'file' | 'system';
  timestamp: Date;
  sender: {
    id: string;
    name: string;
    avatar: string;
    isOnline: boolean;
    isPremium: boolean;
    isVerified: boolean;
    level: number;
  };
  reactions: Reaction[];
  isEdited: boolean;
  isDeleted: boolean;
  replyTo?: string;
  mentions: string[];
}

interface Reaction {
  emoji: string;
  count: number;
  users: string[];
}

interface ChatRoom {
  id: string;
  name: string;
  type: 'global' | 'regional' | 'private' | 'group';
  description: string;
  icon: string;
  memberCount: number;
  isActive: boolean;
  lastMessage?: ChatMessage;
  unreadCount: number;
  isMuted: boolean;
  isPinned: boolean;
  settings: {
    allowImages: boolean;
    allowFiles: boolean;
    allowVoice: boolean;
    slowMode: boolean;
    moderationLevel: 'low' | 'medium' | 'high';
  };
}

interface ChatUser {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
  isPremium: boolean;
  isVerified: boolean;
  level: number;
  status: 'online' | 'away' | 'busy' | 'offline';
  lastSeen: Date;
  typing: boolean;
  currentRoom?: string;
}

// Mock data
const mockRooms: ChatRoom[] = [
  {
    id: 'global',
    name: 'Chat Global',
    type: 'global',
    description: 'Chat geral para todos os utilizadores',
    icon: '🌍',
    memberCount: 1234,
    isActive: true,
    unreadCount: 5,
    isMuted: false,
    isPinned: true,
    settings: {
      allowImages: true,
      allowFiles: true,
      allowVoice: false,
      slowMode: false,
      moderationLevel: 'medium'
    }
  },
  {
    id: 'lisboa',
    name: 'Lisboa',
    type: 'regional',
    description: 'Chat para utilizadores de Lisboa',
    icon: '🏛️',
    memberCount: 456,
    isActive: true,
    unreadCount: 2,
    isMuted: false,
    isPinned: false,
    settings: {
      allowImages: true,
      allowFiles: false,
      allowVoice: false,
      slowMode: false,
      moderationLevel: 'low'
    }
  },
  {
    id: 'trading',
    name: 'Trading & Investimentos',
    type: 'group',
    description: 'Discussões sobre trading de pixels',
    icon: '📈',
    memberCount: 789,
    isActive: true,
    unreadCount: 0,
    isMuted: true,
    isPinned: false,
    settings: {
      allowImages: true,
      allowFiles: true,
      allowVoice: true,
      slowMode: true,
      moderationLevel: 'high'
    }
  }
];

const mockMessages: ChatMessage[] = [
  {
    id: '1',
    content: 'Olá a todos! Como estão hoje?',
    type: 'text',
    timestamp: new Date(Date.now() - 60000),
    sender: {
      id: 'user1',
      name: 'PixelMasterPT',
      avatar: 'https://placehold.co/40x40.png',
      isOnline: true,
      isPremium: true,
      isVerified: true,
      level: 15
    },
    reactions: [
      { emoji: '👍', count: 3, users: ['user2', 'user3', 'user4'] },
      { emoji: '❤️', count: 1, users: ['user5'] }
    ],
    isEdited: false,
    isDeleted: false,
    mentions: []
  },
  {
    id: '2',
    content: 'Tudo bem! Acabei de comprar um pixel raro em Lisboa! 🎉',
    type: 'text',
    timestamp: new Date(Date.now() - 45000),
    sender: {
      id: 'user2',
      name: 'LisboaLover',
      avatar: 'https://placehold.co/40x40.png',
      isOnline: true,
      isPremium: false,
      isVerified: false,
      level: 8
    },
    reactions: [
      { emoji: '🎉', count: 2, users: ['user1', 'user3'] }
    ],
    isEdited: false,
    isDeleted: false,
    mentions: []
  },
  {
    id: '3',
    content: 'Parabéns! Qual foi o preço?',
    type: 'text',
    timestamp: new Date(Date.now() - 30000),
    sender: {
      id: 'user3',
      name: 'PixelTrader',
      avatar: 'https://placehold.co/40x40.png',
      isOnline: false,
      isPremium: true,
      isVerified: true,
      level: 22
    },
    reactions: [],
    isEdited: false,
    isDeleted: false,
    mentions: ['user2'],
    replyTo: '2'
  }
];

const mockUsers: ChatUser[] = [
  {
    id: 'user1',
    name: 'PixelMasterPT',
    avatar: 'https://placehold.co/40x40.png',
    isOnline: true,
    isPremium: true,
    isVerified: true,
    level: 15,
    status: 'online',
    lastSeen: new Date(),
    typing: false,
    currentRoom: 'global'
  },
  {
    id: 'user2',
    name: 'LisboaLover',
    avatar: 'https://placehold.co/40x40.png',
    isOnline: true,
    isPremium: false,
    isVerified: false,
    level: 8,
    status: 'online',
    lastSeen: new Date(),
    typing: true,
    currentRoom: 'global'
  }
];

export const RealTimeChat: React.FC = () => {
  const [rooms, setRooms] = useState<ChatRoom[]>(mockRooms);
  const [currentRoom, setCurrentRoom] = useState<ChatRoom>(mockRooms[0]);
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages);
  const [users, setUsers] = useState<ChatUser[]>(mockUsers);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Simulate WebSocket connection
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate new messages
      if (Math.random() > 0.7) {
        const newMsg: ChatMessage = {
          id: Date.now().toString(),
          content: generateRandomMessage(),
          type: 'text',
          timestamp: new Date(),
          sender: {
            id: `user${Math.floor(Math.random() * 10) + 1}`,
            name: `User${Math.floor(Math.random() * 100)}`,
            avatar: 'https://placehold.co/40x40.png',
            isOnline: true,
            isPremium: Math.random() > 0.7,
            isVerified: Math.random() > 0.8,
            level: Math.floor(Math.random() * 50) + 1
          },
          reactions: [],
          isEdited: false,
          isDeleted: false,
          mentions: []
        };
        setMessages(prev => [...prev, newMsg]);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = useCallback(() => {
    if (!newMessage.trim() || !user) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      content: newMessage,
      type: 'text',
      timestamp: new Date(),
      sender: {
        id: user.uid,
        name: user.displayName || 'Utilizador',
        avatar: user.photoURL || 'https://placehold.co/40x40.png',
        isOnline: true,
        isPremium: true, // Mock
        isVerified: true, // Mock
        level: 15 // Mock
      },
      reactions: [],
      isEdited: false,
      isDeleted: false,
      mentions: extractMentions(newMessage)
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
    setIsTyping(false);

    // Clear typing indicator
    setTimeout(() => {
      setUsers(prev => prev.map(u => 
        u.id === user.uid ? { ...u, typing: false } : u
      ));
    }, 1000);
  }, [newMessage, user]);

  const handleTyping = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    
    if (!isTyping) {
      setIsTyping(true);
      setUsers(prev => prev.map(u => 
        u.id === user?.uid ? { ...u, typing: true } : u
      ));
    }

    // Clear typing indicator after 3 seconds
    setTimeout(() => {
      setIsTyping(false);
      setUsers(prev => prev.map(u => 
        u.id === user?.uid ? { ...u, typing: false } : u
      ));
    }, 3000);
  }, [isTyping, user]);

  const handleRoomChange = useCallback((room: ChatRoom) => {
    setCurrentRoom(room);
    // Clear unread count
    setRooms(prev => prev.map(r => 
      r.id === room.id ? { ...r, unreadCount: 0 } : r
    ));
  }, []);

  const handleReaction = useCallback((messageId: string, emoji: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        const existingReaction = msg.reactions.find(r => r.emoji === emoji);
        if (existingReaction) {
          return {
            ...msg,
            reactions: msg.reactions.map(r => 
              r.emoji === emoji 
                ? { ...r, count: r.count + 1, users: [...r.users, user?.uid || ''] }
                : r
            )
          };
        } else {
          return {
            ...msg,
            reactions: [...msg.reactions, { emoji, count: 1, users: [user?.uid || ''] }]
          };
        }
      }
      return msg;
    }));
  }, [user]);

  const toggleMute = useCallback((roomId: string) => {
    setRooms(prev => prev.map(room => 
      room.id === roomId ? { ...room, isMuted: !room.isMuted } : room
    ));
  }, []);

  const togglePin = useCallback((roomId: string) => {
    setRooms(prev => prev.map(room => 
      room.id === roomId ? { ...room, isPinned: !room.isPinned } : room
    ));
  }, []);

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || room.type === filterType;
    return matchesSearch && matchesType;
  });

  const sortedRooms = [...filteredRooms].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return b.unreadCount - a.unreadCount;
  });

  return (
    <>
      {/* Chat Toggle Button */}
      <Button
        variant="outline"
        size="icon"
        className="relative"
        onClick={() => setShowChat(!showChat)}
      >
        <MessageSquare className="h-4 w-4" />
        {rooms.some(room => room.unreadCount > 0) && (
          <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs">
            {rooms.reduce((sum, room) => sum + room.unreadCount, 0)}
          </Badge>
        )}
      </Button>

      {/* Chat Window */}
      <AnimatePresence>
        {showChat && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={cn(
              "fixed bottom-20 right-4 z-50 bg-background border rounded-lg shadow-xl",
              isMinimized ? "w-80 h-12" : "w-96 h-[500px]"
            )}
          >
            {isMinimized ? (
              <div className="flex items-center justify-between p-3">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  <span className="font-medium">Chat</span>
                  {rooms.some(room => room.unreadCount > 0) && (
                    <Badge variant="destructive" className="h-5 w-5 p-0 text-xs">
                      {rooms.reduce((sum, room) => sum + room.unreadCount, 0)}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsMinimized(false)}
                  >
                    <Maximize className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowChat(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-3 border-b">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    <span className="font-medium">Chat</span>
                    <Badge variant="secondary" className="text-xs">
                      {currentRoom.memberCount} online
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsMinimized(true)}
                    >
                      <Minimize className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowChat(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Tabs */}
                <Tabs defaultValue="chat" className="flex-1 flex flex-col">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="chat">Chat</TabsTrigger>
                    <TabsTrigger value="rooms">Salas</TabsTrigger>
                    <TabsTrigger value="users">Utilizadores</TabsTrigger>
                  </TabsList>

                  <TabsContent value="chat" className="flex-1 flex flex-col">
                    {/* Room Header */}
                    <div className="flex items-center justify-between p-2 border-b bg-muted/50">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{currentRoom.icon}</span>
                        <div>
                          <div className="font-medium">{currentRoom.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {currentRoom.description}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleMute(currentRoom.id)}
                        >
                          {currentRoom.isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => togglePin(currentRoom.id)}
                        >
                          <Star className={cn("h-4 w-4", currentRoom.isPinned && "fill-yellow-400 text-yellow-400")} />
                        </Button>
                      </div>
                    </div>

                    {/* Messages */}
                    <ScrollArea className="flex-1 p-2">
                      <div className="space-y-2">
                        {messages.map((message) => (
                          <MessageBubble
                            key={message.id}
                            message={message}
                            onReaction={handleReaction}
                            currentUserId={user?.uid}
                          />
                        ))}
                        <div ref={messagesEndRef} />
                      </div>
                    </ScrollArea>

                    {/* Typing Indicator */}
                    <AnimatePresence>
                      {users.some(u => u.typing && u.currentRoom === currentRoom.id) && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="px-2 py-1 text-xs text-muted-foreground italic"
                        >
                          Alguém está a escrever...
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Message Input */}
                    <div className="p-2 border-t">
                      <div className="flex items-center gap-2">
                        <Input
                          value={newMessage}
                          onChange={handleTyping}
                          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                          placeholder="Escreva uma mensagem..."
                          className="flex-1"
                        />
                        <Button size="sm" onClick={handleSendMessage}>
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="rooms" className="flex-1">
                    <div className="p-2">
                      <div className="flex gap-2 mb-2">
                        <Input
                          placeholder="Pesquisar salas..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="flex-1"
                        />
                        <Select value={filterType} onValueChange={setFilterType}>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Todas</SelectItem>
                            <SelectItem value="global">Global</SelectItem>
                            <SelectItem value="regional">Regional</SelectItem>
                            <SelectItem value="group">Grupo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-1">
                        {sortedRooms.map((room) => (
                          <RoomItem
                            key={room.id}
                            room={room}
                            isActive={room.id === currentRoom.id}
                            onSelect={() => handleRoomChange(room)}
                            onMute={() => toggleMute(room.id)}
                            onPin={() => togglePin(room.id)}
                          />
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="users" className="flex-1">
                    <div className="p-2">
                      <div className="space-y-1">
                        {users.map((user) => (
                          <UserItem key={user.id} user={user} />
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// Componentes auxiliares
const MessageBubble: React.FC<{
  message: ChatMessage;
  onReaction: (messageId: string, emoji: string) => void;
  currentUserId?: string;
}> = ({ message, onReaction, currentUserId }) => {
  const [showReactions, setShowReactions] = useState(false);

  const isOwnMessage = message.sender.id === currentUserId;

  return (
    <div className={cn("flex gap-2", isOwnMessage && "flex-row-reverse")}>
      <Avatar className="h-8 w-8">
        <AvatarImage src={message.sender.avatar} />
        <AvatarFallback>{message.sender.name[0]}</AvatarFallback>
      </Avatar>
      
      <div className={cn("flex-1 max-w-[80%]", isOwnMessage && "text-right")}>
        <div className={cn(
          "rounded-lg p-2",
          isOwnMessage 
            ? "bg-primary text-primary-foreground ml-auto" 
            : "bg-muted"
        )}>
          <div className="flex items-center gap-1 mb-1">
            <span className="font-medium text-sm">{message.sender.name}</span>
            {message.sender.isPremium && <Crown className="h-3 w-3 text-amber-400" />}
            {message.sender.isVerified && <CheckCircle className="h-3 w-3 text-blue-400" />}
            <Badge variant="secondary" className="text-xs">Nv.{message.sender.level}</Badge>
          </div>
          
          <div className="text-sm">{message.content}</div>
          
          {message.reactions.length > 0 && (
            <div className="flex gap-1 mt-1">
              {message.reactions.map((reaction) => (
                <Button
                  key={reaction.emoji}
                  variant="ghost"
                  size="sm"
                  className="h-6 px-1 text-xs"
                  onClick={() => onReaction(message.id, reaction.emoji)}
                >
                  {reaction.emoji} {reaction.count}
                </Button>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
          <span>{message.timestamp.toLocaleTimeString()}</span>
          {message.isEdited && <span>(editado)</span>}
          <Button
            variant="ghost"
            size="sm"
            className="h-4 w-4 p-0"
            onClick={() => setShowReactions(!showReactions)}
          >
            <Smile className="h-3 w-3" />
          </Button>
        </div>
        
        {showReactions && (
          <div className="flex gap-1 mt-1">
            {['👍', '❤️', '😂', '😮', '😢', '😡'].map((emoji) => (
              <Button
                key={emoji}
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => {
                  onReaction(message.id, emoji);
                  setShowReactions(false);
                }}
              >
                {emoji}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const RoomItem: React.FC<{
  room: ChatRoom;
  isActive: boolean;
  onSelect: () => void;
  onMute: () => void;
  onPin: () => void;
}> = ({ room, isActive, onSelect, onMute, onPin }) => {
  return (
    <div
      className={cn(
        "flex items-center justify-between p-2 rounded-lg cursor-pointer hover:bg-muted/50",
        isActive && "bg-primary/10"
      )}
      onClick={onSelect}
    >
      <div className="flex items-center gap-2">
        <span className="text-lg">{room.icon}</span>
        <div className="flex-1">
          <div className="font-medium text-sm">{room.name}</div>
          <div className="text-xs text-muted-foreground">
            {room.memberCount} membros
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-1">
        {room.unreadCount > 0 && (
          <Badge variant="destructive" className="h-5 w-5 p-0 text-xs">
            {room.unreadCount}
          </Badge>
        )}
        {room.isMuted && <VolumeX className="h-3 w-3 text-muted-foreground" />}
        {room.isPinned && <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />}
      </div>
    </div>
  );
};

const UserItem: React.FC<{ user: ChatUser }> = ({ user }) => {
  return (
    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
      <div className="flex items-center gap-2">
        <div className="relative">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar} />
            <AvatarFallback>{user.name[0]}</AvatarFallback>
          </Avatar>
          <div className={cn(
            "absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background",
            user.isOnline ? "bg-green-500" : "bg-gray-400"
          )} />
        </div>
        
        <div className="flex-1">
          <div className="font-medium text-sm">{user.name}</div>
          <div className="text-xs text-muted-foreground">
            Nível {user.level}
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-1">
        {user.isPremium && <Crown className="h-3 w-3 text-amber-400" />}
        {user.isVerified && <CheckCircle className="h-3 w-3 text-blue-400" />}
        {user.typing && <span className="text-xs text-muted-foreground">a escrever...</span>}
      </div>
    </div>
  );
};

// Funções auxiliares
function generateRandomMessage(): string {
  const messages = [
    'Alguém comprou pixels hoje?',
    'Que preços estão a pagar por pixels em Lisboa?',
    'Alguma dica para iniciantes?',
    'Vou vender alguns pixels raros!',
    'Alguém quer trocar pixels?',
    'Que acham do novo sistema de coleções?',
    'Alguma previsão para os preços?',
    'Vou fazer uma coleção de pixels históricos!'
  ];
  return messages[Math.floor(Math.random() * messages.length)];
}

function extractMentions(text: string): string[] {
  const mentionRegex = /@(\w+)/g;
  const mentions: string[] = [];
  let match;
  
  while ((match = mentionRegex.exec(text)) !== null) {
    mentions.push(match[1]);
  }
  
  return mentions;
}
