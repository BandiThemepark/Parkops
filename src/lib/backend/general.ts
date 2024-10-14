import fetchData from "../network";

const getGeneralServerStats = async () => {
  const [data, error] = await fetchData(
    "get",
    "https://api.bandithemepark.net/settings/generalInformation",
    {}
  );

  console.log(data, error);
  if (error) {
    return [null, error];
  }

  return [data, null];
};

const getServerInfo = async () => {
  const [data, error] = await fetchData(
    "get",
    "https://api.mcsrvstat.us/3/play.bandithemepark.net",
    {}
  );

  console.log(data, error);
  if (error) {
    return [null, error];
  }

  return [data, null];
};

export { getGeneralServerStats, getServerInfo };
