import { useState, useEffect } from "react";
import axios from "axios";
import { AiOutlineClose } from "react-icons/ai";
import Link from "next/link";
export default function Menu({ show, callback }) {
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState(null);
  async function getType() {
    setLoading(true); // Bắt đầu trạng thái loading trước khi gọi API
    try {
      const res = await axios.get("/api/product");
      const data = await res.data;
      const newData = data.map((item) => item.type);
      
      setType(Array.from(new Set(newData))); // Lọc các giá trị duy nhất từ data
    } catch (error) {
      console.error("Lỗi khi lấy loại sản phẩm:", error);
      // Thêm xử lý lỗi nếu cần, ví dụ thông báo cho người dùng
    } finally {
      setLoading(false); // Đảm bảo trạng thái loading luôn được tắt khi hoàn thành
    }
  }
  
  useEffect(() => {
    getType();
  }, []);

  return (
    <div
      className={`${
        show ? "block right-[0px]" : "hidden right-[-350px]"
      } absolute top-0 right-0 delay-300 box-shadow h-[100vh] w-[350px] bg-white`}
    >
      <div className="page-with-bar p-2 flex flex-col items-end border-b border-[#ccc] z-[1000]">
        <div className="">
          <AiOutlineClose
            className="w-5 h-5 cursor-pointer"
            onClick={callback}
          />
        </div>
      </div>
      <div className="p-4">
        <h2 className="font-bold text-lg uppercase">Danh mục món ăn</h2>
        <ul className="mt-2 text-sm capitalize">
          {loading &&
            type.map((item, index) => (
              <li key={index} className="text-hover">
                <Link href="/" className="cursor-pointer">{item}</Link>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}
