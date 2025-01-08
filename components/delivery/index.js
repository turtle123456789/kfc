import Link from "next/link";
import { TbTruckDelivery } from "react-icons/tb";
import { WiSmoke } from "react-icons/wi";

export default function Delivery() {
  return (
    <div className="bg-white p-4 page-with-bar flex flex-col rounded-2xl items-center justify-center">
      <div className="flex items-end my-4">
        <WiSmoke className="rotate-[-90deg] w-3 h-3" />
        <WiSmoke className="rotate-[-90deg] w-5 h-5" />
        <WiSmoke className="rotate-[-90deg] w-7 h-7" />
        <TbTruckDelivery className="w-14 h-14 text-red-500" />
      </div>
      <h2 className="my-2">
        Đơn hàng của bạn sẽ được vẫn chuyển trong thời gian sớm nhất
      </h2>
      <h2 className="my-2">Cảm ơn bạn đã tin dùng ♥</h2>
      <Link
        className="bg-red-400 text-white px-4 py-2 rounded-full btn-shadow oswald"
        href={"/thuc-don"}
      >
        Tiếp tục mua hàng
      </Link>
    </div>
  );
}
