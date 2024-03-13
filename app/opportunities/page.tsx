import { Metadata } from "next";
import Image from "next/image";
import { z } from "zod";

import { columns } from "./columns";
import { DataTable } from "./data-table";
import { UserNav } from "@/components/user-nav";
import { opportunitySchema } from "@/data/schema";

export const metadata: Metadata = {
  title: "Opportunities",
  description: "An opportunity and issue tracker build using Tanstack Table.",
};

// Simulate a database read for opportunities.
async function getOpportunities() {
  const data = await import("@/data/opportunities.json");
  return z.array(opportunitySchema).parse(data.default);
}

export default async function OpportunitiesPage() {
  const opportunities = await getOpportunities();

  return (
    <>
      <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
            <p className="text-muted-foreground">
              Here&apos;s a list of your opportunities for this month!
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <UserNav />
          </div>
        </div>
        <DataTable data={opportunities} columns={columns} />
      </div>
    </>
  );
}
