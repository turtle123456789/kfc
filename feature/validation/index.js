export function validate(data) {
  const passw = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
  const vnf_regex = /((09|03|07|08|05)+([0-9]{8})\b)/g;
  const emailRegex = /\S+@\S+\.\S+/;
  const format = /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;
  const listObject = data.reduce((acc, item) => {
    if (item.input === "") {
      return {
        ...acc,
        [item.type]: "Không thể bỏ trống mục này",
      };
    } else {
      if (item.type === "password" && passw.test(item.input) === false) {
        return {
          ...acc,
          [item.type]:
            "Mật khẩu phải dài ít nhất 8 ký tự và chứa ít nhất một chữ thường, một chữ in hoa và một chữ số",
        };
      }
      if (item.type === "account" && !emailRegex.test(item.input)) {
        return {
          ...acc,
          [item.type]: "Email không chính xác",
        };
      }
      if (item.type === "name" && format.test(item.input)) {
        return {
          ...acc,
          [item.type]: "Tên không chứ ký tự đặc biệt",
        };
      }
      if (item.type === "phone" && vnf_regex.test(item.input) === false) {
        return {
          ...acc,
          [item.type]: "Số điện thoại của bạn không đúng định dạng",
        };
      }
    }
    return acc;
  }, {});
  return listObject;
}
