import { ReactNode } from "react";

export interface H2Props {
  children: ReactNode;
}

export default function H2({ children }: H2Props) {
  return <h2 className="text-2xl font-semibold text-gray-900">{children}</h2>;
}
