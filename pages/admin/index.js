import { useContext, useState, useEffect } from "react";
import TextInput from "@/components/text-input";
import LayoutAdmin from "@/components/layout-form-admin";
import { FcGoogle } from "react-icons/fc";
import { signInWithEmailAndPassword, signOut, getItem, addDataWithID, checkAccountExists } from "@/feature/firebase/firebaseAuth";
import { useRouter } from "next/router";
import { validate } from "@/feature/validation";
import AuthContext from "@/feature/auth-context";
import axios from "axios";
import { async } from "@firebase/util";

export default function AdminLogin() {
  const { userInfo } = useContext(AuthContext);
  const router = useRouter();
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [errorInput, setErrorInput] = useState({});

  // Hàm kiểm tra và tạo tài khoản admin nếu chưa có
  const checkAndCreateAdmin = async () => {
    // thông tin tài khoản admin ban đầu
    const account = "Admin@gmail.com";
    const password = "Admin123";
    const name = "Admin";
    const role = "admin";
    const phone = 19001111;
    try{
      const { result, error } = await checkAccountExists(
        account
      );
      if (!error) {
        console.log("đã có tài khoản admin");
      } else {
        const res = await axios.post("/api/auth", {
          account,
          password,
          phone,
          name,
          role,
        });
        const data = await res.data;
        if (data.login) {
          console.log("Tạo tài khoản thành công");
        } else {
          console.log("Tài khoản đã có người sử dụng");
        }
      }
    }catch{
      console.log("Tạo tài khoản admin thất bại");
    }

  };

  // Hàm đăng nhập
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

    const currentErrorInput = validate(listInput);
    console.log("currentErrorInput",currentErrorInput.password);
    try{
      if (Object.keys(currentErrorInput).length === 0) {
        try {
          const { result, error } = await signInWithEmailAndPassword(
            account,
            password
          );
          console.log("error", error);
          if (!error) {
            const id = result.user.uid;
            const user = await getItem("users", id);
            if (user && user.role === "admin") {
              localStorage.setItem("uid", id);
              router.push("/admin/dashboard");
            } else {
              alert("Tài khoản không phải Admin");
              await signOut();
            }
          } else {
            alert("Thông tin tài khoản hoặc mặt khẩu không chính xác");
          }
        } catch (error) {
          console.log("Lỗi khi lấy thông tin admin:", error);
          alert("Thông tin tài khoản hoặc mật khẩu không chính xác.");
        }
      } else {
        alert(
          `Lỗi đăng nhập: ${
            currentErrorInput?.password 
              ? `\n - Mật khẩu: ${currentErrorInput.password}` 
              : ""
          }${
            currentErrorInput?.account 
              ? `\n - Tài khoản: ${currentErrorInput.account}` 
              : ""
          }`
        );
  
      }
    }catch{
      console.log("Đăng nhập thất bại");
    }

  };

  useEffect(() => {
    checkAndCreateAdmin(); // Kiểm tra và tạo tài khoản admin nếu chưa có
  }, []);

  // Nếu đã đăng nhập và là admin, chuyển hướng đến trang admin
  useEffect(() => {
    const checkUserRole = async () => {
      console.log("result details:", JSON.stringify(userInfo, null, 2));

      if (userInfo) {
        try {
          const user = await getItem("users", userInfo.uid);
          if (user && user.role === "admin") {
            router.push("/admin/dashboard");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };
    
    checkUserRole();
  }, [userInfo, router]);

  return (
    <LayoutAdmin>
      <h2 className="oswald uppercase text-4xl mt-10 text-center sm:text-left">Đăng nhập Admin</h2>
      
      <TextInput
        name="Nhập địa chỉ email của bạn"
        value={account}
        callback={(text) => setAccount(text)}
        error={errorInput.account}
        className="w-full sm:w-[300px] mx-auto"  // Đảm bảo input chiếm toàn bộ chiều rộng trên màn hình nhỏ
      />

      <TextInput
        name="Nhập mật khẩu"
        value={password}
        callback={(text) => setPassword(text)}
        type="password"
        error={errorInput.password}
        className="w-full sm:w-[300px] mx-auto"  // Đảm bảo input chiếm toàn bộ chiều rộng trên màn hình nhỏ
      />
      
      <button
        onClick={handleLogin}
        className="w-full sm:w-[300px] p-4 bg-[#28a745] rounded-full text-white font-bold roboto btn-shadow my-4 mx-auto block"
      >
        Đăng nhập
      </button>
    </LayoutAdmin>
  );
}
