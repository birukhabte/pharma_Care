'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AppLogo from '@/components/ui/AppLogo';
import { LayoutDashboard, Pill, ShoppingCart, BarChart3, Package, Users, Settings, ChevronLeft, ChevronRight, LogOut, Truck, ClipboardList,  } from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
  group: string;
}

const navItems: NavItem[] = [
  {
    id: 'nav-dashboard',
    label: 'Dashboard',
    href: '/dashboard',
    icon: <LayoutDashboard size={18} />,
    group: 'main',
  },
  {
    id: 'nav-medicines',
    label: 'Medicines',
    href: '/medicine-management',
    icon: <Pill size={18} />,
    badge: 5,
    group: 'main',
  },
  {
    id: 'nav-sales',
    label: 'Sales / POS',
    href: '/sales',
    icon: <ShoppingCart size={18} />,
    group: 'main',
  },
  {
    id: 'nav-inventory',
    label: 'Inventory',
    href: '/inventory',
    icon: <Package size={18} />,
    group: 'main',
  },
  {
    id: 'nav-suppliers',
    label: 'Suppliers',
    href: '/suppliers',
    icon: <Truck size={18} />,
    group: 'main',
  },
  {
    id: 'nav-prescriptions',
    label: 'Prescriptions',
    href: '/prescriptions',
    icon: <ClipboardList size={18} />,
    badge: 3,
    group: 'main',
  },
  {
    id: 'nav-reports',
    label: 'Reports',
    href: '/reports',
    icon: <BarChart3 size={18} />,
    group: 'analytics',
  },
  {
    id: 'nav-customers',
    label: 'Customers',
    href: '/customers',
    icon: <Users size={18} />,
    group: 'analytics',
  },
  {
    id: 'nav-settings',
    label: 'Settings',
    href: '/settings',
    icon: <Settings size={18} />,
    group: 'system',
  },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  const groupedItems = {
    main: navItems.filter((i) => i.group === 'main'),
    analytics: navItems.filter((i) => i.group === 'analytics'),
    system: navItems.filter((i) => i.group === 'system'),
  };

  return (
    <aside
      className={`
        fixed left-0 top-0 h-screen bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 z-30 flex flex-col
        transition-all duration-300 ease-in-out
        ${collapsed ? 'w-16' : 'w-60'}
      `}
    >
      {/* Logo */}
      <div
        className={`flex items-center h-16 border-b border-slate-100 dark:border-slate-700 px-3 flex-shrink-0 ${
          collapsed ? 'justify-center' : 'gap-2'
        }`}
      >
        <AppLogo size={32} />
        {!collapsed && (
          <span className="font-semibold text-slate-800 dark:text-slate-200 text-base tracking-tight truncate">
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
      <div className="border-t border-slate-100 dark:border-slate-700 p-2 flex-shrink-0">
        {!collapsed ? (
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer group">
            <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-semibold text-teal-700 dark:text-teal-300">RP</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">Ravi Patel</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 truncate">Head Pharmacist</p>
            </div>
            <LogOut
              size={14}
              className="text-slate-400 dark:text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity"
            />
          </div>
        ) : (
          <div className="flex justify-center py-2" title="Ravi Patel — Head Pharmacist">
            <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center cursor-pointer hover:bg-teal-200 dark:hover:bg-teal-800 transition-colors">
              <span className="text-sm font-semibold text-teal-700 dark:text-teal-300">RP</span>
            </div>
          </div>
        )}
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-20 w-6 h-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full flex items-center justify-center shadow-sm hover:bg-teal-50 dark:hover:bg-teal-900/30 hover:border-teal-300 dark:hover:border-teal-700 transition-all duration-150 z-10"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? (
          <ChevronRight size={12} className="text-slate-500 dark:text-slate-400" />
        ) : (
          <ChevronLeft size={12} className="text-slate-500 dark:text-slate-400" />
        )}
      </button>
    </aside>
  );
}