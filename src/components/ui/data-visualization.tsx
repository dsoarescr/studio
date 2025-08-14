'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import {
  BarChart3, PieChart, LineChart, TrendingUp, TrendingDown,
  Activity, Target, Zap, Crown, Gem, Star, MapPin, Users,
  Coins, Trophy, Award, Calendar, Clock, Eye, Heart
} from 'lucide-react';

interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  percentage?: number;
}

interface SimpleBarChartProps {
  data: ChartDataPoint[];
  title?: string;
  height?: number;
  showValues?: boolean;
  showTrends?: boolean;
  className?: string;
}

export function SimpleBarChart({ 
  data, 
  title, 
  height = 200, 
  showValues = true,
  showTrends = false,
  className = '' 
}: SimpleBarChartProps) {
  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <Card className={className}>
      {title && (
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-primary" />
            {title}
          </CardTitle>
        </CardHeader>
      )}
      <CardContent>
        <div className="space-y-4" style={{ height }}>
          {data.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  {showValues && (
                    <span className="font-bold">{item.value.toLocaleString()}</span>
                  )}
                  {showTrends && item.trend && (
                    <div className={`flex items-center gap-1 ${
                      item.trend === 'up' ? 'text-green-500' : 
                      item.trend === 'down' ? 'text-red-500' : 'text-muted-foreground'
                    }`}>
                      {item.trend === 'up' && <TrendingUp className="h-3 w-3" />}
                      {item.trend === 'down' && <TrendingDown className="h-3 w-3" />}
                      {item.percentage && (
                        <span className="text-xs">{item.percentage}%</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="relative">
                <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(item.value / maxValue) * 100}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    className="h-full rounded-full transition-all duration-500"
                    style={{ 
                      backgroundColor: item.color || 'hsl(var(--primary))',
                      boxShadow: `0 0 10px ${item.color || 'hsl(var(--primary))'}40`
                    }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

interface DonutChartProps {
  data: ChartDataPoint[];
  title?: string;
  centerText?: string;
  centerValue?: string | number;
  size?: number;
  thickness?: number;
  className?: string;
}

export function DonutChart({ 
  data, 
  title, 
  centerText, 
  centerValue,
  size = 200, 
  thickness = 20,
  className = '' 
}: DonutChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  
  let cumulativePercentage = 0;

  return (
    <Card className={className}>
      {title && (
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <PieChart className="h-5 w-5 mr-2 text-primary" />
            {title}
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className="flex flex-col items-center space-y-4">
        <div className="relative" style={{ width: size, height: size }}>
          <svg width={size} height={size} className="transform -rotate-90">
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth={thickness}
            />
            
            {data.map((item, index) => {
              const percentage = (item.value / total) * 100;
              const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
              const strokeDashoffset = -((cumulativePercentage / 100) * circumference);
              
              cumulativePercentage += percentage;
              
              return (
                <motion.circle
                  key={index}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="none"
                  stroke={item.color || `hsl(var(--chart-${index + 1}))`}
                  strokeWidth={thickness}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  initial={{ strokeDasharray: `0 ${circumference}` }}
                  animate={{ strokeDasharray }}
                  transition={{ duration: 1, delay: index * 0.2 }}
                  className="drop-shadow-sm"
                />
              );
            })}
          </svg>
          
          {/* Center Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            {centerValue && (
              <div className="text-2xl font-bold text-primary">{centerValue}</div>
            )}
            {centerText && (
              <div className="text-sm text-muted-foreground">{centerText}</div>
            )}
          </div>
        </div>
        
        {/* Legend */}
        <div className="grid grid-cols-2 gap-2 w-full">
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color || `hsl(var(--chart-${index + 1}))` }}
              />
              <span className="truncate">{item.label}</span>
              <span className="font-medium ml-auto">
                {((item.value / total) * 100).toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
    period?: string;
  };
  icon?: React.ReactNode;
  color?: string;
  description?: string;
  className?: string;
}

export function StatCard({ 
  title, 
  value, 
  change, 
  icon, 
  color = 'text-primary',
  description,
  className = '' 
}: StatCardProps) {
  return (
    <Card className={`hover:shadow-lg transition-shadow ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">{title}</p>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold">{value}</p>
              {change && (
                <div className={`flex items-center gap-1 text-sm ${
                  change.type === 'increase' ? 'text-green-500' : 'text-red-500'
                }`}>
                  {change.type === 'increase' ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  <span>{Math.abs(change.value)}%</span>
                  {change.period && (
                    <span className="text-muted-foreground">vs {change.period}</span>
                  )}
                </div>
              )}
            </div>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
          
          {icon && (
            <div className={`p-3 rounded-full bg-muted/20 ${color}`}>
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface MetricGridProps {
  metrics: Array<{
    label: string;
    value: string | number;
    icon?: React.ReactNode;
    color?: string;
    trend?: 'up' | 'down' | 'neutral';
    trendValue?: number;
  }>;
  columns?: number;
  className?: string;
}

export function MetricGrid({ 
  metrics, 
  columns = 4, 
  className = '' 
}: MetricGridProps) {
  return (
    <div className={`grid grid-cols-2 md:grid-cols-${columns} gap-4 ${className}`}>
      {metrics.map((metric, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="text-center hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              {metric.icon && (
                <div className={`mx-auto mb-2 ${metric.color || 'text-primary'}`}>
                  {metric.icon}
                </div>
              )}
              
              <div className="space-y-1">
                <p className="text-2xl font-bold">{metric.value}</p>
                <p className="text-xs text-muted-foreground">{metric.label}</p>
                
                {metric.trend && metric.trendValue && (
                  <div className={`flex items-center justify-center gap-1 text-xs ${
                    metric.trend === 'up' ? 'text-green-500' : 
                    metric.trend === 'down' ? 'text-red-500' : 'text-muted-foreground'
                  }`}>
                    {metric.trend === 'up' && <TrendingUp className="h-3 w-3" />}
                    {metric.trend === 'down' && <TrendingDown className="h-3 w-3" />}
                    <span>{metric.trendValue}%</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

interface HeatmapProps {
  data: Array<{
    x: number;
    y: number;
    value: number;
    label?: string;
  }>;
  width?: number;
  height?: number;
  cellSize?: number;
  title?: string;
  className?: string;
}

export function Heatmap({ 
  data, 
  width = 400, 
  height = 300, 
  cellSize = 20,
  title,
  className = '' 
}: HeatmapProps) {
  const maxValue = Math.max(...data.map(d => d.value));
  const cols = Math.floor(width / cellSize);
  const rows = Math.floor(height / cellSize);

  return (
    <Card className={className}>
      {title && (
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <Activity className="h-5 w-5 mr-2 text-primary" />
            {title}
          </CardTitle>
        </CardHeader>
      )}
      <CardContent>
        <div className="space-y-4">
          <svg width={width} height={height} className="border rounded">
            {data.map((point, index) => {
              const opacity = point.value / maxValue;
              const x = (point.x % cols) * cellSize;
              const y = (point.y % rows) * cellSize;
              
              return (
                <motion.rect
                  key={index}
                  x={x}
                  y={y}
                  width={cellSize - 1}
                  height={cellSize - 1}
                  fill="hsl(var(--primary))"
                  fillOpacity={opacity}
                  initial={{ fillOpacity: 0 }}
                  animate={{ fillOpacity: opacity }}
                  transition={{ delay: index * 0.01 }}
                  className="hover:stroke-primary hover:stroke-2"
                >
                  <title>{point.label || `${point.x}, ${point.y}: ${point.value}`}</title>
                </motion.rect>
              );
            })}
          </svg>
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Menos ativo</span>
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="w-3 h-3 rounded-sm"
                  style={{
                    backgroundColor: 'hsl(var(--primary))',
                    opacity: (index + 1) * 0.2
                  }}
                />
              ))}
            </div>
            <span>Mais ativo</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Predefined chart configurations for common use cases
export const pixelStatsData: ChartDataPoint[] = [
  { label: 'Lisboa', value: 234, color: '#D4A757', icon: <MapPin className="h-4 w-4" /> },
  { label: 'Porto', value: 189, color: '#7DF9FF', icon: <MapPin className="h-4 w-4" /> },
  { label: 'Coimbra', value: 156, color: '#9C27B0', icon: <MapPin className="h-4 w-4" /> },
  { label: 'Braga', value: 98, color: '#4CAF50', icon: <MapPin className="h-4 w-4" /> },
  { label: 'Faro', value: 87, color: '#FF9800', icon: <MapPin className="h-4 w-4" /> }
];

export const userActivityData: ChartDataPoint[] = [
  { label: 'Pixels Comprados', value: 42, icon: <MapPin className="h-4 w-4" />, trend: 'up', percentage: 12 },
  { label: 'Conquistas', value: 8, icon: <Trophy className="h-4 w-4" />, trend: 'up', percentage: 25 },
  { label: 'Likes Recebidos', value: 156, icon: <Heart className="h-4 w-4" />, trend: 'up', percentage: 8 },
  { label: 'Visualizações', value: 1234, icon: <Eye className="h-4 w-4" />, trend: 'neutral' }
];

export const rarityDistributionData: ChartDataPoint[] = [
  { label: 'Comum', value: 45, color: '#6B7280' },
  { label: 'Incomum', value: 30, color: '#10B981' },
  { label: 'Raro', value: 15, color: '#3B82F6' },
  { label: 'Épico', value: 8, color: '#8B5CF6' },
  { label: 'Lendário', value: 2, color: '#F59E0B' }
];