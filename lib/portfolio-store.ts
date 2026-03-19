import type { User } from "@supabase/supabase-js";

import {
  buildDefaultPortfolioContent,
  normalizePortfolioContent,
} from "@/app/components/portfolio/data";
import type { PortfolioContent, PortfolioRow } from "@/app/components/portfolio/types";
import { createClient } from "@/lib/supabase/server";

const portfolioTable = "student_portfolios";

type PortfolioResult = {
  portfolio: PortfolioContent;
  errorMessage: string | null;
};

function getPortfolioSeed(user?: User | null) {
  return {
    ownerName:
      typeof user?.user_metadata?.name === "string"
        ? user.user_metadata.name
        : null,
    email: user?.email ?? null,
    username:
      typeof user?.user_metadata?.username === "string"
        ? user.user_metadata.username
        : null,
  };
}

export async function getPortfolioForUser(user: User): Promise<PortfolioResult> {
  const supabase = await createClient();
  const seed = getPortfolioSeed(user);
  const fallback = buildDefaultPortfolioContent(seed);

  const { data, error } = await supabase
    .from(portfolioTable)
    .select("*")
    .eq("owner_id", user.id)
    .maybeSingle();

  if (error) {
    return {
      portfolio: fallback,
      errorMessage: error.message,
    };
  }

  return {
    portfolio: normalizePortfolioContent(data as PortfolioRow | null, seed),
    errorMessage: null,
  };
}

export async function getPortfolioBySlug(portfolioSlug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(portfolioTable)
    .select("*")
    .eq("portfolio_slug", portfolioSlug)
    .eq("is_published", true)
    .maybeSingle();

  if (error || !data) {
    return {
      portfolio: null,
      errorMessage: error?.message ?? "Portfolio not found.",
    };
  }

  return {
    portfolio: normalizePortfolioContent(data as PortfolioRow | null),
    errorMessage: null,
  };
}
