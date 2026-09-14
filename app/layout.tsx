import type { Metadata } from "next";
import { Schibsted_Grotesk, Martian_Mono, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import LightRays from "@/components/LightRays";
import Navbar from "./components/Navbar";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const schibstedGrotesk = Schibsted_Grotesk({
  variable: "--font-schibsted-grotesk",
  subsets: ["latin"],
});

const martianMono = Martian_Mono({
  variable: "--font-martian-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NextJs Events App",
  description: "The hub for NextJs Events you can't miss",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-theme="pastel"
      suppressHydrationWarning
    >
      <body className={`${schibstedGrotesk.variable} ${martianMono.variable} min-h-screen flex flex-col bg-base-100 text-base-content transition-colors duration-200`}>
        <Navbar />
        <div className="pointer-events-none fixed inset-0 z-0">
          <LightRays
              raysOrigin="top-center-offset"
              raysColor="#5dfeca"
              raysSpeed={0.5}
              lightSpread={0.9}
              rayLength={1.4}
              followMouse={true}
              mouseInfluence={0.02}
              noiseAmount={0}
              distortion={0.01}
          />
        </div>
        <main className="relative z-10">
          {children}
        </main>
      </body>
    </html>
  );
}
