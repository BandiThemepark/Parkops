import axios from "axios";
import BANDITHEMEPARK_API from "../network";
import useAuthentication from "@/middleware/authentication";

const getFilesAtPath = async (path: string) => {
  const data = await axios.post(
    `${BANDITHEMEPARK_API}explorer`,
    {
      path: path,
    },
    {
      headers: {
        Authorization: `Bearer ${await useAuthentication.getAuthenticationToken()}`,
      },
    }
  );
  return data;
};

const uploadFile = async (
  path: string,
  fileName: string,
  base64File: string
) => {
  console.log(fileName);
  const data = await axios.post(
    `${BANDITHEMEPARK_API}explorer/upload`,
    {
      path: path,
      file: base64File,
      fileName: fileName,
    },
    {
      headers: {
        Authorization: `Bearer ${await useAuthentication.getAuthenticationToken()}`,
      },
    }
  );

  return data;
};

const deleteFile = async (path: string) => {
  const x = await axios.delete(`${BANDITHEMEPARK_API}explorer`, {
    data: {
      path: path,
    },
    headers: {
      Authorization: `Bearer ${await useAuthentication.getAuthenticationToken()}`,
    },
  });

  return x;
};

const downloadFile = async (path: string, fileName: string) => {
  const data = await axios.post(
    `${BANDITHEMEPARK_API}explorer/download`,
    {
      path: path,
      fileName: fileName,
    },
    {
      headers: {
        Authorization: `Bearer ${await useAuthentication.getAuthenticationToken()}`,
      },
    }
  );
  return data;
};

export { getFilesAtPath, uploadFile, deleteFile, downloadFile };
