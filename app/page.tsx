"use client";

import { useEffect, useRef, useState } from "react";

import { useUIState, useActions } from "ai/rsc";
import { UserMessage } from "@/components/message";

import { type AI } from "./action";
import { ChatScrollAnchor } from "@/lib/hooks/chat-scroll-anchor";
import { FooterText } from "@/components/footer";
import Textarea from "react-textarea-autosize";
import { useEnterSubmit } from "@/lib/hooks/use-enter-submit";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  IconArrowElbow,
  IconArrowRight,
  IconPlus,
} from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { ChatList } from "@/components/chat-list";
import { EmptyScreen } from "@/components/empty-screen";
import { ExternalLink } from "@/components/external-link";
import Link from "next/link";

export default function Page() {
  const [messages, setMessages] = useUIState<typeof AI>();
  const { submitUserMessage } = useActions<typeof AI>();
  const [inputValue, setInputValue] = useState("");
  const { formRef, onKeyDown } = useEnterSubmit();
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/") {
        if (
          e.target &&
          ["INPUT", "TEXTAREA"].includes((e.target as any).nodeName)
        ) {
          return;
        }
        e.preventDefault();
        e.stopPropagation();
        if (inputRef?.current) {
          inputRef.current.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [inputRef]);

  const actionItems = [
    {
      heading: "View opportunities table",
      href: "/opportunities",
    },
    {
      heading: "View the 5G network opportunity page",
      href: "/opportunities/OPP-4550",
    },
    {
      heading: "Create a problem statement with OpenAI",
      href: "/opportunities/OPP-4550/requirements",
    },
  ];

  return (
    <div>
      <div className="mx-auto max-w-2xl px-4">
        <div className="rounded-lg border bg-background p-8 mb-4">
          <h1 className="mb-2 text-lg font-semibold">
            Welcome to my AcqBot Clone Demo!
          </h1>
          <p className="mb-2 leading-normal text-muted-foreground">
            I built this demo as part of my application for the Senior Software
            Developer position at Trenchant Analytics.
          </p>
          <p className="mb-2 leading-normal text-muted-foreground">
            View the prompt I used for the problem statement generator{" "}
            <ExternalLink href="https://github.com/gjohnsx/acqbot-clone/blob/main/app/action.tsx#L36">
              here
            </ExternalLink>
            .
          </p>
          <div className="mt-4 flex flex-col items-start space-y-2 mb-4">
            {actionItems.map((item, index) => (
              <Button
                key={index}
                variant="link"
                className="h-auto p-0 text-base"
                asChild
              >
                <Link href={item.href}>
                  <IconArrowRight className="mr-2 text-muted-foreground" />
                  {item.heading}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
