import { NextResponse } from "next/server";
import { supabase } from "../../../../lib/supabase"; // Make sure this path points to your supabase client!

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // Next.js 15 Promise format
) {
  try {
    const { id } = await params;

    // Fetch the single error and its occurrences from Supabase
    const { data: error, error: supabaseError } = await supabase
      .from("errors")
      .select(`
        id,
        raw_message,
        raw_stack,
        normalized_message,
        normalized_stack,
        ai_suggestion,
        occurrences (
          id,
          created_at,
          environment,
          commit_sha
        )
      `)
      .eq("id", id)
      .single();

    // If it doesn't exist in the database, return a 404
    if (supabaseError || !error) {
      console.error("Supabase Error:", supabaseError);
      return NextResponse.json({ error: "Error not found" }, { status: 404 });
    }

    return NextResponse.json(error);
  } catch (err) {
    console.error("Failed to fetch single error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}