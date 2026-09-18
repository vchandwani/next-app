import Image from "next/image";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  return (
    <header>
      <nav>
        <Link href="/" className="logo">
          <Image src="/icons/logo.png" alt="Logo" width={24} height={24} />
          <p>DevEvents</p>
        </Link>
        <ul>
          <Link href="/" className="">
            Events
          </Link>
          <Link href="/about" className="">
            About Us
          </Link>
          <Link href="/dashboard/analytics" className="">
            Analytics
          </Link>
          <Link href="/dashboard/users" className="">
            Users
          </Link>
          <ThemeToggle />
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
