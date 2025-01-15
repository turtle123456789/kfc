import { useRouter } from "next/router";
import Link from "next/link";
import React, { useContext } from "react";
import AuthContext from "@/feature/auth-context";
import Loader from "../loader";
import { signOut } from "@/feature/firebase/firebaseAuth";

export default function UserBody({ children }) {
  const router = useRouter();
  const pathname = router.pathname;
  const { userInfo } = useContext(AuthContext);
  const handleSignOut = async () => {
    try{
      await signOut();
      router.push("/login");
    }catch{
      console.log('error', error)
    }
   
  };
  if (!userInfo) {
    return <Loader />;
  }
  return (
    <div className="flex justify-between container m-auto py-4">
      <div className="w-[30%]">
        <div className="sticky top-[150px] text-white bg-[#202124] rounded-xl py-4">
          <div className="h-[87px] bg-[50%] mt-16 mb-10 bg-no-repeat bg-[url(https://kfcvn-static.cognizantorderserv.com/images/web/profile-circle.png?v=5.0)]"></div>
          <h2 className="flex flex-col items-center oswald text-3xl">
            <span>Xin chào,</span>
            <span>{userInfo.displayName}</span>
          </h2>
          <button
            className="ml-10 underline hover:no-underline mt-2"
            onClick={handleSignOut}
          >
            Đăng xuất
          </button>
          <ul className="ml-10 mt-10 ">
            <li
              className={`${
                pathname === "/user/previous-orders" && "text-[#fff]"
              } text-[#999] hover:text-[#fff] cursor-pointer my-8`}
            >
              <Link href={"/user/previous-orders"}>Đơn hàng đã đặt</Link>
            </li>
            {/* <li
              className={`${
                pathname === "/user/addresses" && "text-[#fff]"
              } text-[#999] hover:text-[#fff] cursor-pointer my-8`}
            >
              <Link href={"/user/addresses"}>Địa chỉ của bạn</Link>
            </li> */}
            <li
              className={`${
                pathname === "/user" && "text-[#fff]"
              } text-[#999] hover:text-[#fff] cursor-pointer my-8`}
            >
              <Link href={"/user"}>Chi tiết tài khoản</Link>
            </li>
            <li
              className={`${
                pathname === "/user/reset-password" && "text-[#fff]"
              } text-[#999] hover:text-[#fff] cursor-pointer my-8`}
            >
              <Link href={"/user/reset-password"}>Đặt lại mật khẩu</Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="w-[65%] min-h-[700px]">{children}</div>
    </div>
  );
}
