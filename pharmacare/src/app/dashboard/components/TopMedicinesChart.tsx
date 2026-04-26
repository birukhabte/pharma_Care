'use client';

import React, { useState, useEffect } from 'react';
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
import { api } from '@/lib/api';

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
  const [topMedicines, setTopMedicines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTopMedicines();
  }, []);

  const loadTopMedicines = async () => {
    try {
      const data = await api.getTopMedicines();
      const medicines = data.topMedicines || data || [];
      setTopMedicines(medicines);
    } catch (error) {
      console.error('Failed to load top medicines:', error);
      setTopMedicines([]);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-card h-full">
      <div className="mb-5">
        <h3 className="text-base font-semibold text-slate-800">Top Medicines by Volume</h3>
        <p className="text-xs text-slate-400 mt-0.5">Units dispensed this month</p>
      </div>

      {loading ? (
        <div className="h-[220px] flex items-center justify-center text-xs text-slate-400">
          Loading top medicines...
        </div>
      ) : topMedicines.length === 0 ? (
        <div className="h-[220px] flex items-center justify-center text-xs text-slate-400">
          No medicine sales data available
        </div>
      ) : (
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
      )}
    </div>
  );
}