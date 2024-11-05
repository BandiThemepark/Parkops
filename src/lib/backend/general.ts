import axios from "axios";
import useAuthentication from "../../middleware/authentication";
import BANDITHEMEPARK_API from "../network";
import { useToast } from "@/components/ui/toast";
const { toast } = useToast();
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

const checkApiStatus = async () => {
  const data = await axios
    .get(`${BANDITHEMEPARK_API}`)
    .then((data) => {
      return data;
    })
    .catch((error) => {
      toast({
        title: "Connection problem",
        description:
          "There is a problem with the connection to the API. Please contact an administrator via Discord.",
        variant: "destructive",
      });
    });

  if (data && data.status != 200) {
    toast({
      title: "Connection problem",
      description:
        "There is a problem with the connection to the API. Please contact an administrator via Discord.",
      variant: "destructive",
    });
  }
};

export { getGeneralServerStats, getServerInfo, checkApiStatus };
