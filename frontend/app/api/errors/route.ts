import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const sort = searchParams.get("sort") ?? "latest";
  const env = searchParams.get("env");
  const projectId = searchParams.get("project"); // 🟢 Grab the project ID from the URL

  // 🛑 Safety check: Don't load anything if no project is specified
  if (!projectId) {
    return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
  }

  // ✅ Fetch ONLY errors belonging to this specific project
  const { data, error } = await supabase
    .from("errors")
    .select(`
      id,
      raw_message,
      fingerprint,
      ai_suggestion,
      occurrences (
        created_at,
        environment
      )
    `)
    .eq("project_id", projectId); // 🟢 The Magic Filter

  if (error || !data) {
    console.error("Supabase error:", error);
    return NextResponse.json([], { status: 500 });
  }

  const result = data.map(err => {
    let occ = err.occurrences || [];

    // Filter occurrences by environment if the env param is present
    if (env) {
      occ = occ.filter((o: any) => o.environment === env);
    }

    const times = occ.map((o: any) => new Date(o.created_at).getTime());
    const environments = [...new Set(occ.map((o: any) => o.environment))];

    return {
      id: err.id,
      message: err.raw_message,
      count: times.length,
      environments,
      hasAI: !!err.ai_suggestion, // 🟢 ADD THIS: true if it has text, false if null
      firstSeen: times.length && times.length > 0 ? new Date(Math.min(...times)).toISOString() : null,
      lastSeen: times.length && times.length > 0 ? new Date(Math.max(...times)).toISOString() : null,
    };
  });

  result.sort((a, b) =>
    sort === "count"
      ? b.count - a.count
      : new Date(b.lastSeen!).getTime() - new Date(a.lastSeen!).getTime()
  );

  return NextResponse.json(result);
}