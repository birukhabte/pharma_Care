// Frontend Role-Based Access Control

export type Role = 'admin' | 'pharmacist' | 'inventory_manager';
export type Resource = 'users' | 'medicines' | 'sales' | 'reports' | 'suppliers' | 'settings' | 'dashboard' | 'customers' | 'prescriptions' | 'inventory';
export type Action = 'create' | 'read' | 'update' | 'delete' | 'export';

const PERMISSIONS: Record<Role, Record<Resource, Action[]>> = {
  // Admin - Full control
  admin: {
    users: ['create', 'read', 'update', 'delete'],
    medicines: ['create', 'read', 'update', 'delete'],
    sales: ['create', 'read', 'update', 'delete', 'export'],
    reports: ['read', 'export'],
    suppliers: ['create', 'read', 'update', 'delete'],
    settings: ['read', 'update'],
    dashboard: ['read'],
    customers: ['create', 'read', 'update', 'delete'],
    prescriptions: ['create', 'read', 'update', 'delete'],
    inventory: ['create', 'read', 'update', 'delete']
  },
  
  // Pharmacist - Daily operations
  pharmacist: {
    users: [],
    medicines: ['read'],
    sales: ['create', 'read'],
    reports: ['read'],
    suppliers: [],
    settings: [],
    dashboard: ['read'],
    customers: ['read'],
    prescriptions: ['create', 'read', 'update'],
    inventory: ['read']
  },
  
  // Inventory Manager - Stock management
  inventory_manager: {
    users: [],
    medicines: ['create', 'read', 'update'],
    sales: [],
    reports: ['read', 'export'],
    suppliers: ['create', 'read', 'update'],
    settings: [],
    dashboard: ['read'],
    customers: [],
    prescriptions: [],
    inventory: ['create', 'read', 'update', 'delete']
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

// Custom hook for permissions
export const usePermissions = () => {
  const role = getUserRole();
  
  return {
    role,
    canCreate: (resource: Resource) => role ? canCreate(role, resource) : false,
    canRead: (resource: Resource) => role ? canRead(role, resource) : false,
    canUpdate: (resource: Resource) => role ? canUpdate(role, resource) : false,
    canDelete: (resource: Resource) => role ? canDelete(role, resource) : false,
    canExport: (resource: Resource) => role ? canExport(role, resource) : false,
    hasPermission: (resource: Resource, action: Action) => role ? hasPermission(role, resource, action) : false,
  };
};
// Commit on 2024-06-8 at 9:26
