import Hero from "@/components/hero";
import Link from "next/link";

export default async function Home() {
  return (
    <>
      <Hero />
      <main className="flex-1 flex flex-col gap-6 px-4 mb-8">
        <div className="text-center">
          <p className="text-md py-8 text-center">
            Create an account and start tracking applications and interviews.
          </p>
          <Link
            href="/sign-up"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent"
          >
            Sign Up
          </Link>
        </div>
      </main>
    </>
  );
}
