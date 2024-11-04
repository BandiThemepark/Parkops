import useAuthentication from "../middleware/authentication";

const BANDITHEMEPARK_API = import.meta.env.PROD
  ? "https://api.bandithemepark.net/"
  : "http://localhost:3000/";
// const BANDITHEMEPARK_API = "http://localhost:3000/";
export default BANDITHEMEPARK_API;
