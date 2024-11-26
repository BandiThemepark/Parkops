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

const downloadBackup = async (backupDate: string) => {
  const data = await axios.get(
    `${BANDITHEMEPARK_API}database/download/${backupDate}`,
    {
      responseType: "blob",
      headers: {
        Authorization: `Bearer ${await useAuthentication.getAuthenticationToken()}`,
      },
    }
  );
  const urlBlob = window.URL.createObjectURL(new Blob([data.data]));

  const link = document.createElement("a");
  link.href = urlBlob;
  link.setAttribute(
    "download",
    `bandithemepark_database_backup_${backupDate}.zip`
  ); // Set the file name
  document.body.appendChild(link);

  // Trigger download and remove the link
  link.click();
  document.body.removeChild(link);
  return data;
};

export {
  getDatabaseStats,
  getAvailableBackups,
  createBackup,
  restoreBackup,
  downloadBackup,
};
