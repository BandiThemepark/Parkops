import useAuthentication from "../middleware/authentication";

const BANDITHEMEPARK_API = "https://api.bandityhemepark.net";
const fetcData = async (
  method: string,
  endpoint: string,
  useAuth: boolean,
  body: any
): Promise<(null | any)[]> => {
  const token = await useAuthentication.getAuthenticationToken();
  return new Promise((resolve, reject) => {
    fetch(endpoint, {
      method: method,
      body: JSON.stringify(body),
      headers: useAuth
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {},
    })
      .then(async (response) => {
        if (response.ok) {
          return await response.json();
        } else {
          reject([null, response]);
        }
      })
      .then((data) => {
        // try converting the data to JSON
        resolve([data, null]);
      })
      .catch((error) => {
        reject([null, error]);
      });
  });
};

export default fetcData;
