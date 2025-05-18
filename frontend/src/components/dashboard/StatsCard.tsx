import React from 'react';
import { FiArrowUp, FiArrowDown } from 'react-icons/fi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/currency-utils';

interface StatsCardProps {
  title: string;
  value: number;
  previousValue?: number;
  icon?: React.ReactNode;
  className?: string;
  valuePrefix?: string;
  valueSuffix?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: number;
  trendLabel?: string;
  isLoading?: boolean;
}

const StatsCard = ({
  title,
  value,
  previousValue,
  icon,
  className,
  valuePrefix = '$',
  valueSuffix = '',
  trend,
  trendValue,
  trendLabel,
  isLoading = false,
}: StatsCardProps) => {
  // Calculate trend if not provided but previous value exists
  const calculatedTrend = trend || (previousValue !== undefined
    ? value > previousValue
      ? 'up'
      : value < previousValue
        ? 'down'
        : 'neutral'
    : undefined);
  
  // Calculate trend value if not provided but previous value exists
  const calculatedTrendValue = trendValue !== undefined
    ? trendValue
    : previousValue !== undefined && previousValue !== 0
      ? ((value - previousValue) / Math.abs(previousValue)) * 100
      : undefined;

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-8 w-24 bg-muted animate-pulse rounded" />
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {icon && <div className="mr-2 text-muted-foreground">{icon}</div>}
              <div className="text-2xl font-bold">
                {valuePrefix}{typeof value === 'number' ? value.toFixed(2) : value}{valueSuffix}
              </div>
            </div>
            
            {calculatedTrend && calculatedTrendValue !== undefined && (
              <div className={cn(
                'flex items-center',
                calculatedTrend === 'up' ? 'text-green-500' : 
                calculatedTrend === 'down' ? 'text-red-500' : 
                'text-muted-foreground'
              )}>
                {calculatedTrend === 'up' ? (
                  <FiArrowUp className="mr-1 h-4 w-4" />
                ) : calculatedTrend === 'down' ? (
                  <FiArrowDown className="mr-1 h-4 w-4" />
                ) : null}
                <span>{Math.abs(calculatedTrendValue).toFixed(1)}%</span>
              </div>
            )}
          </div>
        )}
        
        {trendLabel && (
          <p className="text-xs text-muted-foreground mt-1">
            {trendLabel}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default StatsCard;
