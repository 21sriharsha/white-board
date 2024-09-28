import React from "react";
import JoinRoomDrawer from "./ui/JoinRoomDrawer";
import CreateBoardDrawer from "./ui/CreateBoardDrawer";
const Hero = () => {
  return (
    <div className="py-44 space-y-5 text-center">
      <h1 className="text-5xl md:text-6xl font-sans font-semibold text-[#262626]">
        A Real-time Online Whiteboard
      </h1>
      <p className="text-gray-500 font-sans">
        Collaborate visually by drawing, writing, and sharing ideas on a digital
        whiteboard, Utilize a digital whiteboard to facilitate the sharing of
        ideas..
      </p>
      <div className="space-x-10 font-sans">
        <CreateBoardDrawer text="Create Board" />
        <JoinRoomDrawer text="Join Room" />
      </div>
    </div>
  );
};

export default Hero;
