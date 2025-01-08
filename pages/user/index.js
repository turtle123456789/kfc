import React, { useState, useContext, useEffect } from "react";
import AuthContext from "@/feature/auth-context";
import UserBody from "@/components/user-body";
import TextInput from "@/components/text-input";
import axios from "axios";
import { AiOutlineLoading } from "react-icons/ai";

export default function User() {
  const { userInfo } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState("");
  const [loadingBtn, setLoadingBtn] = useState(true);
  async function fecthData() {
    const uid = userInfo.uid;
    const res = await axios.post("/api/item", { name: "users", id: uid });
    const data = await res.data;
    setName(data.name);
    setEmail(data.account);
    setPhone(data.phone ? data.phone : "");
    setLoading(true);
  }
  useEffect(() => {
    if (userInfo) {
      fecthData();
    }
  }, [userInfo]);
  const handleUpdate = async () => {
    setLoadingBtn(false);
    const result = {
      name,
      account: email,
      phone,
      col: "users",
      id: userInfo.uid,
    };
    const res = await axios.put("/api/item", result);
    const data = await res.data;
    if (data) {
      setLoadingBtn(true);
    }
    console.log(data);
  };
  return loading ? (
    <UserBody>
      <div className="md:w-[550px]">
        <h2 className="oswald uppercase text-4xl">chi tiết tài khoản</h2>
        <TextInput
          name={"Tên của bạn"}
          callback={(text) => setName(text)}
          value={name}
        />
        <TextInput
          name={"Email của bạn"}
          callback={(text) => setEmail(text)}
          value={email}
          disabled={true}
        />
        <TextInput
          name={"Số điện thoại của bạn"}
          callback={(text) => setPhone(text)}
          value={phone}
        />
        <button
          onClick={handleUpdate}
          className={`relative block ${
            !loadingBtn && "opacity-30"
          } btn-shadow w-[100%] rounded-full my-4 p-4 bg-red-600 text-white font-bold`}
        >
          Cập nhật tài khoản
          <div
            className={`${
              loadingBtn ? "hidden" : "block"
            } absolute top-0 left-0 w-[100%] h-[100%] flex items-center justify-center`}
          >
            <AiOutlineLoading
              className={`top-[24%] right-[47%] animate-spin w-10 h-10 text-black`}
            />
          </div>
        </button>
      </div>
    </UserBody>
  ) : null;
}
