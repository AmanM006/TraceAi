import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(
  _req: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: () => {},
        },
      }
    );

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const apiKey = `trace_${crypto.randomUUID().replace(/-/g, "")}`;

    const { data, error } = await supabase
      .from("projects")
      .update({ api_key: apiKey })
      .eq("id", params.projectId)
      .eq("owner_id", user.id)
      .select("api_key")
      .single();

    if (error || !data) {
      console.error("Generate key failed:", error);
      return NextResponse.json(
        { error: "Failed to generate key" },
        { status: 500 }
      );
    }

    return NextResponse.json({ apiKey: data.api_key });
  } catch (err) {
    console.error("Generate key crash:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
