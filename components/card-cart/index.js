import Image from "next/image";
import { useState, useContext } from "react";
import Counter from "../counter";
import { IoIosArrowDown } from "react-icons/io";
import { AiOutlineLoading } from "react-icons/ai";
import AuthContext from "@/feature/auth-context";
import axios from "axios";
import { deleteElementArray } from "@/feature/firebase/firebaseAuth";

export default function CardCart({
  img,
  id,
  description,
  name,
  price,
  quantity,
  callback,
}) {
  const { increment, decrement, userInfo } = useContext(AuthContext);
  const [show, setShow] = useState(true);
  const [value, setValue] = useState(quantity);
  const [loading, setLoading] = useState(false);
  const [display, setDisplay] = useState(true);
  const handleDecrement = async () => {
    setLoading(true);
    const data = {
      description,
      name,
      img,
      price,
      id,
      uid: userInfo.uid,
      quantity: -1,
    };
    const res = await axios.post("/api/cart", data);
    const { result } = await res.data;
    if (result === "success") {
      setLoading(false);
    }
    setValue(value - 1);
    decrement();
    callback(-price);
  };
  const handleIncrement = async () => {
    setLoading(true);
    const data = {
      description,
      name,
      img,
      price,
      id,
      uid: userInfo.uid,
      quantity: 1,
    };
    const res = await axios.post("/api/cart", data);
    const { result } = await res.data;
    if (result === "success") {
      setLoading(false);
    }
    increment();
    setValue(value + 1);
    callback({ price });
  };
  const handleDelete = async () => {
    setLoading(true);
    const res = await axios.put("/api/cart", { id, uid: userInfo.uid });
    const data = await res.data;
    if (data.success) {
      decrement(quantity);
      setDisplay(false);
      callback({ price, quantity });
    }
  };
  return (
    <div
      className={`${
        display ? "flex" : "hidden"
      } relative p-3 box-shadow my-4 relative rounded ${
        loading ? "opacity-50" : ""
      }`}
    >
      <Image src={img} alt="" width={200} height={200} />
      <div className="p-4 flex flex-col justify-between">
        <h2 className="font-bold capitalize">{name}</h2>
        <div>
          <span
            onClick={() => setShow(!show)}
            className="flex text-xs text-[#333] mt-2 cursor-pointer flex items-center"
          >
            Xem chi tiết
            <IoIosArrowDown className={`w-5 h-5 ${!show && "rotate-180"}`} />
          </span>
          <p
            className={`${
              show ? "hidden" : "block"
            } w-[45%] text-[#999] text-[15px] block`}
          >
            {description}
          </p>
        </div>
        <span
          onClick={handleDelete}
          className="cursor-pointer hover:underline roboto"
        >
          xóa
        </span>
      </div>
      <div className="absolute right-4 top-[50%]">
        <Counter
          price={price}
          quantity={value}
          decrement={handleDecrement}
          increment={handleIncrement}
        />
      </div>
      <div
        className={`${
          !loading ? "hidden" : "block"
        } absolute top-0 left-0 w-[100%] h-[100%] flex items-center justify-center`}
      >
        <AiOutlineLoading
          className={`top-[24%] right-[47%] animate-spin w-10 h-10 text-red-500`}
        />
      </div>
    </div>
  );
}
