const BANDITHEMEPARK_API = "https://api.bandityhemepark.net";
const fetcData = async (
  method: string,
  endpoint: string,
  body: any
): Promise<(null | any)[]> => {
  return new Promise((resolve, reject) => {
    fetch(endpoint, {
      method: method,
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
