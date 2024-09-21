import React from "react";

const Header = () => {
  return (
    <div className="sticky top-5 flex items-center justify-center md:gap-8 gap-6 md:m-7 m-3 ">
      <div>
        <nav className="flex justify-center items-center gap-8 rounded-3xl px-5 py-3 shadow-lg bg-transparent backdrop-blur-sm">
          <ul className="md:flex gap-7 hidden">
            <li>
              <a
                href="/"
                className="text-sm hover:text-[#896cff] transition-colors duration-300 cursor-pointer"
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="/about"
                className="text-sm hover:text-[#896cff] transition-colors duration-300 cursor-pointer"
              >
                About
              </a>
            </li>
          </ul>
          <img src="/main_icon.svg" alt="icon" />
          <ul className="md:flex gap-7 hidden">
            <li>
              <a
                href="/contact"
                className="text-sm hover:text-[#896cff] transition-colors duration-300 cursor-pointer"
              >
                Contact
              </a>
            </li>
          </ul>
          <button className="w-5 h-5 md:hidden block">
            <img src="/menu_icon.png" alt="icon" />
          </button>
        </nav>
      </div>
      <div>
        <button className="px-6 py-2 rounded-3xl text-white text-sm bg-gradient-to-r from-blue-900 via-blue-500 via-blue-600 to-purple-400">
          <a href="/">Get Started &rarr;</a>
        </button>
      </div>
    </div>
  );
};

export default Header;
