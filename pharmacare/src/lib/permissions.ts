// Frontend Role-Based Access Control

export type Role = 'admin' | 'pharmacist' | 'inventory_manager';
export type Resource = 'users' | 'medicines' | 'sales' | 'reports' | 'suppliers' | 'settings' | 'dashboard';
export type Action = 'create' | 'read' | 'update' | 'delete' | 'export';

const PERMISSIONS: Record<Role, Record<Resource, Action[]>> = {
  // Admin - Full control
  admin: {
    users: ['create', 'read', 'update', 'delete'],
    medicines: ['create', 'read', 'update', 'delete'],
    sales: ['create', 'read', 'update', 'delete'],
    reports: ['read', 'export'],
    suppliers: ['create', 'read', 'update', 'delete'],
    settings: ['read', 'update'],
    dashboard: ['read']
  },
  
  // Pharmacist - Daily operations
  pharmacist: {
    users: [],
    medicines: ['read'],
    sales: ['create', 'read'],
    reports: ['read'],
    suppliers: [],
    settings: [],
    dashboard: ['read']
  },
  
  // Inventory Manager - Stock management
  inventory_manager: {
    users: [],
    medicines: ['create', 'read', 'update'],
    sales: ['read'],
    reports: ['read'],
    suppliers: ['read', 'update'],
    settings: [],
    dashboard: ['read']
  }
};

export const hasPermission = (role: Role | string, resource: Resource, action: Action): boolean => {
  const rolePermissions = PERMISSIONS[role as Role];
  if (!rolePermissions) return false;
  
  const resourcePermissions = rolePermissions[resource];
  if (!resourcePermissions) return false;
  
  return resourcePermissions.includes(action);
};

export const canCreate = (role: Role | string, resource: Resource) => hasPermission(role, resource, 'create');
export const canRead = (role: Role | string, resource: Resource) => hasPermission(role, resource, 'read');
export const canUpdate = (role: Role | string, resource: Resource) => hasPermission(role, resource, 'update');
export const canDelete = (role: Role | string, resource: Resource) => hasPermission(role, resource, 'delete');
export const canExport = (role: Role | string, resource: Resource) => hasPermission(role, resource, 'export');

export const getUserRole = (): Role | null => {
  if (typeof window === 'undefined') return null;
  
  const user = localStorage.getItem('user');
  if (!user) return null;
  
  try {
    const userData = JSON.parse(user);
    return userData.role as Role;
  } catch {
    return null;
  }
};

export const checkAccess = (resource: Resource, action: Action): boolean => {
  const role = getUserRole();
  if (!role) return false;
  
  return hasPermission(role, resource, action);
};

// Role display names
export const ROLE_LABELS: Record<Role, string> = {
  admin: 'Administrator',
  pharmacist: 'Pharmacist',
  inventory_manager: 'Inventory Manager'
};

// Role descriptions
export const ROLE_DESCRIPTIONS: Record<Role, string> = {
  admin: 'Full system control - manage users, medicines, sales, and settings',
  pharmacist: 'Daily operations - view medicines, process sales, generate invoices',
  inventory_manager: 'Stock management - add/update medicines, track inventory, monitor expiry'
};
