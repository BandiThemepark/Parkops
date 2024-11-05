import { integer, minValue, required } from "@vuelidate/validators";

export const createCateogryValidation = {
  displayName: {
    required,
  },
  searchName: {
    required,
  },
  description: {
    required,
  },
  type: {
    required,
  },
  icon: {
    required,
  },
  iconModelData: {
    required,
    integer,
    minValue: minValue(0),
  },
};

export const createAchievementValidation = {
  searchName: {
    required,
  },
  displayName: {
    required,
  },
  description: {
    required,
  },
  type: {
    required,
  },
  triggerType: {
    required,
  },
  triggerValue: {
    required,
  },
  rewardValue: {
    required,
  },
  rewardType: {
    required,
  },
};
