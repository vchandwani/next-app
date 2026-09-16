import { events, EventItem } from "@/lib/constants";
import EventCard from "./components/EventCard";
import ExploreBtn from "./components/ExploreBtn";

export default function Home() {
  return (
    <main className="relative">
      <section>
        <h1 className="text-4xl font-bold">
          The Hub for Every Dev <br />
          Events you can't miss
        </h1>
        <p className="text-center mt-5">Meetups, conferences, and more!</p>
        <ExploreBtn />
        <div className="mt-20 space-y-7">
          <h3>Featured Events</h3>
          <ul className="events">
            {events &&
              events.length > 0 &&
              events.map((event: EventItem) => (
                <li key={event.slug} className="list-none">
                  <EventCard {...event} />
                </li>
              ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
