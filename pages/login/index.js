import { useContext, useEffect, useState } from "react";
import TextInput from "@/components/text-input";
import LayoutForm from "@/components/layout-form";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import {
  signInWithEmailAndPassword,
  signOut,
  signInGoogle,
  getItem,
  addDataWithID,
} from "@/feature/firebase/firebaseAuth";
import { useRouter } from "next/router";
import { validate } from "@/feature/validation";
import AuthContext from "@/feature/auth-context";

export default function Login() {
  const { userInfo } = useContext(AuthContext);
  const router = useRouter();
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [errorInput, setErrorInput] = useState({});
  const handleLogin = async () => {
    const listInput = [
      {
        type: "password",
        input: password,
      },
      {
        type: "account",
        input: account,
      },
    ];
    setErrorInput(validate(listInput));
    try{
      if (Object.keys(errorInput).length === 0) {
        const { result, error } = await signInWithEmailAndPassword(
          account,
          password
        );
        if (!error) {
          const id = result.user.uid;
          const user = await getItem("users", id);
          if (!user) {
            await signOut();
          } else {
            router.push("/");
          }
        } else {
          alert("thông tin tài khoản hoặc mặt khẩu không chính xác");
        }
      }
    }catch{
      console.log('error', error)
    }

  };
  useEffect(() => {
    if (userInfo) {
      router.push("/user");
    }
  }, [userInfo]);
  const loginWithGoogle = async () => {
    try{
      const { result, error } = await signInGoogle();
      if (!error) {
        const uid = result.uid;
        const user = await getItem("users", uid);
        console.log(user);
        if (!user) {
          const data = {
            account: result.email,
            password,
            phone: result.phoneNumber,
            name: result.displayName,
          };
          await addDataWithID("users", uid, data);
        }
        router.push("/");
      }
    }catch{
      console.log('error', error)
    }

  };

  return (
    <LayoutForm>
      <h2 className="oswald uppercase text-4xl mt-10">Đăng nhập</h2>
      <TextInput
        name="Nhập địa chỉ email của bạn"
        value={account}
        callback={(text) => setAccount(text)}
        error={errorInput.account}
      />

      <TextInput
        name="Nhập mật khẩu"
        value={password}
        callback={(text) => setPassword(text)}
        type="password"
        error={errorInput.password}
      />
      <div className="text-right mt-10 text-sm cursor-pointer">
        Bạn quên mật khẩu ?
      </div>
      <button
        onClick={handleLogin}
        className="w-[100%] p-4 bg-[#28a745] rounded-full text-white font-bold roboto btn-shadow my-4"
      >
        Đăng nhập
      </button>
      <div className="font-bold oswald text-[18px]">Hoặc tiếp tục với</div>
      <button
        onClick={loginWithGoogle}
        className="w-[100%] p-4 border border-[#999] rounded-full text-black justify-center font-bold roboto btn-shadow my-4 flex"
      >
        <FcGoogle className="w-5 h-5 mr-2" /> Đăng nhập bằng google
      </button>
      <div className="text-center">
        <span className="text-sm">Chưa có tài khoản ?</span>
        <Link
          className="font-semibold text-sm hover:underline"
          href={"/register"}
        >
          Tạo tài khoản
        </Link>
      </div>
    </LayoutForm>
  );
}
