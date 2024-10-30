import axios from "axios";
import useAuthentication from "../../middleware/authentication";

const getAllCosmetics = async (query: string, type: string | undefined) => {
  const data = await axios.get(
    "https://api.bandithemepark.net/cosmetics?limit=1000&q=" +
      query +
      (type ? "&type=" + type : ""),
    {
      headers: {
        Authorization: `Bearer ${await useAuthentication.getAuthenticationToken()}`,
      },
    }
  );
  return data.data;
};

export { getAllCosmetics };
