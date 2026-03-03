import Link from "next/link";
import React from "react";
import Particles from "./components/particles";

const navigation = [
  { name: "Projects", href: "/projects" },
  { name: "Contact", href: "/contact" },
];

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center bg-gradient-to-tl from-black via-zinc-600/20 to-black w-screen h-screen overflow-hidden">
      <Particles
        className="z-0 absolute inset-0 animate-fade-in"
        quantity={200}
      />
      <nav className="my-16 animate-fade-in">
        <ul className="flex justify-center items-center gap-4">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-zinc-500 hover:text-zinc-300 text-sm duration-500"
            >
              {item.name}
            </Link>
          ))}
        </ul>
      </nav>
      <div className="hidden md:block bg-gradient-to-r from-zinc-300/0 via-zinc-300/50 to-zinc-300/0 w-screen h-px animate-fade-left animate-glow" />

      <h1 className="z-10 bg-white bg-clip-text text-edge-outline font-display text-transparent text-4xl sm:text-6xl md:text-9xl whitespace-nowrap animate-title duration-1000 cursor-default">
        Jagrit Nokwal
      </h1>
      <div className="hidden md:block bg-gradient-to-r from-zinc-300/0 via-zinc-300/50 to-zinc-300/0 w-screen h-px animate-fade-right animate-glow" />
      {/* 
      <div className="my-16 text-center animate-fade-in">
        <h2 className="text-zinc-500 text-sm">
          I'm building{" "}
          <Link
            target="_blank"
            href="https://unkey.dev"
            className="hover:text-zinc-300 underline duration-500"
          >
            unkey.dev
          </Link> to solve API authentication and authorization for developers.
        </h2>
      </div> */}
    </div>
  );
}
