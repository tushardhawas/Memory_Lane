import React from 'react';
import { FiSearch, FiFilter, FiCalendar } from 'react-icons/fi';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { useReceiptStore } from '@/store/useReceiptStore';
import { ReceiptFilters as ReceiptFiltersType } from '@/types';

interface ReceiptFiltersProps {
  onFiltersChange?: (filters: Partial<ReceiptFiltersType>) => void;
  className?: string;
}

const ReceiptFilters = ({ onFiltersChange, className }: ReceiptFiltersProps) => {
  const { categories, filters, setFilters, resetFilters } = useReceiptStore();
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFilters = { search: e.target.value };
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };
  
  const handleCategoryChange = (value: string) => {
    const newFilters = { category: value };
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };
  
  const handleSortChange = (value: string) => {
    const [sortBy, sortOrder] = value.split('-') as [
      'date' | 'amount' | 'merchant',
      'asc' | 'desc'
    ];
    const newFilters = { sortBy, sortOrder };
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };
  
  const handleDateRangeChange = (dateRange: { from: Date | undefined; to: Date | undefined }) => {
    const newFilters = { dateRange };
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };
  
  const handleReset = () => {
    resetFilters();
    onFiltersChange?.({}); // Reset with empty filters
  };

  return (
    <div className={className}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search receipts..."
            className="pl-10"
            value={filters.search}
            onChange={handleSearchChange}
          />
        </div>
        
        {/* Category Filter */}
        <Select value={filters.category} onValueChange={handleCategoryChange}>
          <SelectTrigger>
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.name}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {/* Sort */}
        <Select 
          value={`${filters.sortBy}-${filters.sortOrder}`}
          onValueChange={handleSortChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date-desc">Newest First</SelectItem>
            <SelectItem value="date-asc">Oldest First</SelectItem>
            <SelectItem value="amount-desc">Highest Amount</SelectItem>
            <SelectItem value="amount-asc">Lowest Amount</SelectItem>
            <SelectItem value="merchant-asc">Merchant (A-Z)</SelectItem>
            <SelectItem value="merchant-desc">Merchant (Z-A)</SelectItem>
          </SelectContent>
        </Select>
        
        {/* Date Range */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal"
            >
              <FiCalendar className="mr-2 h-4 w-4" />
              {filters.dateRange?.from ? (
                filters.dateRange.to ? (
                  <>
                    {format(filters.dateRange.from, "LLL dd, y")} -{" "}
                    {format(filters.dateRange.to, "LLL dd, y")}
                  </>
                ) : (
                  format(filters.dateRange.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={filters.dateRange?.from}
              selected={filters.dateRange}
              onSelect={handleDateRangeChange}
              numberOfMonths={2}
            />
            <div className="p-3 border-t">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleDateRangeChange({ from: undefined, to: undefined })}
                className="w-full"
              >
                Clear Date Range
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      
      {/* Reset Filters */}
      <div className="mt-4 flex justify-end">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleReset}
          className="flex items-center"
        >
          <FiFilter className="mr-2 h-4 w-4" />
          Reset Filters
        </Button>
      </div>
    </div>
  );
};

export default ReceiptFilters;
