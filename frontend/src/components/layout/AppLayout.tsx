import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FiHome, 
  FiUpload, 
  FiFolder, 
  FiPieChart, 
  FiSettings, 
  FiMenu, 
  FiX,
  FiLogOut,
  FiMoon,
  FiSun
} from 'react-icons/fi';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarTrigger, 
  SidebarContent, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarFooter 
} from '@/components/ui/sidebar';
import { useTheme } from '@/hooks/use-theme';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Toaster } from '@/components/ui/sonner';

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: FiHome },
    { name: 'Upload Receipt', href: '/upload', icon: FiUpload },
    { name: 'My Receipts', href: '/receipts', icon: FiFolder },
    { name: 'Reports', href: '/reports', icon: FiPieChart },
    { name: 'Settings', href: '/settings', icon: FiSettings },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    window.location.href = '/login';
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background">
        {/* Desktop Sidebar */}
        <Sidebar className="hidden md:flex">
          <SidebarContent>
            <SidebarHeader className="p-4">
              <div className="flex items-center">
                <img src="/receipt-icon.svg" alt="Logo" className="w-8 h-8 mr-2" />
                <h1 className="text-xl font-bold">Receipto</h1>
              </div>
            </SidebarHeader>
            
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.name} asChild>
                  <Link
                    to={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
                      isActive(item.href)
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
            
            <SidebarFooter className="mt-auto p-4">
              <div className="flex flex-col gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="justify-start"
                  onClick={toggleTheme}
                >
                  {theme === 'dark' ? (
                    <FiSun className="mr-2 h-4 w-4" />
                  ) : (
                    <FiMoon className="mr-2 h-4 w-4" />
                  )}
                  {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="justify-start text-destructive hover:text-destructive"
                  onClick={handleLogout}
                >
                  <FiLogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            </SidebarFooter>
          </SidebarContent>
        </Sidebar>

        {/* Mobile Header */}
        <div className="fixed top-0 left-0 right-0 z-30 bg-background border-b md:hidden">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <FiMenu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 p-0">
                  <div className="flex flex-col h-full">
                    <div className="p-4 border-b">
                      <div className="flex items-center">
                        <img src="/receipt-icon.svg" alt="Logo" className="w-8 h-8 mr-2" />
                        <h1 className="text-xl font-bold">Receipto</h1>
                      </div>
                    </div>
                    <div className="flex-1 overflow-auto py-2">
                      {navigation.map((item) => (
                        <Link
                          key={item.name}
                          to={item.href}
                          className={cn(
                            "flex items-center gap-3 mx-2 rounded-md px-3 py-2 text-sm font-medium",
                            isActive(item.href)
                              ? "bg-primary/10 text-primary"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          )}
                        >
                          <item.icon className="h-4 w-4" />
                          {item.name}
                        </Link>
                      ))}
                    </div>
                    <div className="p-4 border-t">
                      <div className="flex flex-col gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="justify-start"
                          onClick={toggleTheme}
                        >
                          {theme === 'dark' ? (
                            <FiSun className="mr-2 h-4 w-4" />
                          ) : (
                            <FiMoon className="mr-2 h-4 w-4" />
                          )}
                          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="justify-start text-destructive hover:text-destructive"
                          onClick={handleLogout}
                        >
                          <FiLogOut className="mr-2 h-4 w-4" />
                          Logout
                        </Button>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
              <img src="/receipt-icon.svg" alt="Logo" className="w-8 h-8 ml-2" />
              <h1 className="text-xl font-bold ml-2">Receipto</h1>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col md:ml-0">
          <main className="flex-1 pt-16 md:pt-0">
            {children}
          </main>
        </div>

        {/* Toast notifications */}
        <Toaster position="top-right" />
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
