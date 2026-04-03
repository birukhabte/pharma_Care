import React from 'react';
import SalesTrendChart from './SalesTrendChart';
import TopMedicinesChart from './TopMedicinesChart';

export default function DashboardCharts() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
      <div className="xl:col-span-3">
        <SalesTrendChart />
      </div>
      <div className="xl:col-span-2">
        <TopMedicinesChart />
      </div>
    </div>
  );
}