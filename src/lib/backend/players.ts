import useAuthentication from "../../middleware/authentication";
import fetchData from "../network";

const getAllPlayers = async () => {
  const [data, error] = await fetchData(
    "get",
    "https://api.bandithemepark.net/players",
    {}
  );

  console.log(data, error);
  if (error) {
    return [null, error];
  }

  return [data, null];
};

export { getAllPlayers };
