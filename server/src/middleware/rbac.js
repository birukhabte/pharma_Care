// Role-Based Access Control (RBAC) Middleware

const PERMISSIONS = {
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
    medicines: ['read'],
    sales: ['create', 'read'],
    reports: ['read'],
    dashboard: ['read']
  },
  
  // Inventory Manager - Stock management
  inventory_manager: {
    medicines: ['create', 'read', 'update'],
    sales: ['read'],
    reports: ['read'],
    suppliers: ['read', 'update'],
    dashboard: ['read']
  }
};

// Check if user has permission for a resource and action
const hasPermission = (role, resource, action) => {
  const rolePermissions = PERMISSIONS[role];
  if (!rolePermissions) return false;
  
  const resourcePermissions = rolePermissions[resource];
  if (!resourcePermissions) return false;
  
  return resourcePermissions.includes(action);
};

// Middleware to check permissions
const checkPermission = (resource, action) => {
  return (req, res, next) => {
    const userRole = req.user?.role;
    
    if (!userRole) {
      return res.status(401).json({ error: 'Unauthorized - No role found' });
    }
    
    if (!hasPermission(userRole, resource, action)) {
      return res.status(403).json({ 
        error: 'Forbidden - Insufficient permissions',
        required: `${resource}:${action}`,
        role: userRole
      });
    }
    
    next();
  };
};

// Middleware to restrict to specific roles
const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user?.role;
    
    if (!userRole) {
      return res.status(401).json({ error: 'Unauthorized - No role found' });
    }
    
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ 
        error: 'Forbidden - Role not allowed',
        required: allowedRoles,
        current: userRole
      });
    }
    
    next();
  };
};

module.exports = {
  PERMISSIONS,
  hasPermission,
  checkPermission,
  requireRole
};
// Commit on 2024-06-10 at 12:7
