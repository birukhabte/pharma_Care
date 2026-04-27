'use client';

import React from 'react';
import { 
  QuestionMarkCircleIcon,
  HomeIcon,
  UserIcon,
  CogIcon,
  ChartBarIcon,
  DocumentTextIcon,
  ShoppingCartIcon,
  UsersIcon,
  BuildingStorefrontIcon,
  ClipboardDocumentListIcon,
  Cog6ToothIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  BellIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

import {
  HomeIcon as HomeIconSolid,
  UserIcon as UserIconSolid,
  CogIcon as CogIconSolid,
  ChartBarIcon as ChartBarIconSolid,
  DocumentTextIcon as DocumentTextIconSolid,
  ShoppingCartIcon as ShoppingCartIconSolid,
  UsersIcon as UsersIconSolid,
  BuildingStorefrontIcon as BuildingStorefrontIconSolid,
  ClipboardDocumentListIcon as ClipboardDocumentListIconSolid,
  Cog6ToothIcon as Cog6ToothIconSolid
} from '@heroicons/react/24/solid';

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

const iconMap = {
  outline: {
    'QuestionMarkCircleIcon': QuestionMarkCircleIcon,
    'HomeIcon': HomeIcon,
    'UserIcon': UserIcon,
    'CogIcon': CogIcon,
    'ChartBarIcon': ChartBarIcon,
    'DocumentTextIcon': DocumentTextIcon,
    'ShoppingCartIcon': ShoppingCartIcon,
    'UsersIcon': UsersIcon,
    'BuildingStorefrontIcon': BuildingStorefrontIcon,
    'ClipboardDocumentListIcon': ClipboardDocumentListIcon,
    'Cog6ToothIcon': Cog6ToothIcon,
    'PlusIcon': PlusIcon,
    'PencilIcon': PencilIcon,
    'TrashIcon': TrashIcon,
    'EyeIcon': EyeIcon,
    'MagnifyingGlassIcon': MagnifyingGlassIcon,
    'BellIcon': BellIcon,
    'ArrowRightOnRectangleIcon': ArrowRightOnRectangleIcon
  },
  solid: {
    'HomeIcon': HomeIconSolid,
    'UserIcon': UserIconSolid,
    'CogIcon': CogIconSolid,
    'ChartBarIcon': ChartBarIconSolid,
    'DocumentTextIcon': DocumentTextIconSolid,
    'ShoppingCartIcon': ShoppingCartIconSolid,
    'UsersIcon': UsersIconSolid,
    'BuildingStorefrontIcon': BuildingStorefrontIconSolid,
    'ClipboardDocumentListIcon': ClipboardDocumentListIconSolid,
    'Cog6ToothIcon': Cog6ToothIconSolid
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
        return (
            <QuestionMarkCircleIcon
                width={size}
                height={size}
                className={`text-gray-400 ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
                onClick={disabled ? undefined : onClick}
                {...props}
            />
        );
    }

    return (
        <IconComponent
            width={size}
            height={size}
            className={`${disabled ? 'opacity-50 cursor-not-allowed' : onClick ? 'cursor-pointer hover:opacity-80' : ''} ${className}`}
            onClick={disabled ? undefined : onClick}
            {...props}
        />
    );
}

export default Icon; 