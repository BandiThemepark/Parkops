import axios from "axios";
import BANDITHEMEPARK_API from "../network";
import useAuthentication from "@/middleware/authentication";
import { AudioSource } from "../backendTypes";

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

const getAudioPlaylists = async () => {
  const data = await axios.get(`${BANDITHEMEPARK_API}audioPlaylist`, {
    headers: {
      Authorization: `Bearer ${await useAuthentication.getAuthenticationToken()}`,
    },
  });
  return data;
};

const updateAudioPlaylistOrder = async (id: string, order: string[]) => {
  const data = await axios.post(
    `${BANDITHEMEPARK_API}audioPlaylist/order`,
    {
      id: id,
      order: order,
    },
    {
      headers: {
        Authorization: `Bearer ${await useAuthentication.getAuthenticationToken()}`,
      },
    }
  );
  return data;
};

const updateAudioPlaylistTracks = async (id: string, tracks: AudioSource[]) => {
  const data = await axios.put(
    `${BANDITHEMEPARK_API}audioPlaylist/tracks`,
    {
      id: id,
      audioSources: tracks,
    },
    {
      headers: {
        Authorization: `Bearer ${await useAuthentication.getAuthenticationToken()}`,
      },
    }
  );
  return data;
};

const updateAudioRegions = async (id: string, regions: string[]) => {
  console.log("updateAudioRegions", id, regions);
  const data = await axios.put(
    `${BANDITHEMEPARK_API}audioPlaylist/regions`,
    {
      id: id,
      regions: regions,
    },
    {
      headers: {
        Authorization: `Bearer ${await useAuthentication.getAuthenticationToken()}`,
      },
    }
  );
  return data;
};

export {
  getAudioSources,
  createAudioSource,
  deleteAudioSource,
  updateAudioPlaylistOrder,
  getAudioPlaylists,
  updateAudioPlaylistTracks,
  updateAudioRegions,
};
