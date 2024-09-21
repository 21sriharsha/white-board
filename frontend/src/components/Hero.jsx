import React from "react";
const Hero = () => {
  return (
    <div className="py-24 space-y-5 text-center bg-gradient-to-tr from-[#dce2ff] via-[#fef7f6] to-[#eceffc]">
      <h1 className="text-5xl md:text-6xl font-serif font-semibold text-[#262626]">
        A Real-time Online Whiteboard
      </h1>
      <p className="text-gray-500">
        Collaborate visually by drawing, writing, and sharing ideas on a digital
        whiteboard, Utilize a digital whiteboard to facilitate the sharing of
        ideas..
      </p>
      <button className="rounded-3xl py-2 px-5 border-2 mr-5 bg-[#262626] text-white">
        <a href="/white-board">Get Started</a>
      </button>
      <button className="rounded-3xl py-2 px-5 border-2 border-black">
        <a href="/contact">Contact Us</a>
      </button>
    </div>
  );
};

export default Hero;
