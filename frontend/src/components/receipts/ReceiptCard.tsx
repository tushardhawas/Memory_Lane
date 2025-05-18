import React from 'react';
import { Link } from 'react-router-dom';
import { FiCalendar, FiTag, FiDollarSign } from 'react-icons/fi';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { formatDate } from '@/lib/date-utils';
import { formatCurrency } from '@/lib/currency-utils';
import { Receipt } from '@/types';

interface ReceiptCardProps {
  receipt: Receipt;
  className?: string;
}

const ReceiptCard = ({ receipt, className }: ReceiptCardProps) => {
  const { id, merchant, date, amount, category, imageUrl } = receipt;
  
  // Get category color from the receipt store
  const getCategoryColor = () => {
    // This would normally come from the store
    const categoryColors: Record<string, string> = {
      'Groceries': '#4CAF50',
      'Dining': '#FF9800',
      'Transportation': '#2196F3',
      'Entertainment': '#9C27B0',
      'Shopping': '#F44336',
      'Utilities': '#607D8B',
      'Healthcare': '#00BCD4',
      'Other': '#9E9E9E',
    };
    
    return categoryColors[category] || '#9E9E9E';
  };

  return (
    <Link to={`/receipt/${id}`}>
      <Card className={cn(
        'overflow-hidden transition-all duration-200 hover:shadow-md',
        className
      )}>
        <div className="relative">
          {imageUrl ? (
            <div className="h-40 overflow-hidden">
              <img 
                src={imageUrl} 
                alt={merchant} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
          ) : (
            <div 
              className="h-40 flex items-center justify-center bg-muted"
              style={{ backgroundColor: getCategoryColor() + '20' }}
            >
              <span className="text-2xl font-bold text-muted-foreground">{merchant.charAt(0)}</span>
            </div>
          )}
          
          <div className="absolute top-2 right-2">
            <Badge 
              variant="secondary"
              className="font-medium"
              style={{ 
                backgroundColor: getCategoryColor() + '30',
                color: getCategoryColor(),
                borderColor: getCategoryColor() + '50'
              }}
            >
              {category}
            </Badge>
          </div>
        </div>
        
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-2 truncate">{merchant}</h3>
          
          <div className="flex justify-between text-sm text-muted-foreground">
            <div className="flex items-center">
              <FiCalendar className="mr-1 h-3 w-3" />
              <span>{formatDate(date, 'short')}</span>
            </div>
            
            <div className="font-medium text-foreground">
              {formatCurrency(amount)}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ReceiptCard;
