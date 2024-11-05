import useAuthentication from "../../middleware/authentication";
import {
  Achievement,
  AchievementCategory,
  CreateAchievement,
  CreateAchievementCategory,
  UpdateAchievement,
} from "../backendTypes";
import BANDITHEMEPARK_API from "../network";
import axios from "axios";

const getAchievementCategories = async () => {
  const data = await axios.get(`${BANDITHEMEPARK_API}achievements/categories`, {
    headers: {
      Authorization: `Bearer ${await useAuthentication.getAuthenticationToken()}`,
    },
  });

  console.log(data);
  return data.data;
};

const createAchievementCategory = async (
  category: CreateAchievementCategory
) => {
  const data = await axios.post(
    `${BANDITHEMEPARK_API}achievements/categories`,
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

const createAchievement = async (achievement: CreateAchievement) => {
  const data = await axios.post(
    `${BANDITHEMEPARK_API}achievements/achievements`,
    achievement,
    {
      headers: {
        Authorization: `Bearer ${await useAuthentication.getAuthenticationToken()}`,
      },
    }
  );

  console.log(data);
  return data.data;
};

const editAchievement = async (achievement: UpdateAchievement) => {
  console.log("ach:", achievement);
  const data = await axios.put(
    `${BANDITHEMEPARK_API}achievements/achievements/${achievement.id}`,
    achievement,
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
    `${BANDITHEMEPARK_API}achievements/categories/${category.id}`,
    category,
    {
      headers: {
        Authorization: `Bearer ${await useAuthentication.getAuthenticationToken()}`,
      },
    }
  );

  return data.data;
};

const deleteAchievement = async (achievementId: string) => {
  const data = await axios.delete(
    `${BANDITHEMEPARK_API}achievements/achievements/${achievementId}`,
    {
      headers: {
        Authorization: `Bearer ${await useAuthentication.getAuthenticationToken()}`,
      },
    }
  );
  return data.data;
};

const deleteAchievementCategory = async (categoryId: string) =>
  axios.delete(`${BANDITHEMEPARK_API}achievements/categories/${categoryId}`, {
    headers: {
      Authorization: `Bearer ${await useAuthentication.getAuthenticationToken()}`,
    },
  });
export {
  getAchievementCategories,
  createAchievementCategory,
  updateAchievementCategory,
  deleteAchievementCategory,
  createAchievement,
  editAchievement,
  deleteAchievement,
};
