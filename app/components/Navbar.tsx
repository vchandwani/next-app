import Image from 'next/image';
import Link  from 'next/link';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  return (
    <header>
        <nav>
            <Link href="/" className="logo">
                <Image src="/icons/logo.png" alt="Logo" width={24} height={24} />
                <p>DevEvents</p>
            </Link>
            <ul>
                <Link href="/" className="">Home</Link>
                <Link href="/" className="">Events</Link>
                <ThemeToggle />
            </ul>
        </nav>
    </header>
  )
}

export default Navbar