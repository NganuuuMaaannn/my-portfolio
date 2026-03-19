import { buildDefaultPortfolioContent } from "@/app/components/portfolio/data";
import { PortfolioPage } from "@/app/components/portfolio/PortfolioPage";

export default function Home() {
  return <PortfolioPage portfolio={buildDefaultPortfolioContent()} />;
}
