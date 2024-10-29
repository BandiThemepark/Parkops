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
