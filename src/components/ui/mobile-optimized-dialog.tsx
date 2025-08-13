'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MobileOptimizedDialogProps {
  children: React.ReactNode;
  trigger: React.ReactNode;
  title: string;
  description?: string;
  fullScreen?: boolean;
  showCloseButton?: boolean;
  className?: string;
}

export function MobileOptimizedDialog({
  children,
  trigger,
  title,
  description,
  fullScreen = false,
  showCloseButton = true,
  className
}: MobileOptimizedDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      
      <DialogContent 
        className={cn(
          "p-0 gap-0 border-0",
          fullScreen 
            ? "h-screen w-screen max-w-none max-h-none rounded-none sm:h-[90vh] sm:w-[90vw] sm:rounded-lg" 
            : "max-h-[85vh] w-[95vw] max-w-md rounded-t-2xl sm:rounded-lg",
          "sm:max-w-2xl",
          className
        )}
      >
        <motion.div
          initial={{ y: fullScreen ? 0 : '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: fullScreen ? 0 : '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="h-full flex flex-col"
        >
          {/* Header */}
          <DialogHeader className="p-4 border-b bg-gradient-to-r from-card to-primary/5 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <DialogTitle className="text-lg font-headline text-left">
                  {title}
                </DialogTitle>
                {description && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {description}
                  </p>
                )}
              </div>
              
              {showCloseButton && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8 p-0 touch-target"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            {/* Mobile handle */}
            {!fullScreen && (
              <div className="flex justify-center pt-2">
                <div className="w-12 h-1 bg-muted-foreground/30 rounded-full" />
              </div>
            )}
          </DialogHeader>
          
          {/* Content */}
          <ScrollArea className="flex-1">
            <div className="p-4">
              {children}
            </div>
          </ScrollArea>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}

// Predefined mobile dialog variants
export function MobileBottomSheet({
  children,
  trigger,
  title,
  description,
  className
}: Omit<MobileOptimizedDialogProps, 'fullScreen'>) {
  return (
    <MobileOptimizedDialog
      trigger={trigger}
      title={title}
      description={description}
      fullScreen={false}
      className={className}
    >
      {children}
    </MobileOptimizedDialog>
  );
}

export function MobileFullScreenDialog({
  children,
  trigger,
  title,
  description,
  className
}: Omit<MobileOptimizedDialogProps, 'fullScreen'>) {
  return (
    <MobileOptimizedDialog
      trigger={trigger}
      title={title}
      description={description}
      fullScreen={true}
      className={className}
    >
      {children}
    </MobileOptimizedDialog>
  );
}