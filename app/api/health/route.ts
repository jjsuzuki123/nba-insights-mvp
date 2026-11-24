// src/app/api/health/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error(
      "[health] Missing Supabase env vars: NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY"
    );
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  // Supabase provides a health endpoint for Auth (GoTrue) that works without any tables.
  // Docs example: GET https://<project-ref>.supabase.co/auth/v1/health with apikey header.
  const url = `${supabaseUrl}/auth/v1/health`;

  try {
    const res = await fetch(url, {
      headers: {
        apikey: supabaseAnonKey,
      },
      // Avoid caching so you see live behavior during setup
      cache: "no-store",
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error("[health] Supabase auth health check failed", {
        status: res.status,
        statusText: res.statusText,
        body: body.slice(0, 500),
      });
      return NextResponse.json({ ok: false }, { status: 503 });
    }

    const data = await res.json().catch(() => ({}));

    return NextResponse.json({ ok: true, supabaseAuthHealth: data });
  } catch (err) {
    console.error("[health] Supabase auth health request errored", err);
    return NextResponse.json({ ok: false }, { status: 503 });
  }
}
