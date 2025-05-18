import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiSearch, FiFilter, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useReceiptStore } from '@/store/useReceiptStore';
import { Receipt } from '@/types';

const ReceiptsList = () => {
  const { receipts, categories, setFilters, filters } = useReceiptStore();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Handle search and filtering
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ search: e.target.value });
    setCurrentPage(1);
  };
  
  const handleCategoryChange = (value: string) => {
    setFilters({ category: value });
    setCurrentPage(1);
  };
  
  const handleSortChange = (value: string) => {
    const [sortBy, sortOrder] = value.split('-') as [
      'date' | 'amount' | 'merchant',
      'asc' | 'desc'
    ];
    setFilters({ sortBy, sortOrder });
  };
  
  // Filter and sort receipts
  const filteredReceipts = receipts.filter((receipt) => {
    const matchesSearch = filters.search
      ? receipt.merchant.toLowerCase().includes(filters.search.toLowerCase()) ||
        receipt.category.toLowerCase().includes(filters.search.toLowerCase())
      : true;
    
    const matchesCategory = filters.category
      ? receipt.category === filters.category
      : true;
    
    return matchesSearch && matchesCategory;
  });
  
  // Sort receipts
  const sortedReceipts = [...filteredReceipts].sort((a, b) => {
    if (filters.sortBy === 'date') {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return filters.sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    }
    
    if (filters.sortBy === 'amount') {
      return filters.sortOrder === 'asc' 
        ? a.amount - b.amount 
        : b.amount - a.amount;
    }
    
    // Sort by merchant name
    const merchantA = a.merchant.toLowerCase();
    const merchantB = b.merchant.toLowerCase();
    return filters.sortOrder === 'asc'
      ? merchantA.localeCompare(merchantB)
      : merchantB.localeCompare(merchantA);
  });
  
  // Pagination
  const totalPages = Math.ceil(sortedReceipts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedReceipts = sortedReceipts.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  
  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Receipts</h1>
        <Button asChild>
          <Link to="/upload">
            <FiPlus className="mr-2" />
            Add Receipt
          </Link>
        </Button>
      </div>
      
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          </div>
        </CardContent>
      </Card>
      
      {/* Receipts Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Merchant</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedReceipts.length > 0 ? (
                paginatedReceipts.map((receipt) => (
                  <TableRow key={receipt.id}>
                    <TableCell>
                      <Link 
                        to={`/receipt/${receipt.id}`}
                        className="font-medium hover:underline"
                      >
                        {receipt.merchant}
                      </Link>
                    </TableCell>
                    <TableCell>{formatDate(receipt.date)}</TableCell>
                    <TableCell>{receipt.category}</TableCell>
                    <TableCell className="text-right">
                      ${receipt.amount.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    No receipts found. Try adjusting your filters or add a new receipt.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              />
            </PaginationItem>
            
            {Array.from({ length: totalPages }).map((_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  onClick={() => setCurrentPage(index + 1)}
                  isActive={currentPage === index + 1}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            
            <PaginationItem>
              <PaginationNext
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default ReceiptsList;
