'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { ChevronRight, MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobileOptimizedCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: 'default' | 'outline' | 'ghost';
    icon?: React.ReactNode;
  }>;
  badges?: Array<{
    label: string;
    variant?: 'default' | 'secondary' | 'outline' | 'destructive';
  }>;
  expandable?: boolean;
  onExpand?: () => void;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
}

export function MobileOptimizedCard({
  title,
  description,
  children,
  actions = [],
  badges = [],
  expandable = false,
  onExpand,
  className,
  headerClassName,
  contentClassName
}: MobileOptimizedCardProps) {
  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.1 }}
    >
      <Card className={cn(
        "mobile-card-optimized hover:shadow-xl transition-all duration-300",
        expandable && "cursor-pointer",
        className
      )}>
        <CardHeader 
          className={cn("pb-3", headerClassName)}
          onClick={expandable ? onExpand : undefined}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <CardTitle className="text-lg mobile-text-lg truncate">
                  {title}
                </CardTitle>
                {expandable && (
                  <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                )}
              </div>
              
              {description && (
                <CardDescription className="mobile-text-sm">
                  {description}
                </CardDescription>
              )}
              
              {badges.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {badges.map((badge, index) => (
                    <Badge 
                      key={index} 
                      variant={badge.variant || 'outline'}
                      className="text-xs"
                    >
                      {badge.label}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            
            {actions.length > 0 && (
              <div className="flex items-center gap-1 ml-2">
                {actions.slice(0, 2).map((action, index) => (
                  <Button
                    key={index}
                    variant={action.variant || 'outline'}
                    size="sm"
                    onClick={action.onClick}
                    className="touch-target"
                  >
                    {action.icon && (
                      <span className="mr-1">{action.icon}</span>
                    )}
                    <span className="hidden sm:inline">{action.label}</span>
                    <span className="sm:hidden">{action.icon}</span>
                  </Button>
                ))}
                
                {actions.length > 2 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardHeader>
        
        <CardContent className={cn("pt-0", contentClassName)}>
          {children}
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Predefined card variants for common use cases
export function MobileStatsCard({
  title,
  value,
  change,
  icon,
  className
}: {
  title: string;
  value: string | number;
  change?: { value: number; type: 'increase' | 'decrease' };
  icon?: React.ReactNode;
  className?: string;
}) {
  return (
    <MobileOptimizedCard
      title={title}
      className={cn("text-center", className)}
    >
      <div className="space-y-2">
        {icon && (
          <div className="flex justify-center text-primary">
            {icon}
          </div>
        )}
        
        <div className="text-2xl font-bold">{value}</div>
        
        {change && (
          <div className={cn(
            "text-sm flex items-center justify-center gap-1",
            change.type === 'increase' ? 'text-green-500' : 'text-red-500'
          )}>
            <span>{change.type === 'increase' ? '+' : '-'}{Math.abs(change.value)}%</span>
          </div>
        )}
      </div>
    </MobileOptimizedCard>
  );
}

export function MobileActionCard({
  title,
  description,
  primaryAction,
  secondaryAction,
  icon,
  className
}: {
  title: string;
  description: string;
  primaryAction: { label: string; onClick: () => void };
  secondaryAction?: { label: string; onClick: () => void };
  icon?: React.ReactNode;
  className?: string;
}) {
  return (
    <MobileOptimizedCard
      title={title}
      description={description}
      className={className}
    >
      <div className="space-y-3">
        {icon && (
          <div className="flex justify-center text-primary text-4xl">
            {icon}
          </div>
        )}
        
        <div className="space-y-2">
          <Button
            onClick={primaryAction.onClick}
            className="w-full mobile-button-optimized"
          >
            {primaryAction.label}
          </Button>
          
          {secondaryAction && (
            <Button
              variant="outline"
              onClick={secondaryAction.onClick}
              className="w-full mobile-button-optimized"
            >
              {secondaryAction.label}
            </Button>
          )}
        </div>
      </div>
    </MobileOptimizedCard>
  );
}