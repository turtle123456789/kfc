import { AiOutlineLoading } from "react-icons/ai";

export default function ButtonLoading() {
  return (
    <button
      className={`btn-shadow w-[100%] bg-[#333] rounded-full flex justify-center py-2 cursor-pointer font-bold text-white`}
    >
      <AiOutlineLoading
        className={`top-[24%] right-[47%] animate-spin w-5 h-5 text-red-500`}
      />
    </button>
  );
}
