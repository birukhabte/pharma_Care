'use client';

import React from 'react';
import * as Icons from './Icons';

type IconVariant = 'outline' | 'solid';

interface IconProps {
    name: string;
    variant?: IconVariant;
    size?: number;
    className?: string;
    onClick?: () => void;
    disabled?: boolean;
    [key: string]: any;
}

// Map of available icons from our Icons component
const iconMap = {
  outline: {
    'QuestionMarkCircleIcon': Icons.AlertTriangle, // Using AlertTriangle as fallback
    'HomeIcon': Icons.Home,
    'UserIcon': Icons.Users,
    'CogIcon': Icons.Settings,
    'ChartBarIcon': Icons.Package, // Using Package as chart substitute
    'DocumentTextIcon': Icons.Package,
    'ShoppingCartIcon': Icons.Package,
    'UsersIcon': Icons.Users,
    'BuildingStorefrontIcon': Icons.Package,
    'ClipboardDocumentListIcon': Icons.Package,
    'Cog6ToothIcon': Icons.Settings,
    'PlusIcon': Icons.Plus,
    'PencilIcon': Icons.Pencil,
    'TrashIcon': Icons.Trash2,
    'EyeIcon': Icons.EyeIcon,
    'MagnifyingGlassIcon': Icons.SearchIcon,
    'BellIcon': Icons.Bell,
    'ArrowRightOnRectangleIcon': Icons.ChevronRight,
    // Additional common icons
    'AlertTriangle': Icons.AlertTriangle,
    'Search': Icons.SearchIcon,
    'Menu': Icons.Menu,
    'X': Icons.X,
    'Check': Icons.Check,
    'ChevronUp': Icons.ChevronUp,
    'ChevronDown': Icons.ChevronDown,
    'ChevronLeft': Icons.ChevronLeft,
    'ChevronRight': Icons.ChevronRight,
    'Filter': Icons.Filter,
    'Package': Icons.Package
  },
  solid: {
    'HomeIcon': Icons.Home,
    'UserIcon': Icons.Users,
    'CogIcon': Icons.Settings,
    'ChartBarIcon': Icons.Package,
    'DocumentTextIcon': Icons.Package,
    'ShoppingCartIcon': Icons.Package,
    'UsersIcon': Icons.Users,
    'BuildingStorefrontIcon': Icons.Package,
    'ClipboardDocumentListIcon': Icons.Package,
    'Cog6ToothIcon': Icons.Settings
  }
};

function Icon({
    name,
    variant = 'outline',
    size = 24,
    className = '',
    onClick,
    disabled = false,
    ...props
}: IconProps) {
    const IconComponent = iconMap[variant][name as keyof typeof iconMap[typeof variant]];

    if (!IconComponent) {
        // Fallback to AlertTriangle for unknown icons
        return (
            <Icons.AlertTriangle
                size={size}
                className={`text-gray-400 ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
                onClick={disabled ? undefined : onClick}
                {...props}
            />
        );
    }

    return (
        <IconComponent
            size={size}
            className={`${disabled ? 'opacity-50 cursor-not-allowed' : onClick ? 'cursor-pointer hover:opacity-80' : ''} ${className}`}
            onClick={disabled ? undefined : onClick}
            {...props}
        />
    );
}

export default Icon; 