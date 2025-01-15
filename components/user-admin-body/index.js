import React, { useState, useContext } from "react";
import Link from "next/link";
import AuthContext from "@/feature/auth-context";
import Loader from "../loader";
import { signOut } from "@/feature/firebase/firebaseAuth";
import { useRouter } from "next/router";
import axios from "axios";

export default function UserBody({ children }) {
  const router = useRouter();
  const pathname = router.pathname;
  const { userInfo } = useContext(AuthContext);
  const [name, setName] = useState("");

  const handleSignOut = async () => {
    try{
      await signOut();
      router.push("/admin");
    }catch{
      console.log('error', error)
    }

  };
  async function fecthData() {
    try{
      const uid = userInfo.uid;
      const res = await axios.post("/api/item", { name: "users", id: uid });
      const data = await res.data;
      setName(data.name);
    }catch{
      console.log('error', error)
    }

  }
  if (!userInfo) {
    return <Loader />;
  }
  if (userInfo) {
    fecthData();
  } 

  return (
    <div className="flex flex-col lg:flex-row justify-between container mx-auto py-  px-4 lg:px-0">
      {/* Sidebar */}
      <div className="w-full lg:w-[30%] ml-auto mb-8 lg:mb-0">
        <div className=" text-white bg-[#202124] rounded-xl py-6 px-4">
          <div className="h-[87px] bg-center bg-no-repeat bg-[url(https://kfcvn-static.cognizantorderserv.com/images/web/profile-circle.png?v=5.0)]"></div>
          <h2 className="flex flex-col items-center oswald text-2xl lg:text-3xl mt-4">
            <span>Xin chào,</span>
            <span>{name}</span>
          </h2>
          <button
            className="underline hover:no-underline mt-2 text-sm lg:text-base"
            onClick={handleSignOut}
          >
            Đăng xuất
          </button>
          <ul className="mt-8 space-y-6 text-sm lg:text-base">
            <li
              className={`${
                pathname === "/user" && "text-white"
              } text-[#999] hover:text-white cursor-pointer`}
            >
              <Link href={"/admin/user-admin"}>Chi tiết tài khoản</Link>
            </li>
            <li
              className={`${
                pathname === "/user/reset-password" && "text-white"
              } text-[#999] hover:text-white cursor-pointer`}
            >
              <Link href={"/admin/user-admin/reset-password"}>Đặt lại mật khẩu</Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full lg:w-[65%] min-h-[500px] lg:min-h-[700px] text-right">
        {children}
      </div>
    </div>
  );
}
