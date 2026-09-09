import Image from "next/image";
import Link from "next/link";
import ProductCard from "./components/ProductCard";
import ThemeToggle from "./components/ThemeToggle";

export default function Home() {
  return (
    <main className="relative">
      <div className="absolute right-0 top-0">
        <ThemeToggle />
      </div>
      <h1>Hello World</h1>
      {/* Client Side Navigation */}
      <Link href="/users">Users</Link>
      <ProductCard />
    </main>
    );
}
