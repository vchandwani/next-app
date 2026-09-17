import { Suspense } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import { IconName, Icons } from "@/components/icons/Icons";
import BookEvent from "@/app/components/BookEvent";
import { getSimilarEventsBySlug } from "@/lib/actions/event.actions";
import { IEvent } from "@/database";
import EventCard from "@/app/components/EventCard";
import { cacheLife } from "next/cache";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const EventDetailsItem = ({ icon, alt, label }: { icon: IconName; alt: string; label: string }) => {
  return (
    <div className="flex-row-gap-2 items-center">
      <Icons name={icon} width={17} height={17} />
      <p>{label}</p>
    </div>
  );
};

const EventAgenda = ({ agendaItems }: { agendaItems: string[] }) => {
  return (
    <div className="agenda">
      <h2>Agenda</h2>
      <ul>
        {agendaItems.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

const EventTags = ({ tags }: { tags: string[] }) => {
  return (
    <div className="flex  flex-row gap-1.5 flex-wrap">
      {tags.map((tag, index) => (
        <div className="pill" key={index}>
          {tag}
        </div>
      ))}
    </div>
  );
};

const EventDetailsContent = async ({ params }: { params: Promise<{ slug: string }> }) => {
  "use cache";
  cacheLife("hours");
  const { slug } = await params;
  const response = await fetch(`${BASE_URL}/api/events/${slug}`);

  if (!response.ok) return notFound();

  const request = await response.json();

  if (!request?.event) return notFound();

  const {
    event: { description, title, image, overview, date, time, location, mode, agenda, audience, tags, organizer },
  } = request;

  if (!description) return notFound();

  const bookings = 10;
  const similarEvents: IEvent[] = await getSimilarEventsBySlug(slug);

  return (
    <section id="event">
      <div className="header">
        <h1>{title || "Loading..."}</h1>
        <p>{description || "Loading..."}</p>
      </div>
      <div className="details">
        {/* Left Side */}
        <div className="content">
          <div className="banner">
            <Image src={image} alt={title} fill sizes="(max-width: 1024px) 100vw, 66vw" className="object-cover rounded-lg" />
          </div>
          <section className="flex-col-gap2">
            <h2>Overview</h2>
            <p>{overview}</p>
          </section>
          <section className="flex-col-gap-2">
            <h2>Event Details</h2>
            <EventDetailsItem icon="calendar" alt="calendar" label={date} />
            <EventDetailsItem icon="clock" alt="clock" label={time} />
            <EventDetailsItem icon="pin" alt="pin" label={location} />
            <EventDetailsItem icon="mode" alt="mode" label={mode} />
            <EventDetailsItem icon="audience" alt="audience" label={audience} />
          </section>
          <EventAgenda agendaItems={agenda} />
          <section className="flex-col-gap-2">
            <h2>About Organizer</h2>
            <p>{organizer}</p>
          </section>
          <EventTags tags={tags} />
        </div>
        {/* Right Side */}
        <aside className="booking">
          <div className="signup-card">
            <h2>Book your Spot</h2>
            {bookings > 0 ? (
              <p className="text-sm">Join {bookings} people who have already booked this event.</p>
            ) : (
              <p className="text-sm">Be the first one to book this event.</p>
            )}
            <BookEvent eventId={request.event._id} slug={slug} />
          </div>
        </aside>
      </div>
      <div className="flex w-full flex-col gap-4 pt-20">
        <h2>Similar Events</h2>
        <div className="events">{similarEvents?.length > 0 && similarEvents.map((event: IEvent) => <EventCard key={event.slug} {...event} />)}</div>
      </div>
    </section>
  );
};

const EventDetailsPage = ({ params }: { params: Promise<{ slug: string }> }) => {
  return (
    <main id="event">
      <Suspense fallback={<div>Loading...</div>}>
        <EventDetailsContent params={params} />
      </Suspense>
    </main>
  );
};
export default EventDetailsPage;
