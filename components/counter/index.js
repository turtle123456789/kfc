import { AiOutlinePlusCircle, AiOutlineMinusCircle } from "react-icons/ai";
import { formatMoney } from "@/utils";

export default function Counter({
  quantity,
  increment,
  block = false,
  decrement,
  price,
}) {
  return (
    <div className="flex items-center right-5 top-[46%]">
      <AiOutlineMinusCircle
        className={`cursor-pointer w-7 h-7 ${
          quantity === 1 ? "text-[#ccc]" : ""
        }`}
        onClick={quantity === 1 ? () => {} : decrement}
      />
      <span className="mx-2">{quantity}</span>
      <AiOutlinePlusCircle
        className="cursor-pointer w-7 h-7"
        onClick={increment}
      />
      <span className={`${block ? "hidden" : ""} font-bold roboto ml-10`}>
        {formatMoney(price * quantity)} ₫
      </span>
    </div>
  );
}
