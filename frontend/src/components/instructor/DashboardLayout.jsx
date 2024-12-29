import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, BookOpen, Users, Settings, 
  LogOut, Menu, X, Bell, Search, ChevronRight
} from 'lucide-react';

// Custom Button Component
const Button = ({ children, variant = "default", size = "default", className = "", ...props }) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  
  const variants = {
    default: "bg-gray-900 text-white hover:bg-gray-800",
    outline: "border border-gray-200 bg-white hover:bg-gray-100",
    ghost: "hover:bg-gray-100",
    destructive: "bg-red-600 text-white hover:bg-red-700"
  };
  
  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 px-3",
    lg: "h-11 px-8",
    icon: "h-10 w-10"
  };
  
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Custom Badge Component
const Badge = ({ children, variant = "default", className = "" }) => {
  const variants = {
    default: "bg-primary text-white",
    secondary: "bg-gray-100 text-gray-900"
  };
  
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const navigation = [
    { 
      name: 'Dashboard', 
      href: '/dashboard', 
      icon: LayoutDashboard,
      badge: 'New'
    },
    { 
      name: 'Courses', 
      href: '/dashboard/courses', 
      icon: BookOpen,
      badge: '5'
    },
    { 
      name: 'Students', 
      href: '/dashboard/students', 
      icon: Users 
    },
    { 
      name: 'Settings', 
      href: '/dashboard/settings', 
      icon: Settings 
    },
  ];

  const NavLink = ({ item }) => {
    const isActive = location.pathname === item.href;
    
    return (
      <Link
        to={item.href}
        className={`
          group relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
          ${isActive 
            ? 'bg-blue-50 text-blue-600 hover:bg-blue-100' 
            : 'text-gray-600 hover:bg-gray-100'
          }
        `}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <item.icon className={`w-5 h-5 transition-colors ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
        <span className={`flex-1 font-medium ${!isSidebarOpen && 'hidden'}`}>
          {item.name}
        </span>
        {item.badge && (
          <Badge variant={isActive ? "default" : "secondary"} className={!isSidebarOpen && 'hidden'}>
            {item.badge}
          </Badge>
        )}
        {!isSidebarOpen && (
          <div className="absolute left-full rounded-md px-2 py-1 ml-6 bg-gray-900 text-xs text-white
            invisible opacity-0 -translate-x-3 group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
            transition-all">
            {item.name}
          </div>
        )}
      </Link>
    );
  };

  const MobileMenu = () => (
    <>
      <div
        className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-200
          ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}
        onClick={() => setIsMobileMenuOpen(false)}
      />
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-72 bg-white shadow-xl
          transition-transform duration-300 ease-in-out lg:hidden
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <img src="/logo.svg" alt="Logo" className="w-8 h-8" />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                Elimu Global
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {navigation.map((item) => (
              <NavLink key={item.name} item={item} />
            ))}
          </nav>
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-10 h-10">
                <img
                  src="/avatar.jpg"
                  alt="Profile"
                  className="rounded-full object-cover"
                />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">John Doe</p>
                <p className="text-xs text-gray-500">instructor@elimu.com</p>
              </div>
            </div>
            <Button 
              variant="destructive" 
              className="w-full justify-center"
              onClick={() => {/* Add logout logic */}}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </aside>
    </>
  );

  const Sidebar = () => (
    <aside className={`
      fixed top-0 left-0 z-40 h-full bg-white border-r border-gray-200
      transition-all duration-300 ease-in-out hidden lg:block
      ${isSidebarOpen ? 'w-64' : 'w-20'}
    `}>
      <div className="flex h-full flex-col">
        <div className="flex items-center gap-3 px-6 h-16 border-b border-gray-200">
          <img src="/logo.svg" alt="Logo" className="w-8 h-8" />
          {isSidebarOpen && (
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              Elimu Global
            </span>
          )}
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navigation.map((item) => (
            <NavLink key={item.name} item={item} />
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className={`flex items-center gap-3 mb-4 ${!isSidebarOpen && 'justify-center'}`}>
            <div className="relative w-10 h-10">
              <img
                src="/avatar.jpg"
                alt="Profile"
                className="rounded-full object-cover"
              />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
            </div>
            {isSidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">John Doe</p>
                <p className="text-xs text-gray-500">instructor@elimu.com</p>
              </div>
            )}
          </div>
          <Button 
            variant="destructive" 
            className={`w-full ${!isSidebarOpen && 'px-2 py-2'}`}
            onClick={() => {/* Add logout logic */}}
          >
            <LogOut className="w-4 h-4" />
            {isSidebarOpen && <span className="ml-2">Logout</span>}
          </Button>
        </div>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Menu Button */}
      <Button
        variant="outline"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setIsMobileMenuOpen(true)}
      >
        <Menu className="w-5 h-5" />
      </Button>

      {/* Mobile Menu */}
      <MobileMenu />

      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className={`
        transition-all duration-300 ease-in-out
        ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}
      `}>
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
          <div className="flex items-center gap-4 px-4 h-16">
            {/* Desktop Sidebar Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden lg:flex"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <Menu className="w-5 h-5" />
            </Button>

            {/* Search Bar */}
            <div className="flex-1 max-w-xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search anything..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg 
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    transition-all"
                />
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
              </Button>
              
              <div className="hidden sm:flex items-center gap-3">
                <div className="relative w-8 h-8">
                  <img
                    src="/avatar.jpg"
                    alt="Profile"
                    className="rounded-full object-cover"
                  />
                  <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-400 rounded-full border-2 border-white" />
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium">John Doe</p>
                  <p className="text-xs text-gray-500">Instructor</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;