import { useState, useEffect } from "react";
import axios from "axios";
import { AiOutlineClose } from "react-icons/ai";

export default function Menu({ show, callback }) {
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState(null);

  async function getType() {
    const res = await axios.get("/api/product");
    const data = await res.data;
    const newData = data.map((item) => {
      return item.type;
    });
    setType(Array.from(new Set(newData)));
    setLoading(true);
  }

  useEffect(() => {
    getType();
  }, []);

  return (
    <div
      className={`${
        show ? "right-0" : "right-[-100%]"
      } fixed top-0  w-[80%] sm:w-[350px] bg-white z-[1000] transition-all duration-300 box-shadow md:w-[350px]`}
    >
      {/* Header with Close Button */}
      <div className="flex justify-end items-center p-4 border-b border-[#ccc]">
        <AiOutlineClose className="w-6 h-6 cursor-pointer" onClick={callback} />
      </div>

      {/* Menu Content */}
      <div className="p-4 overflow-y-auto max-h-[calc(100vh-60px)]">
        <h2 className="font-bold text-lg uppercase">Danh mục món ăn</h2>
        <ul className="mt-2 text-sm capitalize">
          {loading &&
            type.map((item, index) => (
              <li key={index} className="text-hover py-2">
                <Link className="cursor-pointer">{item}</Link>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}
