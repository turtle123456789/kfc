import TextInput from "@/components/text-input";
import UserBody from "@/components/user-admin-body";
import { useState, useContext } from "react";
import axios from "axios";
import AuthContext from "@/feature/auth-context";
import { signOut, checkAccountAndPassword, ChangePasswordV2 } from "@/feature/firebase/firebaseAuth";

export default function ResetPassword() {
  const { userInfo } = useContext(AuthContext);
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false); // Thêm state loading

  // Validation function
  const validatePasswords = () => {
    const newErrors = {};

    if (!password) {
      newErrors.password = "Mật khẩu hiện tại không được để trống!";
    }

    if (!newPassword) {
      newErrors.newPassword = "Mật khẩu mới không được để trống!";
    }

    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu mới và xác nhận mật khẩu không khớp!";
    }

    if (newPassword.length < 6) {
      newErrors.newPassword = "Mật khẩu mới phải có ít nhất 6 ký tự!";
    }

    setErrors(newErrors);

    // If there are no errors, return true to allow form submission
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = async () => {
    if (!validatePasswords()) {
      return; // Stop further execution if validation fails
    }

    setLoading(true); // Bắt đầu loading

    const { result, error } = await checkAccountAndPassword(userInfo.email, password);

    if (error) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: "Mật khẩu hiện tại không đúng! Vui lòng đăng nhập lại!",
      }));
      await signOut();
      setLoading(false); // Dừng loading nếu có lỗi
      return;
    }

    try {
      await ChangePasswordV2(userInfo.uid, newPassword, password);
      alert("Mật khẩu đã được đổi thành công!");
    } catch (err) {
      console.log(err);
      alert("Đã xảy ra lỗi khi cập nhật mật khẩu!");
    }

    setLoading(false); // Dừng loading khi thay đổi mật khẩu xong
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
          error={errors.password}
        />

        {/* New Password */}
        <TextInput
          name="Mật khẩu mới"
          callback={(text) => setNewPassword(text)}
          value={newPassword}
          type="password"
          error={errors.newPassword}
        />

        {/* Confirm Password */}
        <TextInput
          name="Xác nhận mật khẩu"
          callback={(text) => setConfirmPassword(text)}
          value={confirmPassword}
          type="password"
          error={errors.confirmPassword}
        />

        {/* Change Password Button */}
        <button
          onClick={handleChange}
          disabled={loading} // Vô hiệu hóa nút khi đang loading
          className="w-full btn-shadow rounded-full my-4 py-3 bg-red-600 text-white font-bold hover:bg-red-700 transition-colors"
        >
          {loading ? "Đang thay đổi mật khẩu..." : "Đổi mật khẩu"} {/* Hiển thị trạng thái loading */}
        </button>

        {/* Loading spinner */}
        {loading && (
          <div className="text-center mt-4">
            <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full border-t-transparent border-red-600" />
          </div>
        )}
      </div>
    </UserBody>
  );
}
