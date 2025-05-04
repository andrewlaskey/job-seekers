import Link from "next/link";
import { ReactNode } from "react";

export interface LinkButtonProps {
  children: ReactNode;
  href: string;
}

export default function LinkButton({ children, href }: LinkButtonProps) {
  return (
    <Link
      href={href}
      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    >
      {children}
    </Link>
  );
}
