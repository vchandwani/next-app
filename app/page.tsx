import Image from "next/image";
import Link from "next/link";
import ThemeToggle from "./components/ThemeToggle";

export default function Home() {
  return (
    <main className="relative">
      <div className="absolute right-0 top-0">
        <ThemeToggle />
      </div>
      <h1>Hello NextJs</h1>
      {/* Client Side Navigation */}
      <div className="flex w-full items-center justify-space-between gap-4">
        <Link className="text hover:underline" href="/dashboard/users">Users</Link>
      </div>
    </main>
    );
}
