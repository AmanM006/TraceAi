"use client";

import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#22C55E', '#16A34A', '#15803D', '#166534', '#14532D', '#052E16'];

export default function ErrorPieChart({ errorData }: { errorData: any[] }) {
  
  // 1. Process Data: Top 5 errors, bundle the rest into "Other"
  const chartData = useMemo(() => {
    if (!errorData || errorData.length === 0) return [];
    
    // Sort by highest count
    const sorted = [...errorData].sort((a, b) => b.count - a.count);
    
    // Grab top 5
    const top5 = sorted.slice(0, 5).map(err => ({
      name: err.message,
      value: err.count,
      message: err.message // Keep the full message for the tooltip
    }));

    // Group the rest
    const rest = sorted.slice(5);
    if (rest.length > 0) {
      const restCount = rest.reduce((sum, err) => sum + err.count, 0);
      top5.push({
        name: "Other Errors",
        value: restCount,
        message: `${rest.length} other minor errors combined`
      });
    }
    
    return top5;
  }, [errorData]);

  // Calculate the total number of errors for the center of the donut
  const totalErrors = useMemo(() => {
    return errorData?.reduce((sum, err) => sum + err.count, 0) || 0;
  }, [errorData]);

  // 2. The Custom Tooltip that actually shows useful info!
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#111111] border border-white/10 p-4 rounded-xl shadow-2xl max-w-[280px] z-50">
          <p className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-2">Error Detail</p>
          
          {/* Truncated to 3 lines max so massive errors don't break the screen */}
          <p className="text-xs text-gray-300 font-mono mb-3 line-clamp-3 leading-relaxed break-all">
            {data.message}
          </p>
          
          <div className="flex items-center gap-2 pt-3 border-t border-white/5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: payload[0].fill }} />
            <p className="text-sm font-bold text-white">{data.value} occurrences</p>
          </div>
        </div>
      );
    }
    return null;
  };

  if (!chartData.length) {
    return <div className="text-xs text-gray-600 font-mono">No data available</div>;
  }

  return (
    <div className="w-full h-full relative flex items-center justify-center min-h-[250px]">
      
      {/* 1. MOVED TO TOP: Center Total Text (Renders in background, z-0) */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-0">
        <span className="text-3xl font-black text-white">{totalErrors}</span>
        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1">Total</span>
      </div>

      {/* 2. CHART CONTAINER: Renders on top with z-10 so tooltip overlaps the text */}
      <div className="w-full h-full z-10">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={70}
              paddingAngle={3}
              dataKey="value"
              stroke="none"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>

    </div>
  );}