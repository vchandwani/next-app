"use client";
import React from "react";
import { createBooking } from "@/lib/actions/bookings.actions";
import { posthog } from "posthog-js";

const BookEvent = ({ eventId, slug }: { eventId: string; slug: string }) => {
  const [email, setEmail] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { success } = await createBooking(eventId, slug, email);

    if (success) {
      setSubmitted(true);
      setEmail("");
      posthog.capture("event_booked", { eventId, slug, email });
    } else {
      console.error("Booking creation failed");
      posthog.captureException("Booking creation failed");
    }
  };

  return (
    <div id="book-event">
      {submitted ? (
        <p className="text-sm">Thank you for booking the event!</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Email:</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" required />
            <button type="submit" className="button submit mt-2">
              Submit
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default BookEvent;
