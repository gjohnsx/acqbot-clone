import { opportunitySchema } from "@/data/schema";
import { z } from "zod";

export const dynamicParams = false;

export async function generateStaticParams() {
  async function getTasks() {
    const data = await import("@/data/opportunities.json");
    return z.array(opportunitySchema).parse(data.default);
  }

  const opportunities = await getTasks();

  return opportunities.map((opp) => ({
    id: opp.id,
  }));
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const { id } = params;

  // Get the individual task by ID from the database
  async function getOpportunityById(opportunityId: string) {
    const data = await import("@/data/opportunities.json");
    const opportunities = z.array(opportunitySchema).parse(data.default);
    return opportunities.find((opp) => opp.id === opportunityId);
  }

  const opportunity = await getOpportunityById(id);

  return {
    title: opportunity?.title || "Loading...",
  };
}

export default async function OpportunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
