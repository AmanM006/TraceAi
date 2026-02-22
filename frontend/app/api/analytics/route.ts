import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get("project");

  if (!projectId) {
    return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
  }

  // Fetch all occurrences for this project
  const { data: occurrences, error } = await supabase
    .from("occurrences")
    .select("created_at, environment, error_id")
    .eq("project_id", projectId);

  if (error || !occurrences) {
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }

  // Set up our timeframes
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

  // Counters
  let currentWeekTotal = 0;
  let previousWeekTotal = 0;
  let currentWeekProd = 0;
  let previousWeekProd = 0;
  
  const currentWeekErrorIds = new Set();
  const previousWeekErrorIds = new Set();

  // Bucket the data
  occurrences.forEach(occ => {
    const date = new Date(occ.created_at);
    
    if (date >= sevenDaysAgo) {
      currentWeekTotal++;
      currentWeekErrorIds.add(occ.error_id);
      if (occ.environment === 'prod') currentWeekProd++;
    } else if (date >= fourteenDaysAgo && date < sevenDaysAgo) {
      previousWeekTotal++;
      previousWeekErrorIds.add(occ.error_id);
      if (occ.environment === 'prod') previousWeekProd++;
    }
  });

  // Math helper for percentages
  const calculateTrend = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? "+100%" : "0%";
    const percent = ((current - previous) / previous) * 100;
    return `${percent > 0 ? '+' : ''}${percent.toFixed(1)}%`;
  };

  return NextResponse.json({
    total: {
      value: currentWeekTotal,
      trend: `${calculateTrend(currentWeekTotal, previousWeekTotal)} vs last week`,
      trendUp: currentWeekTotal > previousWeekTotal,
    },
    unique: {
      value: currentWeekErrorIds.size,
      trend: `${calculateTrend(currentWeekErrorIds.size, previousWeekErrorIds.size)} vs last week`,
      trendUp: currentWeekErrorIds.size > previousWeekErrorIds.size,
    },
    prod: {
      value: currentWeekProd,
      trend: `${calculateTrend(currentWeekProd, previousWeekProd)} vs last week`,
      trendUp: currentWeekProd > previousWeekProd,
    },
    healthScore: Math.max(10, 100 - (currentWeekProd * 2)) // Subtracts 2 points for every prod error this week
  });
}