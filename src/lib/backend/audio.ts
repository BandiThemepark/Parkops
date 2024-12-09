import axios from "axios";
import BANDITHEMEPARK_API from "../network";
import useAuthentication from "@/middleware/authentication";

const getAudioSources = async () => {
  const data = await axios.get(`${BANDITHEMEPARK_API}audiosources`, {
    headers: {
      Authorization: `Bearer ${await useAuthentication.getAuthenticationToken()}`,
    },
  });
  return data;
};

const createAudioSource = async (audioSource: any) => {
  const data = await axios.post(
    `${BANDITHEMEPARK_API}audiosources`,
    audioSource,
    {
      headers: {
        Authorization: `Bearer ${await useAuthentication.getAuthenticationToken()}`,
      },
    }
  );
  return data;
};

const deleteAudioSource = async (audioSourceId: string) => {
  const data = await axios.delete(
    `${BANDITHEMEPARK_API}audiosources/${audioSourceId}`,
    {
      headers: {
        Authorization: `Bearer ${await useAuthentication.getAuthenticationToken()}`,
      },
    }
  );
  return data;
};

export { getAudioSources, createAudioSource, deleteAudioSource };
