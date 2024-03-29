import Link from "next/link";

import {
  IconGitHub,
  IconSeparator,
  IconSparkles,
  IconVercel,
} from "@/components/ui/icons";
import { Button } from "@/components/ui/button";

import Image from "next/image";
import { ModeToggle } from "./mode-toggle";

export async function Header() {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between w-full px-4 border-b h-14 shrink-0 bg-background backdrop-blur-xl">
      <span className="inline-flex items-center home-links whitespace-nowrap">
        <Link href="/">
          <Image
            src="/acqbot-logo.webp"
            alt="ACBot Logo"
            width={30}
            height={30}
            className="dark:hidden"
          />
          <Image
            src="/acqbot-logo-white.webp"
            alt="ACBot Logo"
            width={30}
            height={30}
            className="hidden dark:block"
          />
        </Link>
        <IconSeparator className="w-6 h-6 text-muted-foreground/20" />
        <Link href="/">
          <span className="text-lg font-bold">AcqBot</span>
        </Link>
      </span>
      <div className="flex items-center justify-end space-x-2">
        <Button variant="outline" asChild>
          <a
            target="_blank"
            href="https://github.com/gjohnsx/acqbot-clone"
            rel="noopener noreferrer"
          >
            <IconGitHub />
            <span className="hidden ml-2 md:flex">GitHub</span>
          </a>
        </Button>
        <ModeToggle />
      </div>
    </header>
  );
}
