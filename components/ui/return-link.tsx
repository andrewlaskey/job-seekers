import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export interface ReturnLinkProps {
  text: string;
  href: string;
}

export default function ReturnLink({ text, href }: ReturnLinkProps) {
  return (
    <Link
      href={href}
      className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
    >
        <ArrowLeft className="w-4 h-4 mr-2" />
      {text}
    </Link>
  );
}