import Link from "next/link";

export default function EmptyCart() {
  return (
    <div className="min-h-[590px] flex bg-auto bg-empty items-center w-[100%] p-10">
      <div className="w-[34%]">
        <p className="oswald text-4xl">
          GIỎ HÀNG CỦA BẠN ĐANG TRỐNG. HÃY ĐẶT MÓN NGAY!
        </p>
        <div className="mt-10 text-sm">
          <Link
            className="btn-shadow font-bold bg-red-500 px-5 py-3 text-white rounded-full mt-10"
            href="/thuc-don"
          >
            Bắt đầu đặt hàng
          </Link>
        </div>
      </div>
    </div>
  );
}
