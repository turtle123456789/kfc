  import React, { useState, useContext, useEffect } from "react";
  import AuthContext from "@/feature/auth-context";
  import UserBody from "@/components/user-admin-body";
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
        <br></br>
        <div className="md:w-[550px] w-full mx-auto p-4 md:p-0 md:pl-4">  
          {/* Heading */}
          <h2 className="oswald uppercase text-3xl md:text-4xl text-center mb-6">
            Chi tiết tài khoản
          </h2>

          {/* Name Input */}
          <TextInput
            name="Tên của bạn"
            callback={(text) => setName(text)}
            value={name}
          />

          {/* Email Input */}
          <TextInput
            name="Email của bạn"
            callback={(text) => setEmail(text)}
            value={email}
            disabled={true}
          />

          {/* Phone Input */}
          <TextInput
            name="Số điện thoại của bạn"
            callback={(text) => setPhone(text)}
            value={phone}
          />

          {/* Update Button */}
          <button
            onClick={handleUpdate}
            className={`relative block ${
              !loadingBtn ? "opacity-50 cursor-not-allowed" : ""
            } btn-shadow w-full rounded-full my-4 py-3 bg-red-600 text-white font-bold`}
            disabled={!loadingBtn}
          >
            Cập nhật tài khoản
            <div
              className={`${
                loadingBtn ? "hidden" : "flex"
              } absolute top-0 left-0 w-full h-full items-center justify-center`}
            >
              <AiOutlineLoading className="animate-spin w-6 h-6 text-white" />
            </div>
          </button>
        </div>
      </UserBody>
    ) : null;
  }
