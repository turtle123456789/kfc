import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

export default function TextInput({
  value,
  callback,
  name,
  type = "text",
  disabled = false,
  error,
}) {
  const [show, setShow] = useState(false);

  const handleOnChange = (text) => {
    callback(text.target.value);
  };

  const HiddenPassword = () => {
    return !show ? (
      <FaRegEye
        onClick={() => setShow(!show)}
        className="cursor-pointer absolute top-3 right-3"
      />
    ) : (
      <FaRegEyeSlash
        onClick={() => setShow(!show)}
        className="cursor-pointer absolute top-3 right-3"
      />
    );
  };

  return (
    <div className="fromGroup font-sans bg-white relative mb-4">
      <input
        value={value}
        onChange={handleOnChange}
        type={show ? "text" : type}
        required
        disabled={disabled}
        className="w-full h-12 py-3 px-4 text-lg focus:outline-none focus:border-blue-500 peer pr-12 mb-2" // Added mb-2 for spacing between input and error message
      />
      <label
        className={`absolute left-4 top-3 transition-all duration-300 transform ${
          value || type === "password" ? "-translate-y-6 scale-75" : ""
        } ${disabled && "translate-y-[-20px] text-[10px]"}`}
      >
        {name}
      </label>
      {type === "password" && <HiddenPassword />}
      {error && (
        <p className="absolute text-red-400 text-xs mt-1">{error}</p> // Added mt-1 for margin-top between input and error
      )}
    </div>
  );
}

