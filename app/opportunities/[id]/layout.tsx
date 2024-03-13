import { Metadata } from "next";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { opportunitySchema } from "@/data/schema";
import { z } from "zod";
import Link from "next/link";
import { HomeIcon } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { StepsNav } from "@/components/steps-nav";

export const dynamicParams = true; // TODO change to false for build

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
  params,
  children,
}: {
  params: { id: string };
  children: React.ReactNode;
}) {
  const { id } = params;

  // Get the individual task by ID from the database
  async function getOpportunityById(opportunityId: string) {
    const data = await import("@/data/opportunities.json");
    const opportunities = z.array(opportunitySchema).parse(data.default);
    return opportunities.find((opp) => opp.id === opportunityId);
  }

  const opportunity = await getOpportunityById(id);

  return (
    <>
      {children}
    </>
  );
}
