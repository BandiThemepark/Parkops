import useAuthentication from "../../middleware/authentication";
import {
  AchievementCategory,
  CreateAchievementCategory,
} from "../backendTypes";
import axios from "axios";

const getAchievementCategories = async () => {
  const data = await axios.get(
    "https://api.bandithemepark.net/achievements/categories",
    {
      headers: {
        Authorization: `Bearer ${await useAuthentication.getAuthenticationToken()}`,
      },
    }
  );

  console.log(data);
  return data.data;
};

const createAchievementCategory = async (
  category: CreateAchievementCategory
) => {
  const data = await axios.post(
    "https://api.bandithemepark.net/achievements/categories",
    category,
    {
      headers: {
        Authorization: `Bearer ${await useAuthentication.getAuthenticationToken()}`,
      },
    }
  );

  console.log(data);
  return data.data;
};

const updateAchievementCategory = async (category: AchievementCategory) => {
  const data = await axios.put(
    `https://api.bandithemepark.net/achievements/categories/${category.id}`,
    category,
    {
      headers: {
        Authorization: `Bearer ${await useAuthentication.getAuthenticationToken()}`,
      },
    }
  );

  console.log(data);
  return data.data;
};

const deleteAchievementCategory = async (categoryId: string) =>
  axios.delete(
    `https://api.bandithemepark.net/achievements/categories/${categoryId}`,
    {
      headers: {
        Authorization: `Bearer ${await useAuthentication.getAuthenticationToken()}`,
      },
    }
  );
export {
  getAchievementCategories,
  createAchievementCategory,
  updateAchievementCategory,
  deleteAchievementCategory,
};
