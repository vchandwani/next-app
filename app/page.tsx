import { EventItem } from "@/lib/constants";
import EventCard from "./components/EventCard";
import ExploreBtn from "./components/ExploreBtn";
import { Suspense } from "react";
import { cacheLife } from "next/cache";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const FeaturedEvents = async () => {
  "use cache";
  cacheLife("hours");
  const response = await fetch(`${BASE_URL}/api/events`);
  const data = await response.json();

  return (
    <ul className="events">
      {data.events &&
        data.events.length > 0 &&
        data.events.map((event: EventItem) => (
          <li key={event.slug} className="list-none">
            <EventCard {...event} />
          </li>
        ))}
    </ul>
  );
};

const Home = () => {
  return (
    <main className="relative">
      <section>
        <h1 className="text-4xl font-bold">
          The Hub for Every Dev <br />
          Events you cant miss
        </h1>
        <p className="text-center mt-5">Meetups, conferences, and more!</p>
        <ExploreBtn />
        <div className="mt-20 space-y-7">
          <h3>Featured Events</h3>
          <Suspense fallback={<div>Loading...</div>}>
            <FeaturedEvents />
          </Suspense>
        </div>
      </section>
    </main>
  );
};
export default Home;
