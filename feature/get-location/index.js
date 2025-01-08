import axios from "axios";

const API_Location = `https://api.bigdatacloud.net/data/reverse-geocode-client?`;
// const API_Key = `d550366b3e6152d7eb818783a7958475`;
const getLocation = async (location) => {
  const LINK = `${API_Location}latitude=${location.lat}&longitude=${location.lon}&localityLanguage=en`;

  const response = await axios.get(LINK);
  return response.data;
};

export const getPosition = async (callback) => {
  let result = null,
    error = null;
  try {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const newPosition = {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        };
        const data = await getLocation(newPosition);
        result = {
          locality: data.locality,
          city: data.city,
          countryName: data.countryName,
        };
        callback({ result });
      },
      (e) => {
        callback({ error: e });
      }
    );
  } catch (e) {
    error = "Định vị không được sử dụng ở trang web này";
    callback(error);
  }
};
