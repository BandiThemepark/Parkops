export enum AchievementType {
  NORMAL = "NORMAL",
  HISTORICAL = "HISTORICAL",
  EVENT = "EVENT",
  SECRET = "SECRET",
}

export enum AchievementTriggerType {
  REGION_ENTER = "REGION_ENTER",
  RIDECOUNTER_INCREASE = "RIDECOUNTER_INCREASE",
  SPECIAL = "SPECIAL",
}

export enum AchievementRewardType {
  COINS = "COINS",
  ITEM = "ITEM",
}

export type Achievement = {
  id: string;
  searchName: string;
  displayName: string;
  description: string;
  category: AchievementCategory;
  // players?: Player[];
  type: AchievementType;
  triggerType: AchievementTriggerType;
  triggerValue: string;
  rewardType: AchievementRewardType;
  rewardValue: string;
};

export enum AchievementCategoryType {
  NORMAL = "NORMAL",
  SPECIAL = "SPECIAL",
}

export type AchievementCategory = CreateAchievementCategory & {
  id: string;
};

export type CreateAchievementCategory = {
  searchName: string;
  displayName: string;
  description: string;
  type: AchievementCategoryType;
  achievements?: Achievement[];
  icon: string;
  iconModelData: number;
};
