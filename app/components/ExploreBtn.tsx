'use client'

import { Icons } from "@/components/icons/Icons";

const ExploreBtn = () => {
  return (
    <button type="button" id="explore-btn" className="mt-7 mx-auto" onClick={() => console.log('Explore button clicked!')}>
        <a href="#events">
            Explore Events
            <Icons name="arrow-down" className="" />
        </a>
    </button>
  )
}

export default ExploreBtn