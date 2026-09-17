import React from "react";

const EventDetails = async ({ params }: { params: Promise<string> }) => {
  const event = JSON.parse(await params);
  return <h1>{event?.title || "Loading..."}</h1>;
};

export default EventDetails;
