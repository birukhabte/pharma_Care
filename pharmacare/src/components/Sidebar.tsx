'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import AppLogo from '@/components/ui/AppLogo';
import { getUserRole, canRead, ROLE_LABELS } from '@/lib/permissions';
import { api } from '@/lib/api';
import { LayoutDashboard, Pill, ShoppingCart, BarChart3, Package, Users, Settings, ChevronLeft, ChevronRight, LogOut, Truck, ClipboardList, UserCog } from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
  group: string;
  resource: string; // For permission checking
  requiredRoles?: string[]; // Optional: specific roles that can see this
}

const navItems: NavItem[] = [
  {
    id: 'nav-dashboard',
    label: 'Dashboard',
    href: '/dashboard',
    icon: <LayoutDashboard size={18} />,
    group: 'main',
    resource: 'dashboard',
  },
  {
    id: 'nav-medicines',
    label: 'Medicines',
    href: '/medicine-management',
    icon: <Pill size={18} />,
    badge: 5,
    group: 'main',
    resource: 'medicines',
  },
  {
    id: 'nav-sales',
    label: 'Sales / POS',
    href: '/sales',
    icon: <ShoppingCart size={18} />,
    group: 'main',
    resource: 'sales',
    requiredRoles: ['admin', 'pharmacist'],
  },
  {
    id: 'nav-inventory',
    label: 'Inventory',
    href: '/inventory',
    icon: <Package size={18} />,
    group: 'main',
    resource: 'inventory',
    requiredRoles: ['admin', 'inventory_manager'],
  },
  {
    id: 'nav-suppliers',
    label: 'Suppliers',
    href: '/suppliers',
    icon: <Truck size={18} />,
    group: 'main',
    resource: 'suppliers',
    requiredRoles: ['admin', 'inventory_manager'],
  },
  {
    id: 'nav-prescriptions',
    label: 'Prescriptions',
    href: '/prescriptions',
    icon: <ClipboardList size={18} />,
    badge: 3,
    group: 'main',
    resource: 'prescriptions',
    requiredRoles: ['admin', 'pharmacist'],
  },
  {
    id: 'nav-reports',
    label: 'Reports',
    href: '/reports',
    icon: <BarChart3 size={18} />,
    group: 'analytics',
    resource: 'reports',
  },
  {
    id: 'nav-customers',
    label: 'Customers',
    href: '/customers',
    icon: <Users size={18} />,
    group: 'analytics',
    resource: 'customers',
    requiredRoles: ['admin', 'pharmacist'],
  },
  {
    id: 'nav-users',
    label: 'User Management',
    href: '/users',
    icon: <UserCog size={18} />,
    group: 'system',
    resource: 'users',
    requiredRoles: ['admin'],
  },
  {
    id: 'nav-settings',
    label: 'Settings',
    href: '/settings',
    icon: <Settings size={18} />,
    group: 'system',
    resource: 'settings',
    requiredRoles: ['admin'],
  },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userName, setUserName] = useState('User');
  const [userInitials, setUserInitials] = useState('U');
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const role = getUserRole();
    setUserRole(role);

    // Get user info from localStorage - only on client
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          setUserName(user.fullName || 'User');
          const initials = user.fullName
            ? user.fullName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()
            : 'U';
          setUserInitials(initials);
        } catch (e) {
          // Ignore parse errors
        }
      }
      
      // Check theme
      const checkTheme = () => {
        setIsDark(document.documentElement.classList.contains('dark'));
      };
      
      checkTheme();
      
      // Watch for theme changes
      const observer = new MutationObserver(checkTheme);
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class']
      });
      
      return () => observer.disconnect();
    }
  }, []);

  const handleLogout = () => {
    api.logout();
    router.push('/sign-up-login-screen');
  };

  // Filter nav items based on user role
  const visibleNavItems = navItems.filter((item) => {
    // Check if user has permission to read this resource
    if (!canRead(userRole || '', item.resource as any)) {
      return false;
    }

    // Check if specific roles are required
    if (item.requiredRoles && userRole) {
      return item.requiredRoles.includes(userRole);
    }

    return true;
  });

  const groupedItems = {
    main: visibleNavItems.filter((i) => i.group === 'main'),
    analytics: visibleNavItems.filter((i) => i.group === 'analytics'),
    system: visibleNavItems.filter((i) => i.group === 'system'),
  };

  return (
    <aside
      className={`
        fixed left-0 top-0 h-screen bg-white border-r border-slate-200 z-30 flex flex-col
        transition-all duration-300 ease-in-out
        ${collapsed ? 'w-16' : 'w-60'}
      `}
    >
      {/* Logo */}
      <div
        className={`flex items-center h-16 border-b border-slate-100 px-3 flex-shrink-0 ${
          collapsed ? 'justify-center' : 'gap-2'
        }`}
      >
        <AppLogo size={32} />
        {!collapsed && (
          <span className="font-semibold text-slate-800 text-base tracking-tight truncate">
            PharmaCare
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin py-3 px-2">
        {/* Main */}
        {!collapsed && (
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-3 mb-2">
            Main
          </p>
        )}
        <ul className="space-y-0.5 mb-4">
          {groupedItems.main.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.id}>
                <Link href={item.href} title={collapsed ? item.label : undefined}>
                  <span
                    className={`sidebar-nav-item ${
                      isActive ? 'sidebar-nav-item-active' : 'sidebar-nav-item-inactive'
                    } ${collapsed ? 'justify-center px-2' : ''}`}
                  >
                    <span className={isActive ? 'text-teal-700' : 'text-slate-400'}>
                      {item.icon}
                    </span>
                    {!collapsed && (
                      <span className="flex-1 truncate">{item.label}</span>
                    )}
                    {!collapsed && item.badge !== undefined && (
                      <span className="ml-auto bg-teal-100 text-teal-700 text-xs font-semibold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                        {item.badge}
                      </span>
                    )}
                    {collapsed && item.badge !== undefined && (
                      <span className="absolute top-1 right-1 w-2 h-2 bg-teal-500 rounded-full" />
                    )}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Analytics */}
        {!collapsed && (
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-3 mb-2">
            Analytics
          </p>
        )}
        {collapsed && <div className="border-t border-slate-100 dark:border-slate-700 my-2 mx-2" />}
        <ul className="space-y-0.5 mb-4">
          {groupedItems.analytics.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.id}>
                <Link href={item.href} title={collapsed ? item.label : undefined}>
                  <span
                    className={`sidebar-nav-item ${
                      isActive ? 'sidebar-nav-item-active' : 'sidebar-nav-item-inactive'
                    } ${collapsed ? 'justify-center px-2' : ''}`}
                  >
                    <span className={isActive ? 'text-teal-700' : 'text-slate-400'}>
                      {item.icon}
                    </span>
                    {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* System */}
        {!collapsed && (
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-3 mb-2">
            System
          </p>
        )}
        {collapsed && <div className="border-t border-slate-100 dark:border-slate-700 my-2 mx-2" />}
        <ul className="space-y-0.5">
          {groupedItems.system.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.id}>
                <Link href={item.href} title={collapsed ? item.label : undefined}>
                  <span
                    className={`sidebar-nav-item ${
                      isActive ? 'sidebar-nav-item-active' : 'sidebar-nav-item-inactive'
                    } ${collapsed ? 'justify-center px-2' : ''}`}
                  >
                    <span className={isActive ? 'text-teal-700' : 'text-slate-400'}>
                      {item.icon}
                    </span>
                    {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile */}
      {mounted && (
        <div className="border-t border-slate-100 p-2 flex-shrink-0">
          {!collapsed ? (
            <div 
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50 cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-teal-700">{userInitials}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 truncate">{userName}</p>
                <p className="text-xs text-slate-400 truncate">
                  {userRole ? ROLE_LABELS[userRole as keyof typeof ROLE_LABELS] : 'User'}
                </p>
              </div>
              <LogOut
                size={14}
                className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </div>
          ) : (
            <div 
              onClick={handleLogout}
              className="flex justify-center py-2" 
              title={`${userName} — ${userRole ? ROLE_LABELS[userRole as keyof typeof ROLE_LABELS] : 'User'}`}
            >
              <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center cursor-pointer hover:bg-teal-200 transition-colors">
                <span className="text-sm font-semibold text-teal-700">{userInitials}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Collapse Toggle */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-20 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-sm hover:bg-teal-50 hover:border-teal-300 transition-all duration-150 z-10"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? (
          <ChevronRight size={12} className="text-slate-500" />
        ) : (
          <ChevronLeft size={12} className="text-slate-500" />
        )}
      </button>
    </aside>
  );
}