import { Link as LinkScroll } from "react-scroll";
import { useState } from "react";

export default function NavScroll({ type }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed left-0 w-full bg-white z-10 text-xl text-[rgba(0,0,0,.5)] uppercase font-bold tracking-tight">
      {/* Hamburger Icon for Mobile */}
      <div className="md:hidden flex justify-between items-center p-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-2xl text-black"
        >
          {isOpen ? "✖️" : "☰"}
        </button>
      </div>

      {/* Nav Links */}
      <ul
        className={`container m-auto flex md:flex-row flex-col md:justify-between justify-center py-4 border-b-[1px] border-[#ccc] ${
          isOpen ? "flex" : "hidden"
        } md:flex md:flex-row`}
      >
        {type &&
          type.map((item, index) => {
            return (
              <li
                key={index}
                className={`px-5 cursor-pointer text-hover hover:text-black mb-2 md:mb-0`}
              >
                <LinkScroll
                  to={item.path}
                  spy={true}
                  smooth={true}
                  offset={-100}
                  duration={500}
                >
                  {item.name}
                </LinkScroll>
              </li>
            );
          })}
      </ul>
    </div>
  );
}
  