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

export type CreateAchievement = {
  searchName: string;
  displayName: string;
  description: string;
  categoryId: string;
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

export type Cosmetic = {
  id: string;

  name: string;

  displayName: string;

  // lines seperated by &&
  description: string;

  consumable: boolean;

  type: string;

  price: number;

  requirements: string;

  metaData: string;

  // string array with all tags
  itemTags?: string;

  players?: PlayerCosmetic[];

  shops?: Shop[];
};

export type PlayerCosmetic = {
  id: string;

  player: Player;

  cosmetic: Cosmetic;

  cosmeticId: string;

  playerId: string;

  equipped: boolean;

  amount: number;

  color: number;

  // createdDate
  boughtAt: Date;
};

export type Shop = {
  id: string;

  name: string;

  displayName: string;

  warp: Warp;

  iconData: string;

  cosmetics: Cosmetic[];
};

export type Warp = {
  id: string;

  name: string;

  world: string;

  x: number;

  y: number;

  z: number;

  pitch: number;

  yaw: number;

  permission?: string;

  shops?: Shop[];
};

export type Player = {
  id: string;

  uuid: string;

  playername: string;

  coins: number;

  onServer: string;

  firstJoined: Date;

  lastJoined?: Date;

  updatedAt: Date;

  createdAt: Date;

  rank: string;

  lang: string;

  discordId?: string;

  playtime?: number;

  afkTime?: number;

  // punishments?: Punishment[]

  // rideCounters?: RideCounter[]

  achievements?: Achievement[];

  // @JoinTable()
  cosmetics?: PlayerCosmetic[];

  // playerTransactions?: PlayerTransaction[]
};
