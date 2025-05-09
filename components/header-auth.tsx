import AuthButtonClient from "./auth-button-client";

export default function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <div>{/* Your logo/brand here */}</div>
        <nav className="flex items-center gap-4">
          {/* Your navigation links here */}
          <AuthButtonClient />
        </nav>
      </div>
    </header>
  );
}
