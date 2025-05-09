import Link from "next/link";
import { ReactNode } from "react";

export interface ArrowLinkProps {
  text: string;
  href: string;
  target?: string;
}

export default function ArrowLink({ text, href, target }: ArrowLinkProps) {
  return (
    <Link
      href={href}
      className="text-secondary hover:text-accent text-sm font-medium"
      target={target}
    >
      {text} →
    </Link>
  );
}
