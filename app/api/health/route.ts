// src/app/api/health/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json(
      { ok: false, error: "Missing Supabase env vars in NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY" },
      { status: 500 }
    );
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

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return NextResponse.json(
        { ok: false, status: res.status, statusText: res.statusText, data },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, supabaseAuthHealth: data });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
