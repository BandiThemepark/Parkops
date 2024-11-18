import useAuthentication from "@/middleware/authentication";
import axios from "axios";
import BANDITHEMEPARK_API from "../network";

const getAllUsers = async () => {
  const data = await axios.get(`${BANDITHEMEPARK_API}registrations/users`, {
    headers: {
      Authorization: `Bearer ${await useAuthentication.getAuthenticationToken()}`,
    },
  });

  return data.data;
};

const createRegistration = async (role: string) => {
  const data = await axios.post(
    `${BANDITHEMEPARK_API}registrations`,
    {
      role: role,
    },
    {
      headers: {
        Authorization: `Bearer ${await useAuthentication.getAuthenticationToken()}`,
      },
    }
  );

  return data.data;
};

const verifyRegistration = async (registrationToken: string) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${BANDITHEMEPARK_API}registrations/verify/${registrationToken}`, {})
      .then((data) => {
        resolve(data.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const createUser = async (
  registrationToken: string,
  user: { name: string; email: string; password: string }
) => {
  const data = await axios.post(
    `${BANDITHEMEPARK_API}registrations/use/${registrationToken}`,
    {
      user: user,
    },
    {
      headers: {
        Authorization: `Bearer ${await useAuthentication.getAuthenticationToken()}`,
      },
    }
  );
  return data;
};

const deleteUser = async (uid: string) => {
  const data = await axios.delete(
    `${BANDITHEMEPARK_API}registrations/user/${uid}`,
    {
      headers: {
        Authorization: `Bearer ${await useAuthentication.getAuthenticationToken()}`,
      },
    }
  );
  return data;
};

export {
  deleteUser,
  getAllUsers,
  createRegistration,
  verifyRegistration,
  createUser,
};
