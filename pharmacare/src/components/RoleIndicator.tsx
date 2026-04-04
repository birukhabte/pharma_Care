'use client';

import { useEffect, useState } from 'react';
import { Shield, Crown, Package } from 'lucide-react';
import { getUserRole, ROLE_LABELS, ROLE_DESCRIPTIONS } from '@/lib/permissions';

export default function RoleIndicator() {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    setRole(getUserRole());
  }, []);

  if (!role) return null;

  const icons = {
    admin: <Crown size={16} className="text-amber-600" />,
    pharmacist: <Shield size={16} className="text-blue-600" />,
    inventory_manager: <Package size={16} className="text-teal-600" />,
  };

  const colors = {
    admin: 'bg-amber-50 border-amber-200 text-amber-800',
    pharmacist: 'bg-blue-50 border-blue-200 text-blue-800',
    inventory_manager: 'bg-teal-50 border-teal-200 text-teal-800',
  };

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border ${colors[role as keyof typeof colors]}`}>
      {icons[role as keyof typeof icons]}
      <div>
        <p className="text-xs font-semibold">{ROLE_LABELS[role as keyof typeof ROLE_LABELS]}</p>
        <p className="text-xs opacity-75">{ROLE_DESCRIPTIONS[role as keyof typeof ROLE_DESCRIPTIONS]}</p>
      </div>
    </div>
  );
}
