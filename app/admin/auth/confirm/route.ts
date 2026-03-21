import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const tokenHash = requestUrl.searchParams.get("token_hash");
  const type = requestUrl.searchParams.get("type") as EmailOtpType | null;

  const confirmedUrl = new URL("/admin/auth/confirmed", request.url);
  const errorUrl = new URL("/admin/login", request.url);

  if (tokenHash && type) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash: tokenHash,
    });

    if (!error) {
      return NextResponse.redirect(confirmedUrl);
    }

    errorUrl.searchParams.set(
      "error",
      "Email confirmation failed. Please request a new confirmation link.",
    );
    return NextResponse.redirect(errorUrl);
  }

  errorUrl.searchParams.set(
    "error",
    "Confirmation link is incomplete. Please request a new confirmation email.",
  );
  return NextResponse.redirect(errorUrl);
}
