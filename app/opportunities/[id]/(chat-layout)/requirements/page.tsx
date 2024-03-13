"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import { opportunitySchema } from "@/data/schema";
import { z } from "zod";
import Link from "next/link";
import { HomeIcon } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import { useEffect, useRef, useState } from "react";
import { useUIState, useActions } from "ai/rsc";
import { UserMessage } from "@/components/message";
import { type AI } from "@/app/action";
import { ChatScrollAnchor } from "@/lib/hooks/chat-scroll-anchor";
import Textarea from "react-textarea-autosize";
import { useEnterSubmit } from "@/lib/hooks/use-enter-submit";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { IconArrowElbow, IconPlus } from "@/components/ui/icons";
import { ChatList } from "@/components/chat-list";
import { EmptyScreen } from "@/components/empty-screen";
import { usePathname } from "next/navigation";

export default function OpportunityRequirementsPage({}: {}) {
  const pathName = usePathname();
  const pathSegments = pathName.split("/");
  const idIndex =
    pathSegments.findIndex((segment) => segment === "opportunities") + 1;
  const id = pathSegments[idIndex];

  // get the individual task by ID from the database with useEffect
  const [opportunity, setOpportunity] = useState(null as any);
  useEffect(() => {
    async function getOpportunityById(opportunityId: string) {
      const data = await import("@/data/opportunities.json");
      const opportunities = z.array(opportunitySchema).parse(data.default);
      const opportunity = opportunities.find((opp) => opp.id === opportunityId);
      setOpportunity(opportunity);
    }
    getOpportunityById(id);
  }, [id]);

  const [messages, setMessages] = useUIState<typeof AI>();
  const { submitUserMessage } = useActions<typeof AI>();
  const [inputValue, setInputValue] = useState("");
  const { formRef, onKeyDown } = useEnterSubmit();
  const inputRef = useRef<HTMLTextAreaElement>(null);

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
              <Link href={`/opportunities/${id}`}>
                {opportunity?.title || "Loading..."}
              </Link>
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

    if (!opportunity) {
      return (
        <dl className="my-4 mx-auto grid grid-cols-1 bg-muted sm:grid-cols-2 lg:grid-cols-3">
          {Array(3)
            .fill(null)
            .map((_, index) => (
              <div
                key={index}
                className="border lg:even:border-l-0 lg:even:border-r-0 border-border flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 px-4 py-2 sm:px-6 xl:px-8"
              >
                <Skeleton className="w-full h-6 mb-2" />
                <Skeleton className="w-full h-4" />
              </div>
            ))}
        </dl>
      );
    }

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
      <div className="h-full max-h-screen flex-1 flex-col space-y-8 p-8 md:flex">
        <BreadcrumbWithCustomSeparator />

        <div className="pb-8">
          <div className="mx-auto">
            {/* Main 3 column grid */}
            <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-3 lg:gap-8">
              {/* Left column */}
              <div className="grid grid-cols-1 gap-4 lg:col-span-2">
                <section aria-labelledby="section-1-title">
                  <div className="">
                    <div className="">
                      <div className="p-6 mb-6 rounded-lg bg-background shadow">
                        <h4 className="scroll-m-20 lg:text-xl font-semibold tracking-tight">
                          Opportunity
                        </h4>
                        <h1 className="scroll-m-20 text-xl lg:text-4xl font-extrabold tracking-tight">
                          {opportunity?.title || "Loading..."}
                        </h1>
                        <p className="text-muted-foreground">Tradewind</p>
                        <Stats />
                      </div>

                      <div className="mt-6">
                        {messages.length ? (
                          <>
                            <ChatList messages={messages} />
                          </>
                        ) : (
                          <EmptyScreen
                            submitMessage={async (message) => {
                              // Add user message UI
                              setMessages((currentMessages) => [
                                ...currentMessages,
                                {
                                  id: Date.now(),
                                  display: <UserMessage>{message}</UserMessage>,
                                },
                              ]);

                              // Submit and get response message
                              const responseMessage =
                                await submitUserMessage(message);
                              setMessages((currentMessages) => [
                                ...currentMessages,
                                responseMessage,
                              ]);
                            }}
                          />
                        )}
                        <ChatScrollAnchor trackVisibility={true} />
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              {/* Right column */}
              <div className="grid grid-cols-1 gap-4">
                <section aria-labelledby="section-2-title">
                  <div className="overflow-hidden rounded-lg shadow bg-background">
                    <div className="p-6">
                      <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                        Acqbot Chat
                      </h2>
                      <p className="text-sm text-muted-foreground mb-4">
                        Chat with AcqBot's AI to create a problem statement
                        quickly.
                      </p>
                      <form
                        ref={formRef}
                        onSubmit={async (e: any) => {
                          e.preventDefault();

                          // Blur focus on mobile
                          if (window.innerWidth < 600) {
                            e.target["message"]?.blur();
                          }

                          const value = inputValue.trim();
                          setInputValue("");
                          if (!value) return;

                          // Add user message UI
                          setMessages((currentMessages) => [
                            ...currentMessages,
                            {
                              id: Date.now(),
                              display: <UserMessage>{value}</UserMessage>,
                            },
                          ]);

                          try {
                            // Submit and get response message
                            const responseMessage =
                              await submitUserMessage(value);
                            setMessages((currentMessages) => [
                              ...currentMessages,
                              responseMessage,
                            ]);
                          } catch (error) {
                            // You may want to show a toast or trigger an error state.
                            console.error(error);
                          }
                        }}
                      >
                        <div className="relative flex flex-col w-full px-8 overflow-hidden max-h-60 grow bg-background sm:rounded-md sm:border sm:px-12">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                className="absolute left-0 w-8 h-8 p-0 rounded-full top-4 bg-background sm:left-4"
                                onClick={(e) => {
                                  e.preventDefault();
                                  window.location.reload();
                                }}
                              >
                                <IconPlus />
                                <span className="sr-only">New Chat</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>New Chat</TooltipContent>
                          </Tooltip>
                          <Textarea
                            ref={inputRef}
                            tabIndex={0}
                            onKeyDown={onKeyDown}
                            placeholder="Send a message."
                            className="min-h-[60px] w-full resize-none bg-transparent px-4 py-[1.3rem] focus-within:outline-none sm:text-sm"
                            autoFocus
                            spellCheck={false}
                            autoComplete="off"
                            autoCorrect="off"
                            name="message"
                            rows={1}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                          />
                          <div className="absolute right-0 top-4 sm:right-4">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  type="submit"
                                  size="icon"
                                  disabled={inputValue === ""}
                                >
                                  <IconArrowElbow />
                                  <span className="sr-only">Send message</span>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Send message</TooltipContent>
                            </Tooltip>
                          </div>
                        </div>
                      </form>
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
