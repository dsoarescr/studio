'use client';

import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useToast } from '../../hooks/use-toast';
import { LogIn, UserPlus, Mail, Lock } from 'lucide-react';

interface AuthModalProps {
  children: React.ReactNode;
  defaultTab?: 'login' | 'register';
}

export function AuthModal({ children, defaultTab = 'login' }: AuthModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: activeTab === 'login' ? "Login Realizado" : "Conta Criada",
      description: "Bem-vindo ao Pixel Universe!",
    });
    setIsOpen(false);
  };

  return (
    <>
      <div onClick={() => setIsOpen(true)}>
        {children}
      </div>
      
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-center">
                {activeTab === 'login' ? 'Entrar' : 'Criar Conta'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full">
                  {activeTab === 'login' ? (
                    <>
                      <LogIn className="h-4 w-4 mr-2" />
                      Entrar
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Criar Conta
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-4 text-center">
                <Button
                  variant="ghost"
                  onClick={() => setActiveTab(activeTab === 'login' ? 'register' : 'login')}
                >
                  {activeTab === 'login' ? 'Criar nova conta' : 'Já tenho conta'}
                </Button>
              </div>

              <div className="mt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  className="w-full"
                >
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}