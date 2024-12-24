import useAuthentication from "../../middleware/authentication";
import axios from "axios";
import BANDITHEMEPARK_API from "../network";
const getAllPlayers = async () => {
  const data = await axios.get("https://api.bandithemepark.net/players", {
    headers: {
      Authorization: `Bearer ${await useAuthentication.getAuthenticationToken()}`,
    },
  });

  return data.data;
};

const getOnlinePlayerStats = async (from: string, to: string) => {
  const data = await axios.get(
    `${BANDITHEMEPARK_API}players/stats?fromDate=${from}&toDate=${to}`,
    {
      headers: {
        Authorization: `Bearer ${await useAuthentication.getAuthenticationToken()}`,
      },
    }
  );

  return data.data;
};

export { getAllPlayers, getOnlinePlayerStats };
