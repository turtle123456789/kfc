import TextInput from "@/components/text-input";
import UserBody from "@/components/user-admin-body";
import { useState, useContext } from "react";
import axios from "axios";
import AuthContext from "@/feature/auth-context";
import { signOut, checkAccountAndPassword } from "@/feature/firebase/firebaseAuth";

export default function ResetPassword() {
  const { userInfo } = useContext(AuthContext);
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChange = async () => {
    const { result, error } = await checkAccountAndPassword(userInfo.email, password);

    if (error) {
      alert("Mật khẩu hiện tại không đúng! Vui lòng đăng nhập lại!");
      await signOut();
      return;
    }

    if (newPassword === confirmPassword) {
      try {
        const { data } = await axios.put("/api/auth", {
          newPassword,
          uid: userInfo.uid,
        });
        alert("Mật khẩu đã được đổi thành công!");
      } catch (err) {
        console.error(err);
        alert("Đã xảy ra lỗi khi cập nhật mật khẩu!");
      }
    } else {
      alert("Mật khẩu mới không khớp với mật khẩu xác nhận.");
    }
  };

  return (
    <UserBody>
      <div className="md:w-[550px] w-full mx-auto p-4 md:p-0">
        {/* Heading */}
        <h2 className="oswald uppercase text-3xl md:text-4xl text-center mb-6">
          Đặt lại mật khẩu
        </h2>

        {/* Current Password */}
        <TextInput
          name="Mật khẩu hiện tại"
          callback={(text) => setPassword(text)}
          value={password}
          type="password"
        />

        {/* New Password */}
        <TextInput
          name="Mật khẩu mới"
          callback={(text) => setNewPassword(text)}
          value={newPassword}
          type="password"
        />

        {/* Confirm Password */}
        <TextInput
          name="Xác nhận mật khẩu"
          callback={(text) => setConfirmPassword(text)}
          value={confirmPassword}
          type="password"
        />

        {/* Change Password Button */}
        <button
          onClick={handleChange}
          className="w-full btn-shadow rounded-full my-4 py-3 bg-red-600 text-white font-bold hover:bg-red-700 transition-colors"
        >
          Đổi mật khẩu
        </button>
      </div>
    </UserBody>
  );
}
