import useAuthentication from "../../middleware/authentication";
import axios from "axios";
const getAllPlayers = async () => {
  const data = await axios.get("https://api.bandithemepark.net/players", {
    headers: {
      Authorization: `Bearer ${await useAuthentication.getAuthenticationToken()}`,
    },
  });

  return data.data;
};

export { getAllPlayers };
