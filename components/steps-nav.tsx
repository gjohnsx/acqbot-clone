"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils/index";
import { CheckIcon } from "lucide-react";

interface StepsNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string;
    title: string;
    status: "complete" | "current" | "upcoming";
  }[];
}

export function StepsNav({ className, items, ...props }: StepsNavProps) {
  const pathname = usePathname();

  return (
    <nav aria-label="Progress" className={cn("mb-6", className)} {...props}>
      <div className="overflow-x-auto custom-scrollbar">
        <ol
          role="list"
          className="flex min-w-min divide-y divide-border rounded-md border border-border md:divide-y-0"
        >
          {items.map((item, itemIdx) => (
            <li key={item.title} className="relative flex-1">
              {" "}
              {item.status === "complete" ? (
                <Link
                  href={item.href}
                  className="group flex w-full items-center"
                >
                  <span className="flex items-center px-6 py-4 text-sm font-medium">
                    <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary">
                      <CheckIcon
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </span>
                    <span className="ml-4 text-sm font-medium">
                      {item.title}
                    </span>
                  </span>
                </Link>
              ) : item.status === "current" ? (
                <Link
                  href={item.href}
                  className="flex items-center px-6 py-4 text-sm font-medium"
                  aria-current="step"
                >
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-primary">
                    <span className="text-primary">{itemIdx + 1}</span>
                  </span>
                  <span className="ml-4 text-sm font-medium text-primary">
                    {item.title}
                  </span>
                </Link>
              ) : (
                <Link href={item.href} className="group flex items-center">
                  <span className="flex items-center px-6 py-4 text-sm font-medium">
                    <span
                      className={cn(
                        "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 group-hover:border-gray-400",
                        pathname === item.href
                          ? "border-primary"
                          : "border-border"
                      )}
                    >
                      <span
                        className={cn(
                          "text-muted-foreground group-hover:text-foreground",
                          pathname === item.href ? "text-primary" : ""
                        )}
                      >
                        {itemIdx + 1}
                      </span>
                    </span>
                    <span
                      className={cn(
                        "ml-4 text-sm font-medium text-muted-foreground group-hover:text-foreground",
                        pathname === item.href ? "text-primary" : ""
                      )}
                    >
                      {item.title}
                    </span>
                  </span>
                </Link>
              )}
              {itemIdx !== items.length - 1 ? (
                <>
                  {/* Arrow separator for lg screens and up */}
                  <div
                    className="absolute right-0 top-0 hidden h-full w-5 md:block"
                    aria-hidden="true"
                  >
                    <svg
                      className="h-full w-full text-border"
                      viewBox="0 0 22 80"
                      fill="none"
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M0 -2L20 40L0 82"
                        vectorEffect="non-scaling-stroke"
                        stroke="currentcolor"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </>
              ) : null}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}
