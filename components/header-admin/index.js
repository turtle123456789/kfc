import Link from "next/link";
import NavMenu from "./nav-menu";
import Menu from "./menu";
import { useState } from "react";
import Image from "next/image";
import Logo from "/assets/logo.svg";
import { useRouter } from "next/router";

export default function AdminHeader() {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const pathname = router.pathname.split("/");

  return (
    <div className="relative bg-white z-[99] sticky top-0 w-full border-b border-gray-300 shadow-sm">
      <div className="flex justify-between items-center px-4 py-3 w-full">
        {/* Logo */}
        <Image
          className="cursor-pointer"
          src={Logo}
          width={70}
          height={30}
          alt="Admin Logo"
          onClick={() => router.push("/admin/dashboard")}
        />

        {/* Navigation Links */}
        <ul className="hidden md:flex items-center space-x-6">
          <li>
            <Link
              href="/admin/dashboard"
              className={`text-sm uppercase roboto font-extrabold ${
                pathname[1] === "admin/dashboard"
                  ? "underline decoration-red-500 underline-offset-2"
                  : "text-gray-700 hover:text-red-500"
              }`}
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              href="/admin/users"
              className={`text-sm uppercase roboto font-extrabold ${
                pathname[1] === "admin/users"
                  ? "underline decoration-red-500 underline-offset-2"
                  : "text-gray-700 hover:text-red-500"
              }`}
            >
              Users
            </Link>
          </li>
          <li>
            <Link
              href="/admin/orders"
              className={`text-sm uppercase roboto font-extrabold ${
                pathname[1] === "admin/orders"
                  ? "underline decoration-red-500 underline-offset-2"
                  : "text-gray-700 hover:text-red-500"
              }`}
            >
              Orders
            </Link>
          </li>
          <li>
            <Link
              href="/admin/products"
              className={`text-sm uppercase roboto font-extrabold ${
                pathname[1] === "admin/products"
                  ? "underline decoration-red-500 underline-offset-2"
                  : "text-gray-700 hover:text-red-500"
              }`}
            >
              Products
            </Link>
          </li>
        </ul>

        {/* Hamburger Button for Mobile */}
        <button
          className="md:hidden p-2 text-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
          onClick={() => setShow(!show)}
        >
          <svg
            className="w-6 h-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {show ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
         {/* NavMenu Component */}
         <NavMenu callback={() => setShow(!show)} />
      </div>

      {/* Mobile Menu */}
      {show && (
        <div className="bg-white border-t border-gray-200 w-full px-4 py-2">
          <ul className="flex flex-col space-y-4">
            <li>
              <Link
                href="/admin/dashboard"
                className="text-gray-700 font-bold uppercase hover:text-red-400"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="/admin/users"
                className="text-gray-700 font-bold uppercase hover:text-red-400"
              >
                Users
              </Link>
            </li>
            <li>
              <Link
                href="/admin/orders"
                className="text-gray-700 font-bold uppercase hover:text-red-400"
              >
                Orders
              </Link>
            </li>
            <li>
              <Link
                href="/admin/products"
                className="text-gray-700 font-bold uppercase hover:text-red-400"
              >
                Products
              </Link>
            </li>
          </ul>
        </div>
      )}
    </div>

  );
}
