import { useEffect, useState, useContext } from "react";
import LayoutForm from "@/components/layout-form";
import TextInput from "@/components/text-input";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/router";
import { AiOutlineLoading } from "react-icons/ai";
import { CiCircleCheck } from "react-icons/ci";
import { validate } from "@/feature/validation";
import AuthContext from "@/feature/auth-context";
import { useParams } from "next/navigation";

export default function Success() {

  return (
    <LayoutForm>
		<div className="text-center m-auto flex gap-8 flex-col w-full h-full justify-center font-bold" >
			<h1>Xác nhận thanh toán thành công</h1>
	  		<Link href="/"><h2>Trở về trang chủ</h2></Link>
		</div>
      
    </LayoutForm>
  );
}
