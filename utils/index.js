export const upserCase = (text = "") => {
  return text.replace(/\s+/g, "").toUpperCase();
};
export const getType = (data) => {
  const newData = Array.from(data).map((item) => {
    return upserCase(item.type);
  });
  return Array.from(new Set(newData));
};
export function removeAccents(str) {
  var AccentsMap = [
    "aàảãáạăằẳẵắặâầẩẫấậ",
    "AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬ",
    "dđ",
    "DĐ",
    "eèẻẽéẹêềểễếệ",
    "EÈẺẼÉẸÊỀỂỄẾỆ",
    "iìỉĩíị",
    "IÌỈĨÍỊ",
    "oòỏõóọôồổỗốộơờởỡớợ",
    "OÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢ",
    "uùủũúụưừửữứự",
    "UÙỦŨÚỤƯỪỬỮỨỰ",
    "yỳỷỹýỵ",
    "YỲỶỸÝỴ",
  ];
  for (var i = 0; i < AccentsMap.length; i++) {
    var re = new RegExp("[" + AccentsMap[i].substr(1) + "]", "g");
    var char = AccentsMap[i][0];
    str = str.replace(re, char);
  }
  return str;
}
export const formatMoney = (input) => {
  return input.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};
export const getDate = () => {
  var currentDateTime = new Date();
  var year = currentDateTime.getFullYear();
  var month = String(currentDateTime.getMonth() + 1).padStart(2, "0");
  var day = String(currentDateTime.getDate()).padStart(2, "0");
  var hours = String(currentDateTime.getHours()).padStart(2, "0");
  var minutes = String(currentDateTime.getMinutes()).padStart(2, "0");
  var seconds = String(currentDateTime.getSeconds()).padStart(2, "0");
  var formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  return formattedDateTime;
};
