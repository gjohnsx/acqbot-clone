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

  const stepsNavItems: {
    href: string;
    title: string;
    status: "complete" | "current" | "upcoming";
  }[] = [
    { href: `/opportunities/${id}/`, title: "Preparation", status: "current" },
    {
      href: `/opportunities/${id}/announcement`,
      title: "Announcement",
      status: "upcoming",
    },
    {
      href: `/opportunities/${id}/completion`,
      title: "Completion",
      status: "upcoming",
    },
    {
      href: `/opportunities/${id}/selection`,
      title: "Selection",
      status: "upcoming",
    },
    {
      href: `/opportunities/${id}/finalize`,
      title: "Finalize",
      status: "upcoming",
    },
  ];

  function BreadcrumbWithCustomSeparator() {
    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink>
              <Link href="/" aria-label="Home">
                <HomeIcon className="h-4 w-4" />
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>
              <Link href="/opportunities">Opportunities</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>
              {opportunity?.title || "Loading..."}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  function Stats() {
    const stats = [
      { label: "Expected Budget", value: opportunity?.expectedBudget },
      { label: "Start Date", value: formatDate(opportunity?.startDate || "") },
      { label: "End Date", value: formatDate(opportunity?.endDate || "") },
    ];
    return (
      <dl className="my-4 mx-auto grid grid-cols-1 bg-muted sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="border lg:even:border-l-0 lg:even:border-r-0 border-border flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 px-4 py-2 sm:px-6 xl:px-8"
          >
            <dt className="text-xs font-medium leading-6 text-muted-foreground">
              {stat.label}
            </dt>
            <dd className="w-full flex-none text-xl font-medium leading-10 tracking-tight text-foreground">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>
    );
  }

  return (
    <>
      <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <BreadcrumbWithCustomSeparator />

        <div className="pb-8">
          <div className="mx-auto">
            <h1 className="sr-only">Page title</h1>
            {/* Main 3 column grid */}
            <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-3 lg:gap-8">
              {/* Left column */}
              <div className="grid grid-cols-1 gap-4 lg:col-span-2">
                <section aria-labelledby="section-1-title">
                  <h2 className="sr-only" id="section-1-title">
                    Section title
                  </h2>
                  <div className="">
                    <div className="">
                      <div className="p-6 mb-6 rounded-lg bg-background shadow">
                        <h4 className="scroll-m-20 lg:text-xl font-semibold tracking-tight">
                          Opportunity
                        </h4>
                        <h1 className="scroll-m-20 text:xl lg:text-4xl font-extrabold tracking-tight">
                          {opportunity?.title}
                        </h1>
                        <p className="text-muted-foreground">Tradewind</p>
                        <Stats />
                      </div>

                      <StepsNav items={stepsNavItems} />

                      <Button className="bg-blue-500 text-white">
                        Next Step
                      </Button>
                      <div className="mt-6">{children}</div>
                    </div>
                  </div>
                </section>
              </div>

              {/* Right column */}
              <div className="grid grid-cols-1 gap-4">
                <section aria-labelledby="section-2-title">
                  <h2 className="sr-only" id="section-2-title">
                    Section title
                  </h2>
                  <div className="overflow-hidden rounded-lg shadow">
                    <div className="p-6">
                      <h2 className="text-lg font-semibold">
                        Tasks (3/6 completed)
                      </h2>

                      <div className="space-y-4">
                        <div className="items-top flex space-x-2 justify-start items-center">
                          <div className="flex space-x-2 mr-auto items-center">
                            <Checkbox id="aiBackgroundCheck" />
                            <div className="grid gap-1.5 leading-none">
                              <label
                                htmlFor="terms1"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                Complete AI Background Check
                              </label>
                              <p className="text-sm text-muted-foreground">
                                Describe the background behind the opportunity.
                                (5 minutes)
                              </p>
                            </div>
                          </div>
                          <Button className="ml-auto" variant="secondary">
                            View
                          </Button>
                        </div>

                        <div className="items-top flex space-x-2 justify-start items-center">
                          <div className="flex space-x-2 mr-auto items-center">
                            <Checkbox id="requirementDefinition" />
                            <div className="grid gap-1.5 leading-none">
                              <label
                                htmlFor="terms1"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                Complete Requirement Definition
                              </label>
                              <p className="text-sm text-muted-foreground">
                                Describe the challenge faced and capability
                                needed (2 minutes)
                              </p>
                            </div>
                          </div>
                          <Button asChild variant="secondary">
                            <Link href={`/opportunities/${id}/requirements`}>
                              View
                            </Link>
                          </Button>
                        </div>

                        <div className="items-top flex space-x-2 justify-start items-center">
                          <div className="flex space-x-2 mr-auto items-center">
                            <Checkbox id="draftCallIndustry" />
                            <div className="grid gap-1.5 leading-none">
                              <label
                                htmlFor="terms1"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                Complete Draft Call to Industry
                              </label>
                              <p className="text-sm text-muted-foreground">
                                Create a draft call to industry (5 minutes)
                              </p>
                            </div>
                          </div>
                          <Button variant="secondary">View</Button>
                        </div>
                        <div className="items-top flex space-x-2 justify-start items-center">
                          <div className="flex space-x-2 mr-auto items-center">
                            <Checkbox id="peerReviewCall" />
                            <div className="grid gap-1.5 leading-none">
                              <label
                                htmlFor="terms1"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                Peer review Call to Industry
                              </label>
                              <p className="text-sm text-muted-foreground">
                                Peer review your call to industry (5 minutes)
                              </p>
                            </div>
                          </div>
                          <Button variant="secondary">View</Button>
                        </div>
                        <div className="items-top flex space-x-2 justify-start items-center">
                          <div className="flex space-x-2 mr-auto items-center">
                            <Checkbox id="publishCallIndustry" />
                            <div className="grid gap-1.5 leading-none">
                              <label
                                htmlFor="terms1"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                Publish Call to Industry
                              </label>
                              <p className="text-sm text-muted-foreground">
                                Publish the call to industry in order to collect
                                responses (1 minute){" "}
                              </p>
                            </div>
                          </div>
                          <Button variant="secondary">View</Button>
                        </div>
                        <div className="items-top flex space-x-2 justify-start items-center">
                          <div className="flex space-x-2 mr-auto items-center">
                            <Checkbox id="draftOtaAgreement" />
                            <div className="grid gap-1.5 leading-none">
                              <label
                                htmlFor="terms1"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                Draft OTA Agreement
                              </label>
                              <p className="text-sm text-muted-foreground">
                                Create a draft OTA agreement (1 minute)
                              </p>
                            </div>
                          </div>
                          <Button variant="secondary">View</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
