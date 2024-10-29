import axios from "axios";
import useAuthentication from "../../middleware/authentication";

const getGeneralServerStats = async () => {
  const data = await axios.get(
    "https://api.bandithemepark.net/settings/generalInformation",
    {
      headers: {
        Authorization: `Bearer ${await useAuthentication.getAuthenticationToken()}`,
      },
    }
  );

  return data.data;
};

const getServerInfo = async () => {
  const data = await axios.get(
    "https://api.mcsrvstat.us/3/play.bandithemepark.net"
  );

  return data.data;
};

export { getGeneralServerStats, getServerInfo };
