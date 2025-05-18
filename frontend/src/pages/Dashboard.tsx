
import { Link } from 'react-router-dom';
import {
  FiPlus,
  FiArrowUp,
  FiArrowDown,
  FiDollarSign,
  FiShoppingBag,
  FiCalendar
} from 'react-icons/fi';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useReceiptStore } from '@/store/useReceiptStore';
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
  Legend
} from 'recharts';

const Dashboard = () => {
  const { receipts, categories } = useReceiptStore();

  // Calculate total amount
  const totalAmount = receipts.reduce((sum: number, receipt) => sum + receipt.amount, 0);

  // Get recent receipts (last 5)
  const recentReceipts = [...receipts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // Calculate monthly data for chart
  const monthlyData = receipts.reduce((acc: Record<string, number>, receipt) => {
    const month = new Date(receipt.date).toLocaleString('default', { month: 'short' });
    if (!acc[month]) {
      acc[month] = 0;
    }
    acc[month] += receipt.amount;
    return acc;
  }, {} as Record<string, number>);

  const monthlyChartData = Object.entries(monthlyData).map(([month, amount]) => ({
    month,
    amount
  }));

  // Calculate category data for pie chart
  const categoryData = receipts.reduce((acc: Record<string, number>, receipt) => {
    if (!acc[receipt.category]) {
      acc[receipt.category] = 0;
    }
    acc[receipt.category] += receipt.amount;
    return acc;
  }, {} as Record<string, number>);

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

  // Calculate stats
  const thisMonth = new Date().toLocaleString('default', { month: 'short' });
  const lastMonth = new Date(new Date().setMonth(new Date().getMonth() - 1))
    .toLocaleString('default', { month: 'short' });

  const thisMonthTotal = monthlyData[thisMonth] || 0;
  const lastMonthTotal = monthlyData[lastMonth] || 0;
  const percentChange = lastMonthTotal
    ? ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100
    : 0;

  // Find top category
  const topCategory = pieChartData.sort((a, b) => b.value - a.value)[0]?.name || 'None';

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button asChild>
          <Link to="/upload">
            <FiPlus className="mr-2" />
            Add Receipt
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Spending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <FiDollarSign className="mr-2 h-4 w-4 text-muted-foreground" />
              <div className="text-2xl font-bold">${totalAmount.toFixed(2)}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FiCalendar className="mr-2 h-4 w-4 text-muted-foreground" />
                <div className="text-2xl font-bold">${thisMonthTotal.toFixed(2)}</div>
              </div>
              <div className={`flex items-center ${percentChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {percentChange >= 0 ? (
                  <FiArrowUp className="mr-1 h-4 w-4" />
                ) : (
                  <FiArrowDown className="mr-1 h-4 w-4" />
                )}
                <span>{Math.abs(percentChange).toFixed(1)}%</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Compared to last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Top Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <FiShoppingBag className="mr-2 h-4 w-4 text-muted-foreground" />
              <div className="text-2xl font-bold">{topCategory}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Expenses</CardTitle>
            <CardDescription>Your spending over the past months</CardDescription>
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
      </div>

      {/* Recent Receipts */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Receipts</CardTitle>
          <CardDescription>Your latest transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {recentReceipts.length > 0 ? (
              recentReceipts.map((receipt) => (
                <Link
                  key={receipt.id}
                  to={`/receipt/${receipt.id}`}
                  className="block hover:bg-muted rounded-md p-3 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{receipt.merchant}</p>
                      <p className="text-sm text-muted-foreground">{receipt.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${receipt.amount.toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">{receipt.category}</p>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center py-4">
                <p className="text-muted-foreground">No receipts found. Add your first receipt!</p>
              </div>
            )}

            {recentReceipts.length > 0 && (
              <div className="pt-2 text-center">
                <Button variant="outline" asChild>
                  <Link to="/receipts">View All Receipts</Link>
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;