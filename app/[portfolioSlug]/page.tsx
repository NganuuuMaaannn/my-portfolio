import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PortfolioPage } from "@/app/components/portfolio/PortfolioPage";
import { getPortfolioBySlug } from "@/lib/portfolio-store";

type PortfolioRoutePageProps = {
  params: Promise<{
    portfolioSlug: string;
  }>;
};

export async function generateMetadata({
  params,
}: PortfolioRoutePageProps): Promise<Metadata> {
  const { portfolioSlug } = await params;
  const { portfolio } = await getPortfolioBySlug(portfolioSlug);

  if (!portfolio) {
    return {
      title: "Portfolio Not Found - Allena Hub",
    };
  }

  return {
    title: `${portfolio.ownerName} - Portfolio`,
    description: portfolio.intro,
  };
}

export default async function PortfolioSlugPage({
  params,
}: PortfolioRoutePageProps) {
  const { portfolioSlug } = await params;
  const { portfolio } = await getPortfolioBySlug(portfolioSlug);

  if (!portfolio) {
    notFound();
  }

  return <PortfolioPage portfolio={portfolio} enableRealtime />;
}
