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
  const data = await axios.post(`${BANDITHEMEPARK_API}cosmetics`, cosmetic, {
    headers: {
      Authorization: `Bearer ${await useAuthentication.getAuthenticationToken()}`,
    },
  });

  return data;
};

const getCosmeticStatistics = async (id: string) => {
  const data = await axios.get(
    `${BANDITHEMEPARK_API}cosmetics/getCosmeticStatistics/${id}`,
    {
      headers: {
        Authorization: `Bearer ${await useAuthentication.getAuthenticationToken()}`,
      },
    }
  );
  return data;
};

const deleteCosmetic = async (id: string) => {
  const data = await axios.delete(`${BANDITHEMEPARK_API}cosmetics/${id}`, {
    headers: {
      Authorization: `Bearer ${await useAuthentication.getAuthenticationToken()}`,
    },
  });

  return data;
};

export {
  getAllCosmetics,
  deleteCosmetic,
  createCosmetic,
  getCosmeticStatistics,
};
