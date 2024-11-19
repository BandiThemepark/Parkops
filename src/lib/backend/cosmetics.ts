import axios from "axios";
import useAuthentication from "../../middleware/authentication";
import BANDITHEMEPARK_API from "../network";

const getAllCosmetics = async () => {
  const data = await axios.get(`${BANDITHEMEPARK_API}cosmetics`, {
    headers: {
      Authorization: `Bearer ${await useAuthentication.getAuthenticationToken()}`,
    },
  });
  return data;
};

const createCosmetic = async (cosmetic: any) => {
  const data = await axios
    .post(`${BANDITHEMEPARK_API}cosmetics`, cosmetic, {
      headers: {
        Authorization: `Bearer ${await useAuthentication.getAuthenticationToken()}`,
      },
    })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error;
    });
  return data;
};

export { getAllCosmetics, createCosmetic };
