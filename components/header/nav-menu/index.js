import { useContext } from "react";
import AuthContext from "@/feature/auth-context";
import { FaUserCircle } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import Link from "next/link";

export default function NavMenu({ callback }) {
  const { userInfo, quantityCart } = useContext(AuthContext);

  return (
    <div className="flex flex-row items-center">
      <Link className="mx-2" href={`${userInfo ? "/user" : "/login"}`}>
        <FaUserCircle className="w-8 h-8 cursor-pointer" />
      </Link>
      <Link className="mx-2" href="/cart">
        <div
          className={`${
            quantityCart !== 0 ? "logo-cart" : "logo-empty-cart"
          } cursor-pointer leading-[50px] tracking-[-1px] text-center bg-[url('https://kfcvn-static.cognizantorderserv.com/images/web/cart.png?v=5.0')] bg-no-repeat w-[30px] h-[43px] bg-[length:350%]`}
        >
          <span className="roboto text-[15px]">{quantityCart}</span>
        </div>
      </Link>
      <GiHamburgerMenu
        className="w-8 h-8 mx-2 cursor-pointer"
        onClick={callback}
      />
    </div>
  );
}
