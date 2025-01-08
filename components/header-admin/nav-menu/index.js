import { useContext } from "react";
import AuthContext from "@/feature/auth-context";
import { FaUserCircle } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import Link from "next/link";

export default function NavMenu({ callback }) {
  const { userInfo } = useContext(AuthContext);   
  return (
    <div className="flex flex-row items-center">
      <Link className="mx-2" href={`${userInfo ? "/admin/user-admin" : "/admin"}`}>
        <FaUserCircle className="w-8 h-8 cursor-pointer" />
      </Link>

    </div>
  );
}
