import { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line
} from 'recharts';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { FiCalendar, FiDownload } from 'react-icons/fi';
import { useReceiptStore } from '@/store/useReceiptStore';

const Reports = () => {
  const { receipts, categories } = useReceiptStore();
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  
  // Filter receipts based on date range or year/month
  const filteredReceipts = receipts.filter((receipt) => {
    const receiptDate = new Date(receipt.date);
    
    // Filter by date range if set
    if (dateRange.from && dateRange.to) {
      return receiptDate >= dateRange.from && receiptDate <= dateRange.to;
    }
    
    // Filter by year
    const year = receiptDate.getFullYear().toString();
    if (year !== selectedYear) {
      return false;
    }
    
    // Filter by month if not 'all'
    if (selectedMonth !== 'all') {
      const month = receiptDate.getMonth().toString();
      if (month !== selectedMonth) {
        return false;
      }
    }
    
    return true;
  });
  
  // Calculate total amount
  const totalAmount = filteredReceipts.reduce((sum, receipt) => sum + receipt.amount, 0);
  
  // Calculate monthly data for bar chart
  const monthlyData = filteredReceipts.reduce((acc: Record<string, number>, receipt) => {
    const month = new Date(receipt.date).toLocaleString('default', { month: 'short' });
    if (!acc[month]) {
      acc[month] = 0;
    }
    acc[month] += receipt.amount;
    return acc;
  }, {});
  
  const monthlyChartData = Object.entries(monthlyData).map(([month, amount]) => ({
    month,
    amount
  }));
  
  // Calculate category data for pie chart
  const categoryData = filteredReceipts.reduce((acc: Record<string, number>, receipt) => {
    if (!acc[receipt.category]) {
      acc[receipt.category] = 0;
    }
    acc[receipt.category] += receipt.amount;
    return acc;
  }, {});
  
  interface PieChartDataItem {
    name: string;
    value: number;
    color: string;
  }
  
  const pieChartData = Object.entries(categoryData).map(([name, value]) => {
    const category = categories.find((c) => c.name === name);
    return {
      name,
      value,
      color: category?.color || '#9E9E9E'
    } as PieChartDataItem;
  });
  
  // Calculate daily data for line chart
  const dailyData = filteredReceipts.reduce((acc: Record<string, number>, receipt) => {
    const date = receipt.date;
    if (!acc[date]) {
      acc[date] = 0;
    }
    acc[date] += receipt.amount;
    return acc;
  }, {});
  
  const dailyChartData = Object.entries(dailyData)
    .map(([date, amount]) => ({
      date,
      amount
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  // Generate years for select
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => (currentYear - i).toString());
  
  // Generate months for select
  const months = [
    { value: 'all', label: 'All Months' },
    { value: '0', label: 'January' },
    { value: '1', label: 'February' },
    { value: '2', label: 'March' },
    { value: '3', label: 'April' },
    { value: '4', label: 'May' },
    { value: '5', label: 'June' },
    { value: '6', label: 'July' },
    { value: '7', label: 'August' },
    { value: '8', label: 'September' },
    { value: '9', label: 'October' },
    { value: '10', label: 'November' },
    { value: '11', label: 'December' },
  ];
  
  // Handle export
  const handleExportData = () => {
    const dataStr = JSON.stringify(filteredReceipts, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileDefaultName = `receipts-report-${new Date().toISOString().slice(0, 10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Reports</h1>
        <Button onClick={handleExportData}>
          <FiDownload className="mr-2" />
          Export Data
        </Button>
      </div>
      
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Reports</CardTitle>
          <CardDescription>Select a date range or filter by year and month</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="range" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="range">Date Range</TabsTrigger>
              <TabsTrigger value="yearMonth">Year & Month</TabsTrigger>
            </TabsList>
            
            <TabsContent value="range" className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <FiCalendar className="mr-2 h-4 w-4" />
                        {dateRange.from ? (
                          dateRange.to ? (
                            <>
                              {format(dateRange.from, "LLL dd, y")} -{" "}
                              {format(dateRange.to, "LLL dd, y")}
                            </>
                          ) : (
                            format(dateRange.from, "LLL dd, y")
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
                        defaultMonth={dateRange.from}
                        selected={dateRange}
                        onSelect={setDateRange}
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <Button 
                  variant="outline" 
                  onClick={() => setDateRange({ from: undefined, to: undefined })}
                >
                  Reset
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="yearMonth" className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Year" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year} value={year}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Month" />
                    </SelectTrigger>
                    <SelectContent>
                      {months.map((month) => (
                        <SelectItem key={month.value} value={month.value}>
                          {month.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
          <CardDescription>
            {dateRange.from && dateRange.to
              ? `${format(dateRange.from, "LLL dd, y")} - ${format(dateRange.to, "LLL dd, y")}`
              : selectedMonth !== 'all'
                ? `${months.find(m => m.value === selectedMonth)?.label} ${selectedYear}`
                : `All months in ${selectedYear}`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <div className="text-4xl font-bold">${totalAmount.toFixed(2)}</div>
            <div className="text-sm text-muted-foreground mt-1">
              Total from {filteredReceipts.length} receipts
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Expenses</CardTitle>
            <CardDescription>Your spending by month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Amount']}
                  />
                  <Bar dataKey="amount" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Spending by Category</CardTitle>
            <CardDescription>How your expenses are distributed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Amount']}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Daily Spending</CardTitle>
            <CardDescription>Your spending over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Amount']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#8884d8" 
                    activeDot={{ r: 8 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
