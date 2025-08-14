'use client';

import React, { createContext, useContext, useState } from 'react';
import { cn } from '../../lib/utils';

interface SidebarContextType {
  isOpen: boolean;
  toggle: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ 
  children, 
  defaultOpen = false 
}: { 
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  const toggle = () => setIsOpen(!isOpen);

  return (
    <SidebarContext.Provider value={{ isOpen, toggle }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within SidebarProvider');
  }
  return context;
}

export function Sidebar({ children, className }: { children: React.ReactNode; className?: string }) {
  const { isOpen } = useSidebar();
  
  return (
    <aside className={cn(
      "bg-sidebar border-r border-sidebar-border transition-all duration-300",
      isOpen ? "w-64" : "w-0 overflow-hidden",
      className
    )}>
      {children}
    </aside>
  );
}

export function SidebarHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-4 border-b border-sidebar-border">
      {children}
    </div>
  );
}

export function SidebarContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-4">
      {children}
    </div>
  );
}