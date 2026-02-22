"use client";

import React, { useState, useEffect } from "react";
import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";


type ErrorRow = {
  id: string;
  message: string;
  count: number;
  firstSeen: string;
  lastSeen: string;
};

type LiveChartProps = {
  errorData: ErrorRow[];
};
export default function LiveChart({ errorData }: LiveChartProps) {
    // Process data into 15-minute buckets
    const chartData = useMemo(() => {
      const now = new Date();
      const buckets: { name: string; rawTime: number; count: number }[] = [];
      const totalDuration = 120; // 120 minutes
      const interval = 15; // 15 minutes
      
      // 1. Create the buckets (0 to 7) working backwards from NOW
      for (let i = 7; i >= 0; i--) {
        const timeSlot = new Date(now.getTime() - i * interval * 60000);
        
        // Format time as "10:30", "10:45"
        const timeLabel = timeSlot.toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false // or true if you prefer AM/PM
        });
  
        buckets.push({
          name: timeLabel,
          rawTime: timeSlot.getTime(),
          count: 0, // Start at 0
        });
      }
  
      // 2. Fill buckets with actual error counts
      errorData.forEach((err) => {
        if (!err.lastSeen) return;
        const errorTime = new Date(err.lastSeen).getTime();
  
        // Find which bucket this error belongs to
        // We check if the error happened within the 15m window of a bucket
        const matchedBucket = buckets.find(b => {
          const diff = Math.abs(b.rawTime - errorTime);
          return diff < (interval * 60000) / 2; // +/- 7.5 mins
        });
  
        if (matchedBucket) {
          // We use the error's 'count' property, or just increment by 1 if you want event frequency
          matchedBucket.count += 1; 
        }
      });
  
      return buckets;
    }, [errorData]);
  
    return (
      <div className="w-full h-full min-h-[120px] pr-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            {/* Grid lines (faint) */}
            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
            
            {/* X Axis - Timestamps */}
            <XAxis 
              dataKey="name" 
              tick={{ fill: '#6B7280', fontSize: 9 }} 
              tickLine={false}
              axisLine={false}
              interval={1} // Show every other label if it gets crowded
            />
            
            {/* Y Axis - Error Count */}
            <YAxis 
              hide={false} // Set to true if you want to hide the numbers on the left
              tick={{ fill: '#6B7280', fontSize: 9 }}
              width={15}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            
            {/* Tooltip on Hover */}
            <Tooltip 
              contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px' }}
              itemStyle={{ color: '#22C55E', fontSize: '12px' }}
              labelStyle={{ color: '#9CA3AF', fontSize: '10px', marginBottom: '4px' }}
            />
  
            {/* The Actual Line */}
            <Line
              type="linear" // "linear" makes straight lines between points (point-to-point)
              dataKey="count"
              stroke="#22C55E"
              strokeWidth={2}
              dot={{ r: 3, fill: '#22C55E', strokeWidth: 0 }} // The dots you wanted
              activeDot={{ r: 5, fill: '#fff' }}
              isAnimationActive={false} // STOPS IT FROM MOVING/ANIMATING
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }
