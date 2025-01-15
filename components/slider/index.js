import axios from "axios";
import { useState, useEffect } from "react";
import Slider from "react-slick";
import Image from "next/image";

export default function SliderPanes() {
  const [data, setData] = useState([]);
  const fetchData = async () => {
    try {
      const res = await axios.get("/api/slider"); // Đảm bảo đợi kết quả từ API
      setData(res.data); // Cập nhật state sau khi nhận được dữ liệu
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu slider:", error);
      // Có thể thêm thông báo lỗi cho người dùng nếu cần
    }
  };
  
  const settings = {
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 2000,
    cssEase: "linear",
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div style={{ width: "100%" }}>
      <Slider {...settings}>
        {data.map((item) => {
          return (
            <Image
              key={item.id}
              width={0}
              height={0}
              sizes="100vw"
              src={item.link}
              alt=""
            />
          );
        })}
      </Slider>
    </div>
  );
}
