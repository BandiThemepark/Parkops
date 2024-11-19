import { helpers, integer, minValue, required } from "@vuelidate/validators";

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

export const mayNotHaveSpaces = (value: string) => {
  return spaceCheck(value);
};

const spaceCheck = (value: string) => {
  return !value.includes(" ");
};

// Can only be of the following format
// LEATHER_HORSE_ARMOR
export const mustBeMaterial = (value: string) => {
  return materialCheck(value);
};

const materialCheck = (value: string) => {
  return value.match(/^[A-Z_]+$/);
};
