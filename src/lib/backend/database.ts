import useAuthentication from "../../middleware/authentication";
import axios from "axios";
import BANDITHEMEPARK_API from "../network";
const getDatabaseStats = async () => {
  const data = await axios.get(`${BANDITHEMEPARK_API}database/getstats`, {
    headers: {
      Authorization: `Bearer ${await useAuthentication.getAuthenticationToken()}`,
    },
  });

  return data;
};

const getAvailableBackups = async () => {
  const data = await axios.get(`${BANDITHEMEPARK_API}database/getbackups`, {
    headers: {
      Authorization: `Bearer ${await useAuthentication.getAuthenticationToken()}`,
    },
  });

  return data;
};

const createBackup = async () => {
  const data = await axios.post(
    `${BANDITHEMEPARK_API}database/backup`,
    {},
    {
      headers: {
        Authorization: `Bearer ${await useAuthentication.getAuthenticationToken()}`,
      },
    }
  );

  return data;
};

const restoreBackup = async (backupDate: string) => {
  const data = await axios.get(
    `${BANDITHEMEPARK_API}database/restore/${backupDate}`,
    {
      headers: {
        Authorization: `Bearer ${await useAuthentication.getAuthenticationToken()}`,
      },
    }
  );

  return data;
};

export { getDatabaseStats, getAvailableBackups, createBackup, restoreBackup };
