"use client";  // Marking this file as a client-side component

import Link from "next/link";
import { useEffect, useState } from "react";

const WelcomePage = () => {
  const [floating, setFloating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setFloating((prev) => !prev);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-teal-100 to-purple-200">
      {/* Background Pattern for Extra Depth */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.3)_10%,_transparent_50%)]"></div>
      <div className="absolute top-[-20%] left-[10%] w-[400px] h-[400px] bg-blue-300 opacity-20 blur-3xl rounded-full animate-pulse"></div>
      <div className="absolute bottom-[-20%] right-[10%] w-[500px] h-[500px] bg-purple-300 opacity-20 blur-3xl rounded-full animate-pulse"></div>

      {/* Glassmorphism White Card */}
      <div
        className={`relative p-10 text-center max-w-lg rounded-3xl shadow-xl 
        backdrop-blur-xl bg-white/30 border border-white/20 transition-all ${
          floating ? "translate-y-1" : "translate-y-0"
        } duration-1000 ease-in-out`}
      >
        <h1 className="text-5xl font-extrabold text-gray-800 drop-shadow-lg">
          Welcome to AI Tourism Guide
        </h1>
        <p className="text-lg mt-4 text-gray-700">
          Explore cities, discover places, and get personalized recommendations from our AI guide.
        </p>

        {/* 3D Tilt Button */}
        <Link href="/login">
          <button className="relative mt-6 px-6 py-3 text-lg font-semibold rounded-lg shadow-lg text-white 
            bg-gradient-to-r from-blue-500 to-teal-600 transition-all 
            transform hover:scale-110 hover:rotate-1 active:scale-95 active:rotate-0 
            before:absolute before:inset-0 before:bg-blue-400 before:blur-lg before:opacity-30 hover:before:opacity-50">
            Start Chat
          </button>
        </Link>
      </div>
    </div>
  );
};

export default WelcomePage;
