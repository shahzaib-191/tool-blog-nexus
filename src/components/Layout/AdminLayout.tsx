
import { ReactNode, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  LogOut,
  Menu, 
  X 
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
}

const AdminLayout = ({ children, title }: AdminLayoutProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Redirect to login if not authenticated or not admin
  if (!user || !user.isAdmin) {
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { 
      label: 'Dashboard', 
      icon: <LayoutDashboard size={20} />, 
      path: '/admin' 
    },
    { 
      label: 'Blog Posts', 
      icon: <FileText size={20} />, 
      path: '/admin/blog' 
    },
    { 
      label: 'Users', 
      icon: <Users size={20} />, 
      path: '/admin/users' 
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col bg-gray-800 text-white w-64 p-4">
        <div className="flex items-center mb-6 space-x-2">
          <span className="text-xl font-bold">Admin Panel</span>
        </div>

        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center space-x-3 px-3 py-2.5 rounded-md hover:bg-gray-700"
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="border-t border-gray-700 pt-4 mt-4">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 text-red-400 hover:text-red-300 w-full px-3 py-2"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Mobile Header */}
        <header className="bg-white shadow-sm p-4 flex justify-between items-center md:hidden">
          <div className="flex items-center">
            <button 
              className="mr-4"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <h1 className="text-xl font-semibold">Admin Panel</h1>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut size={16} />
          </Button>
        </header>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-gray-800 text-white p-4 animate-fade-in">
            <nav className="space-y-2">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex items-center space-x-3 px-3 py-2.5 rounded-md hover:bg-gray-700"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 p-6">
          <h1 className="text-2xl font-bold mb-6">{title}</h1>
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
