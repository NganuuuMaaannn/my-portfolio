import { NextResponse, type NextRequest } from "next/server";

import { createClient } from "@/lib/supabase/server";

function redirectWithError(request: NextRequest, message: string) {
  const loginUrl = new URL("/admin/login", request.url);
  loginUrl.searchParams.set("error", message);
  return NextResponse.redirect(loginUrl);
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const source = requestUrl.searchParams.get("source");
  const authError = requestUrl.searchParams.get("error_description");

  if (authError) {
    return redirectWithError(request, authError);
  }

  if (!code) {
    return redirectWithError(request, "Authentication link is missing its code. Please try again.");
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return redirectWithError(request, error.message);
  }

  const destination =
    source === "signup-confirmation" ? "/admin/auth/confirmed" : "/admin";

  return NextResponse.redirect(new URL(destination, request.url));
}
