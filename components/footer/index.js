import { useState, useEffect } from "react";
import axios from "axios";
import CardBody from "../card-body";
import DownloadApp from "../download-app";
import Image from "next/image";

export default function Footer() {
  const [type, setType] = useState(null);

  async function getType() {
    const res = await axios.get("/api/favourite");
    const data = await res.data;
    setType(data);
  }

  useEffect(() => {
    getType();
  }, []);

  if (type !== null) {
    return (
      <div className="bg-[#202124] text-[#ababab]">
        <div className="container mx-auto px-4">
          {/* Footer Content */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 pt-10">
            <CardBody title={"danh mục sản phẩm"} data={type} />

            {/* Về KFC */}
            <div>
              <h2 className="capitalize text-white font-semibold tracking-wide text-lg mb-4">
                Về KFC
              </h2>
              <ul className="space-y-2">
                <li className="text-sm capitalize hover:text-white cursor-pointer">
                  về chúng tôi
                </li>
                <li className="text-sm capitalize hover:text-white cursor-pointer">
                  tin tức KFC
                </li>
              </ul>
            </div>

            {/* Liên hệ KFC */}
            <div>
              <h2 className="capitalize text-white font-semibold tracking-wide text-lg mb-4">
                Liên hệ KFC
              </h2>
              <ul className="space-y-2">
                <li className="text-sm capitalize hover:text-white cursor-pointer">
                  liên hệ KFC
                </li>
              </ul>
            </div>

            {/* Chính sách hoạt động */}
            <div>
              <h2 className="capitalize text-white font-semibold tracking-wide text-lg mb-4">
                Chính sách hoạt động
              </h2>
              <ul className="space-y-2">
                <li className="text-sm capitalize hover:text-white cursor-pointer">
                  chính sách hoạt động
                </li>
                <li className="text-sm capitalize hover:text-white cursor-pointer">
                  chính sách quy định
                </li>
                <li className="text-sm capitalize hover:text-white cursor-pointer">
                  chính sách bảo mật thông tin
                </li>
              </ul>
            </div>

            {/* Download App */}
            <DownloadApp />
          </div>

          {/* Footer Bottom */}
          <span className="text-xs text-center block py-10">
            Copyright © 2023 KP Vietnam
          </span>
          <hr className="border-gray-600" />
          <div className="flex flex-col lg:flex-row justify-between items-center py-10 gap-6">
            {/* Company Info */}
            <div>
              <h2 className="capitalize text-white font-semibold tracking-wide text-lg mb-4">
                CÔNG TY LIÊN DOANH TNHH KP VIỆT NAM
              </h2>
              <ul className="space-y-2">
                <li className="text-sm capitalize">
                  Số 235 Hoàng Quốc Việt, Nam Từ Liêm, TP. Hà Nội
                </li>
                <li className="text-sm capitalize">Điện thoại: 0362272070</li>
                <li className="text-sm capitalize">Email: animetplink@gmail.com</li>
              </ul>
            </div>

            {/* Footer Logo */}
            <Image
              width={205}
              height={77}
              alt="Footer Logo"
              src="https://kfcvn-static.cognizantorderserv.com/images/email/logo_footer.png"
              className="max-w-full object-contain"
            />
          </div>
        </div>
      </div>
    );
  }
}
  