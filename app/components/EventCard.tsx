import { Icons } from "@/components/icons/Icons";
import { EventItem } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";

const EventCard = ({ title, image, slug, location, date, time }: EventItem ) => {
  return (
    <Link href={`/events/${slug}`} id="event-card">
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
  )
}

export default EventCard