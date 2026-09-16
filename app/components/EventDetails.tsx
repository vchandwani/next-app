import React from "react";

const EventDetails = async ({ params }: { params: Promise<string> }) => {
  return <div>{(await params) || "Loading..."}</div>;
};

export default EventDetails;
