
// src/components/user/UserProfileSheet.tsx
'use client';

import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from "@/components/ui/sheet";
import { UserProfileDisplay, type UserProfileData } from './UserProfileDisplay';
import { ScrollArea } from '../ui/scroll-area';

interface UserProfileSheetProps {
  children: React.ReactNode;
  userData: UserProfileData;
}

export function UserProfileSheet({ children, userData }: UserProfileSheetProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="w-full max-w-md p-0 sm:max-w-md" side="right">
        <SheetHeader className="sr-only">
          <SheetTitle>Perfil de {userData.name}</SheetTitle>
          <SheetDescription>
            Visualização detalhada do perfil do utilizador {userData.name}.
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-full">
          <UserProfileDisplay userData={userData} />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
