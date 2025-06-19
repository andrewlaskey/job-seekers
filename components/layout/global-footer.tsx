import Link from "next/link";
import { ThemeSwitcher } from "../theme-switcher";
import Image from "next/image";

export default function GlobalFooter() {
  return (
    <footer className="w-full max-w-5xl flex items-start justify-between border-t mx-auto text-left text-xs gap-8 py-16 px-5">
      <div className="flex flex-col items-start gap-4">
        <Link href="/privacy">Privacy Policy & Terms</Link>
        <p>Made with ❤️ by <Link href="https://bsky.app/profile/andrewlaskey.bsky.social" target="_blank">Andrew Laskey</Link></p>
        <div className="flex flex-col gap-2 max-w-80">
          <p>If you find this site helpful, please considering making a one-time or monthly donation on Ko-fi</p>
          <Link href="https://ko-fi.com/timbertales" target="_blank">
            <Image
              src="/support_me_on_kofi_blue.png"
              alt="Support me on Ko-Fi"
              width={200}
              height={40}
            />
          </Link>
        </div>
      </div>

      <ThemeSwitcher />
    </footer>
  );
}
