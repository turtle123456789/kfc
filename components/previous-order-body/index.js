import Image from "next/image";
import { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";

export default function PreviousOrderBody({ date, address, list_item }) {
  const [show, setShow] = useState(false);
  return (
    <div className="border-b border-[#333]">
      <div className="relative flex justify-between oswald my-4 pr-20">
        <span>{date}</span>
        <span>
          {address.home} {address.wards} {address.district} {address.city}
        </span>
        <IoIosArrowDown
          className={`absolute right-0 top-[20%] w-5 h-5 cursor-pointer ${
            show ? "" : "rotate-180"
          }`}
          onClick={() => setShow(!show)}
        />
      </div>
      <ul className={`${!show ? "hidden" : "block"}`}>
        {list_item.map((item, i) => (
          <li
            key={i}
            className="flex items-center relative border p-2 rounded my-2"
          >
            <Image src={item.img} width={100} height={100} alt="" />
            <span className="ml-4"> {item.name}</span>
            <span className="absolute right-4">số lượng: {item.quantity}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
