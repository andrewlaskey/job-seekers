import Link from "next/link";
import { ReactNode } from "react";

export interface ArrowLinkProps {
  text: string;
  href: string;
}

export default function ArrowLink({ text, href }: ArrowLinkProps) {
  return (
    <Link
      href={href}
      className="text-secondary hover:text-accent text-sm font-medium"
    >
      {text} →
    </Link>
  );
}
