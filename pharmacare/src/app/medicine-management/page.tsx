import React from 'react';
import AppLayout from '@/components/AppLayout';
import MedicineTable from './components/MedicineTable';

export default function MedicineManagementPage() {
  return (
    <AppLayout>
      <MedicineTable />
    </AppLayout>
  );
}