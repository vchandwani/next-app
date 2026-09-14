import Image from "next/image";
import Link from "next/link";
import ThemeToggle from "./components/ThemeToggle";
import ExploreBtn from "./components/ExploreBtn";

export default function Home() {
  return (
    <main className="relative">
      <div className="absolute right-0 top-0">
        <ThemeToggle />
      </div>
      <section>
        <h1 className="text-4xl font-bold">The Hub for Evenry Dev <br/>Events you can't miss</h1>
        <p className="text-center mt-5">Meetups, conferences, and more!</p>
        <ExploreBtn />
        <div className="mt-20 space-y-7">
          <h3>Featured Events</h3>
          <ul className="events">
            {[1, 2, 3].map((event) => (
              <li key={event} className="event-card">{event}</li>
            ))}
          </ul>
        </div>
      </section>
      {/* Client Side Navigation */}
      <div className="flex w-full items-center justify-space-between gap-4">
        <Link className="text hover:underline" href="/dashboard/users">Users</Link>
      </div>
    </main>
    );
}
