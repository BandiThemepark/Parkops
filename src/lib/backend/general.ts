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

export { getGeneralServerStats };
