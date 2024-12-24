import axios from "axios";
import BANDITHEMEPARK_API from "../network";
import useAuthentication from "@/middleware/authentication";

const getShops = async () => {
  const data = axios.get(`${BANDITHEMEPARK_API}shops`, {
    headers: {
      Authorization: `Bearer ${await useAuthentication.getAuthenticationToken()}`,
    },
  });
  return data;
};

const getOneShop = async (id: string) => {
  const data = axios.get(`${BANDITHEMEPARK_API}shops/${id}`, {
    headers: {
      Authorization: `Bearer ${await useAuthentication.getAuthenticationToken()}`,
    },
  });
  return data;
};

export { getShops, getOneShop };
