"use client";

import { Icons } from "@/components/icons/Icons";
import { EventItem } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import posthog from "posthog-js";

const EventCard = ({ title, image, slug, location, date, time }: EventItem) => {
  return (
    <Link
      href={`/events/${slug}`}
      id="event-card"
      onClick={() => {
        if (process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN && process.env.NEXT_PUBLIC_POSTHOG_HOST) {
          posthog.capture("event_card_selected");
        }
      }}
    >
      <Image src={image} alt={title} width={410} height={300} className="poster" />
      <div className="flex flex-row gap-2">
        <Icons name="pin" className="pin" size={14} />
        <p>{location}</p>
      </div>
      <p className="title">{title}</p>
      <div className="datetime">
        <div>
          <Icons name="calendar" className="calendar" size={14} />
          <p>{date}</p>
        </div>
        <div>
          <Icons name="clock" className="clock" size={14} />
          <p>{time}</p>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
