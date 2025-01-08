import AuthContext from "@/feature/auth-context";
import Image from "next/image";
import { useContext, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Link from "next/link";
import ButtonLoading from "../button-loading";
import { formatMoney } from "@/utils";

export default function CardFood({ description, name, img, price, id }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { userInfo, increment } = useContext(AuthContext);
  const handleAdd = async () => {
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
  };
  return (
    <div className="relative rounded list-shadow p-[10px]">
      <div className="overflow-hidden">
        <Image
          className="min-h-48 w-full hover:scale-110 duration-700"
          src={img}
          width={200}
          height={200}
          alt=""
        />
      </div>
      <div className="roboto flex flex-row items-baseline justify-between px-2 text-xl font-semibold capitalize">
        <span>
          <Link href={`/thuc-don/order/${id}`}>{name}</Link>
        </span>
        <span>{formatMoney(price)}₫</span>
      </div>
      <p className="font-medium px-2 py-3 text-justify break-words pb-14 text-[14px] text-[#444]">
        {description}
      </p>
      <div className="absolute left-0 bottom-[10px] px-2 pb-2 w-[100%]">
        {!loading ? (
          <button
            onClick={userInfo ? handleAdd : () => router.push("/login")}
            className={`btn-shadow w-[100%] ${
              userInfo ? "bg-[#e4002b]" : "bg-[#ccc]"
            }  rounded-full relative py-2 cursor-pointer font-bold text-white`}
          >
            Thêm
          </button>
        ) : (
          <ButtonLoading />
        )}
      </div>
    </div>
  );
}
