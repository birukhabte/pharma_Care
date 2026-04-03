'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

const topMedicines = [
  { name: 'Amoxicillin', units: 312 },
  { name: 'Metformin', units: 287 },
  { name: 'Atorvastatin', units: 241 },
  { name: 'Omeprazole', units: 198 },
  { name: 'Amlodipine', units: 176 },
  { name: 'Azithromycin', units: 154 },
  { name: 'Pantoprazole', units: 138 },
  { name: 'Cetirizine', units: 121 },
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-modal p-3">
      <p className="text-xs font-semibold text-slate-700">{label}</p>
      <p className="text-sm font-bold text-teal-700 font-mono tabular-nums mt-1">
        {payload[0].value} units sold
      </p>
    </div>
  );
}

export default function TopMedicinesChart() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-card h-full">
      <div className="mb-5">
        <h3 className="text-base font-semibold text-slate-800">Top Medicines by Volume</h3>
        <p className="text-xs text-slate-400 mt-0.5">Units dispensed this month</p>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <BarChart
          data={topMedicines}
          layout="vertical"
          margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
          barSize={14}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 90%)" horizontal={false} />
          <XAxis
            type="number"
            tick={{ fontSize: 10, fill: 'hsl(220, 9%, 52%)' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fontSize: 11, fill: 'hsl(220, 9%, 52%)' }}
            axisLine={false}
            tickLine={false}
            width={80}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(220, 13%, 96%)' }} />
          <Bar dataKey="units" radius={[0, 4, 4, 0]}>
            {topMedicines.map((_, i) => (
              <Cell
                key={`bar-cell-${i}`}
                fill={i === 0 ? 'hsl(173, 83%, 26%)' : i < 3 ? 'hsl(173, 60%, 45%)' : 'hsl(173, 40%, 70%)'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}