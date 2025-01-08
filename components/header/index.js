  import Link from "next/link";
  import NavMenu from "./nav-menu";
  import Menu from "./menu";
  import { useState } from "react";
  import Image from "next/image";
  import Logo from "/assets/logo.svg";
  import { useRouter } from "next/router";

  export default function Header() {
    const router = useRouter();
    const [show, setShow] = useState(false);
    const pathname = router.pathname.split("/");
    return (
      <div className="relative bg-white z-[99] sticky top-0 w-[100vw] border-b-[1px] border-[#ccc]">
        <div className="container m-auto flex flex-row justify-between items-center p-4">
          <Image className="md:hidden" src={Logo} width={70} height={30} alt="" />
          <ul className="flex-row items-center hidden md:flex">
            <li>
              <Link href="/" className="block logo-url"></Link>
            </li>
            <li className="text-hover px-4">
              <Link
                className={`text-md uppercase roboto font-extrabold ${
                  pathname[1] === "thuc-don"
                    ? "underline decoration-red-500 underline-offset-2"
                    : ""
                }`}
                href="/thuc-don"
              >
                thực đơn
              </Link>
            </li>
            {/* <li className="text-hover px-4">
              <Link
                className={`text-md uppercase roboto font-extrabold ${
                  pathname[1] === "kfc-tabs"
                    ? "underline decoration-red-500 underline-offset-2"
                    : ""
                }`}
                href="/kfc-tabs/our-story"
              >
                tin tức
              </Link>
            </li> */}
          </ul>
          <NavMenu callback={() => setShow(!show)} />
        </div>
        <Menu show={show} callback={() => setShow(!show)} />
      </div>
    );
  }
