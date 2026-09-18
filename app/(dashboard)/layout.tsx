import Link from "next/link";
import React from "react";
import DashboardHeader from "../components/DashboardHeader";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 text-base-content text-center">
      <DashboardHeader />
      <div className="mt-4 w-full rounded-lg border border-base-300 bg-base-100/60 p-4 shadow-sm backdrop-blur-sm dark:bg-base-200/70">
        <Link href="/about" className="inline-flex rounded-md border border-transparent ">
          About
        </Link>
        <div className="w-full">{children}</div>
        <Link href="/dashboard/users" className="inline-flex rounded-md border border-transparent ">
          Users
        </Link>
      </div>
    </div>
  );
};

export default Layout;
