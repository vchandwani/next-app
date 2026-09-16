"use client";

import { Icons } from "@/components/icons/Icons";
import posthog from "posthog-js";

const ExploreBtn = () => {
  const handleExploreEvents = () => {
    console.log("Explore button clicked!");
    if (process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN && process.env.NEXT_PUBLIC_POSTHOG_HOST) {
      posthog.capture("explore_events_clicked");
    }
  };

  return (
    <button type="button" id="explore-btn" className="mt-7 mx-auto" onClick={handleExploreEvents}>
      <a href="#events">
        Explore Events
        <Icons name="arrow-down" className="" />
      </a>
    </button>
  );
};

export default ExploreBtn;
