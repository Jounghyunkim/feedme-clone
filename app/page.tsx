import { UserMenu } from "@/components/auth/user-menu";
import { AppHeader } from "@/components/url-to-markdown/app-header";
import { Converter } from "@/components/url-to-markdown/converter";

export default function Home() {
  return (
    <div className="mx-auto flex w-full max-w-[760px] flex-1 flex-col gap-6 px-4 py-4 sm:px-6">
      <AppHeader actions={<UserMenu />} />
      <main>
        <Converter />
      </main>
    </div>
  );
}
