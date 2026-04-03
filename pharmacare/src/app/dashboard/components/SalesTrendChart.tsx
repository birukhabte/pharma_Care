'use client';

import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  defs,
  linearGradient,
  stop,
} from 'recharts';

const data7Days = [
  { day: 'Mar 27', revenue: 3820, transactions: 61 },
  { day: 'Mar 28', revenue: 4210, transactions: 68 },
  { day: 'Mar 29', revenue: 2940, transactions: 49 },
  { day: 'Mar 30', revenue: 3680, transactions: 59 },
  { day: 'Mar 31', revenue: 5120, transactions: 82 },
  { day: 'Apr 1', revenue: 4289, transactions: 72 },
  { day: 'Apr 2', revenue: 4821, transactions: 83 },
];

const data30Days = [
  { day: 'Mar 4', revenue: 2800, transactions: 45 },
  { day: 'Mar 7', revenue: 3100, transactions: 51 },
  { day: 'Mar 10', revenue: 2650, transactions: 43 },
  { day: 'Mar 13', revenue: 4100, transactions: 66 },
  { day: 'Mar 16', revenue: 3800, transactions: 62 },
  { day: 'Mar 19', revenue: 4500, transactions: 74 },
  { day: 'Mar 22', revenue: 3200, transactions: 52 },
  { day: 'Mar 25', revenue: 4800, transactions: 78 },
  { day: 'Mar 28', revenue: 4210, transactions: 68 },
  { day: 'Mar 31', revenue: 5120, transactions: 82 },
  { day: 'Apr 1', revenue: 4289, transactions: 72 },
  { day: 'Apr 2', revenue: 4821, transactions: 83 },
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; name: string }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-modal p-3 min-w-[140px]">
      <p className="text-xs font-semibold text-slate-600 mb-2">{label}</p>
      {payload.map((p, i) => (
        <div key={`tooltip-item-${i}`} className="flex items-center justify-between gap-4">
          <span className="text-xs text-slate-500 capitalize">{p.name === 'revenue' ? 'Revenue' : 'Rx Count'}</span>
          <span className="text-xs font-bold text-slate-800 font-mono tabular-nums">
            {p.name === 'revenue' ? `$${p.value.toLocaleString()}` : p.value}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function SalesTrendChart() {
  const [range, setRange] = useState<'7d' | '30d'>('7d');
  const data = range === '7d' ? data7Days : data30Days;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-card">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-semibold text-slate-800">Sales Revenue Trend</h3>
          <p className="text-xs text-slate-400 mt-0.5">Daily counter + delivery revenue</p>
        </div>
        <div className="flex bg-slate-100 p-0.5 rounded-lg gap-0.5">
          {(['7d', '30d'] as const).map((r) => (
            <button
              key={`range-${r}`}
              onClick={() => setRange(r)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-150 ${
                range === r
                  ? 'bg-white text-teal-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {r === '7d' ? 'Last 7 days' : 'Last 30 days'}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(173, 83%, 26%)" stopOpacity={0.18} />
              <stop offset="95%" stopColor="hsl(173, 83%, 26%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 90%)" vertical={false} />
          <XAxis
            dataKey="day"
            tick={{ fontSize: 11, fill: 'hsl(220, 9%, 52%)' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: 'hsl(220, 9%, 52%)' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `$${(v / 1000).toFixed(1)}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="hsl(173, 83%, 26%)"
            strokeWidth={2}
            fill="url(#revenueGradient)"
            dot={false}
            activeDot={{ r: 4, fill: 'hsl(173, 83%, 26%)', strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}