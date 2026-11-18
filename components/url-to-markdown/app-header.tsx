import Image from "next/image";

import { ThemeToggle } from "@/components/url-to-markdown/theme-toggle";

export function AppHeader({ actions }: { actions?: React.ReactNode }) {
  return (
    <header className="flex items-center justify-between py-2">
      <div className="flex items-center gap-2 text-base font-semibold">
        <Image
          className="-mx-1 h-9 w-auto dark:hidden"
          src="/brand/LGE_Logo_HeritageRed_Grey_RGB.png"
          alt="LG"
          width={2081}
          height={1127}
          priority
        />
        <Image
          className="-mx-1 hidden h-9 w-auto dark:block"
          src="/brand/LGE_Logo_HeritageRed_White_RGB.png"
          alt="LG"
          width={2081}
          height={1127}
          priority
        />
        <span className="mx-1 h-[18px] w-px bg-border" aria-hidden />
        <span>Feedme</span>
      </div>
      <div className="flex items-center gap-1">
        {actions}
        <ThemeToggle />
      </div>
    </header>
  );
}
