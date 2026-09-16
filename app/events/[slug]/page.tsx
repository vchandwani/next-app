import React from "react";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const EventDetailsPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  const request = await fetch(`${BASE_URL}/api/events/${slug}`);
  const { event } = await request.json();

  return (
    <section id="event">
      <h1>
        Event Details: <br />
        {event?.title || slug} <br />
        {event?.location}
      </h1>
    </section>
  );
};

export default EventDetailsPage;
