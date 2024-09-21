import React from "react";
const Footer = () => {
  return (
    <div>
      <div className="md:flex-row flex flex-col space-y-5 max-w-[95%] mx-auto px-5 md:px-10 pb-5">
        <div className="space-y-2">
          <img src="/footer_icon.png" alt="" className="w-10" />
          <h1 className="text-[30px] md:text-[35px] font-serif">
            Work with Starfish Today!
          </h1>
          <p className="text-gray-500 w-2/3">
            Use Starfish today and create a new whiteboard and start using it
            for free today.
          </p>
        </div>
        <div className="flex gap-16">
          <div>
            <h1 className="font-bold underline underline-offset-2">
              Main Pages
            </h1>
            <ul>
              <li>
                <a href="/">Home</a>
              </li>
              <li>
                <a href="/about">About</a>
              </li>
              <li>
                <a href="/contact">Contact</a>
              </li>
            </ul>
          </div>
          <div>
            <h1 className="font-bold underline underline-offset-2">
              Social Media
            </h1>
            <ul>
              <li>
                <a
                  href="https://www.linkedin.com/in/jatin-r/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Linkedin
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/Jatin748"
                  target="_blank"
                  rel="noreferrer"
                >
                  Github
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <hr />
      <div className="flex items-center justify-between py-5 px-10">
        <h1>
          Created by <span className="font-bold underline">Jatin</span>
        </h1>
        <h1>
          Design From <span className="font-bold underline">Webflow</span>
        </h1>
      </div>
    </div>
  );
};

export default Footer;
