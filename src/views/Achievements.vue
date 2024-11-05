<script lang="ts" setup>
// Vue Core Imports
import { ref, watch } from "vue";

// UI Components
import Button from "../components/ui/button/Button.vue";
import Badge from "../components/ui/badge/Badge.vue";
import Skeleton from "../components/ui/skeleton/Skeleton.vue";
import { Input } from "../components/ui/input";

// Card Components
import { Card, CardHeader, CardContent } from "../components/ui/card";

// Sheet Components
import Sheet from "../components/ui/sheet/Sheet.vue";
import SheetTrigger from "../components/ui/sheet/SheetTrigger.vue";
import SheetContent from "../components/ui/sheet/SheetContent.vue";
import SheetHeader from "../components/ui/sheet/SheetHeader.vue";
import SheetTitle from "../components/ui/sheet/SheetTitle.vue";
import SheetDescription from "../components/ui/sheet/SheetDescription.vue";

// Select Components
import Select from "../components/ui/select/Select.vue";
import SelectTrigger from "../components/ui/select/SelectTrigger.vue";
import SelectValue from "../components/ui/select/SelectValue.vue";
import SelectGroup from "../components/ui/select/SelectGroup.vue";
import SelectLabel from "../components/ui/select/SelectLabel.vue";
import SelectContent from "../components/ui/select/SelectContent.vue";
import SelectItem from "../components/ui/select/SelectItem.vue";

// Form Components
import FormItem from "../components/ui/form/FormItem.vue";
import { FormField } from "../components/ui/form";
import FormLabel from "../components/ui/form/FormLabel.vue";
import FormControl from "../components/ui/form/FormControl.vue";
import FormDescription from "../components/ui/form/FormDescription.vue";
import { Form } from "vee-validate";

// Custom Components
import DashboardProvider from "../components/custom/DashboardProvider.vue";

// Libraries and Utilities
import { DialogRoot } from "radix-vue";
import useVuelidate from "@vuelidate/core";

// Backend Imports
import {
  createAchievementCategory,
  deleteAchievementCategory,
  getAchievementCategories,
  updateAchievementCategory,
} from "../lib/backend/achievements";
import {
  AchievementCategory,
  CreateAchievementCategory,
  AchievementType,
  Achievement,
} from "../lib/backendTypes";

// Validation
import { createCateogryValidation } from "../lib/validation/validations";

import { toast, useToast } from "@/components/ui/toast/use-toast";

const isLoading = ref(false);
const categories = ref<AchievementCategory[]>([]);

const initialDataLoad = async () => {
  isLoading.value = true;
  const data = await Promise.all([getAchievementCategories()]);
  categories.value = data[0].data;

  console.log(categories.value);

  isLoading.value = false;
};

(async () => {
  await initialDataLoad();
})();

const selectedCategory = ref<AchievementCategory | null>(null);

const toEditCategory = ref({
  id: "",
  displayName: "",
  searchName: "",
  description: "",
  type: "",
  icon: "",
  iconModelData: 0,
});
const clickEditCategory = (category: AchievementCategory) => {
  console.log(category);
  toEditCategory.value = category;
  isEditCategoryOpen.value = true;
};

const createCategoryValues = ref({
  displayName: "",
  searchName: "",
  description: "",
  type: "",
  icon: "",
  iconModelData: 0,
});

const v$category = useVuelidate(createCateogryValidation, createCategoryValues);
const v$editcategory = useVuelidate(createCateogryValidation, toEditCategory);

const isCategoryOpen = ref();
const isEditCategoryOpen = ref();

const createCategory = async () => {
  v$category.value.$validate();
  if (v$category.value.$error) {
    console.log(v$category.value.$errors);
    console.log("error");
    return;
  }
  const data = await createAchievementCategory(
    createCategoryValues.value as CreateAchievementCategory
  );
  console.log(createCategoryValues.value);
  console.log(data);
  // console.log(error);
  clearCateogryForm();
  await initialDataLoad();
  isCategoryOpen.value = false;
  toast({
    title: "Category created",
    description: "The category has been created successfully",
  });
};

const removeAchievementCategory = async (id: string) => {
  const data = await deleteAchievementCategory(id);
  await initialDataLoad();
  isEditCategoryOpen.value = false;
  toast({
    title: "Category removed",
    description: "The category has been removed successfully",
  });
};

const updateCategory = async () => {
  v$editcategory.value.$validate();
  console.log(toEditCategory.value);
  if (v$editcategory.value.$error) {
    console.log(v$editcategory.value.$errors);
    console.log("error");
    return;
  }
  const data = await updateAchievementCategory(
    toEditCategory.value as AchievementCategory
  );
  clearUpdateForm();

  await initialDataLoad();
  isEditCategoryOpen.value = false;
};

const clearCateogryForm = () => {
  createCategoryValues.value = {
    displayName: "",
    searchName: "",
    description: "",
    type: "",
    icon: "",
    iconModelData: 0,
  };
};
const clearUpdateForm = () => {
  toEditCategory.value = {
    id: "",
    displayName: "",
    searchName: "",
    description: "",
    type: "",
    icon: "",
    iconModelData: 0,
  };
};

const onUpdateOpenStateCategories = (value: boolean) => {
  // console.log(value);
  if (value == false) {
    clearCateogryForm();
  }
};

const clickCategory = (category: AchievementCategory) => {
  selectedCategory.value = category;
};
</script>

<template>
  <DialogRoot>
    <Sheet
      @update:open="onUpdateOpenStateCategories"
      v-model:open="isEditCategoryOpen"
    >
      <SheetContent>
        <SheetHeader class="mb-4">
          <SheetTitle>Edit {{ toEditCategory?.displayName }}</SheetTitle>
          <SheetDescription>
            Edit the category to group your achievements.
          </SheetDescription>
        </SheetHeader>
        <div>
          <Form class="space-y-6" @submit="updateCategory">
            <FormField name="displayname">
              <FormItem>
                <FormLabel>Displayname</FormLabel>
                <Input
                  v-model="toEditCategory.displayName"
                  placeholder="John Doe"
                />
                <span
                  class="text-xs text-red-500 font-medium"
                  v-if="v$editcategory.displayName.$error"
                  >{{
                    v$editcategory.displayName.$error
                      ? v$editcategory.displayName.$errors[0].$message
                      : ""
                  }}</span
                >
              </FormItem>
            </FormField>
            <FormField name="searchName">
              <FormItem>
                <FormLabel>Searchname</FormLabel>
                <FormControl>
                  <Input
                    v-model="toEditCategory.searchName"
                    placeholder="john_doe"
                  />
                </FormControl>
                <FormDescription>
                  The name to search for ingame
                </FormDescription>
                <span
                  class="text-xs text-red-500 font-medium"
                  v-if="v$editcategory.searchName.$error"
                  >{{
                    v$editcategory.searchName.$error
                      ? v$editcategory.searchName.$errors[0].$message
                      : ""
                  }}</span
                >
              </FormItem>
            </FormField>
            <FormField name="description">
              <FormItem>
                <FormLabel> Description </FormLabel>
                <FormControl>
                  <Input
                    v-model="toEditCategory.description"
                    placeholder="Description"
                  />
                </FormControl>
                <FormDescription>
                  A short description of the category (Add && for a new line)
                </FormDescription>
                <span
                  class="text-xs text-red-500 font-medium"
                  v-if="v$editcategory.description.$error"
                  >{{
                    v$editcategory.description.$error
                      ? v$editcategory.description.$errors[0].$message
                      : ""
                  }}</span
                >
              </FormItem>
            </FormField>
            <FormField name="categorytype">
              <FormItem>
                <FormLabel> Category type </FormLabel>
                <FormControl>
                  <Select v-model="toEditCategory.type">
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel> Categories </SelectLabel>
                        <SelectItem value="NORMAL">Normal</SelectItem>
                        <SelectItem value="EVENT">Event</SelectItem>
                        <SelectItem value="HIDDEN">Hidden</SelectItem>
                        <SelectItem value="HISTORICAL">Historical</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <span
                    class="text-xs text-red-500 font-medium"
                    v-if="v$editcategory.type.$error"
                    >{{
                      v$editcategory.type.$error
                        ? v$editcategory.type.$errors[0].$message
                        : ""
                    }}</span
                  >
                </FormControl>
              </FormItem>
            </FormField>
            <FormField name="icon">
              <FormItem>
                <FormLabel> Icon </FormLabel>
                <FormControl>
                  <Input
                    v-model="toEditCategory.icon"
                    placeholder="DIAMOND_SWORD"
                  />
                </FormControl>
                <FormDescription>
                  Please use the Minecraft material name
                </FormDescription>
                <span
                  class="text-xs text-red-500 font-medium"
                  v-if="v$editcategory.icon.$error"
                  >{{
                    v$editcategory.icon.$error
                      ? v$editcategory.icon.$errors[0].$message
                      : ""
                  }}</span
                >
              </FormItem>
            </FormField>
            <FormField name="modelData">
              <FormItem>
                <FormLabel> Icon modeldata </FormLabel>
                <FormControl>
                  <Input
                    v-model="toEditCategory.iconModelData"
                    placeholder="10010110"
                  />
                </FormControl>
                <span
                  class="text-xs text-red-500 font-medium"
                  v-if="v$editcategory.iconModelData.$error"
                  >{{
                    v$editcategory.iconModelData.$error
                      ? v$editcategory.iconModelData.$errors[0].$message
                      : ""
                  }}</span
                >
              </FormItem>
            </FormField>
            <div class="flex justify-between">
              <Button
                @click="removeAchievementCategory(toEditCategory.id)"
                type="reset"
                variant="destructive"
                >Remove</Button
              >
              <Button type="submit"> Update </Button>
            </div>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  </DialogRoot>
  <DashboardProvider :has-padding="false">
    <div class="flex h-full">
      <aside class="w-[400px] flex flex-col h-full border-r border-r-border">
        <div
          class="flex items-center w-full justify-between border-b border-b-border p-4"
        >
          <h1 class="text-lg font-bold">Categories</h1>
          <DialogRoot>
            <Sheet
              @update:open="onUpdateOpenStateCategories"
              v-model:open="isCategoryOpen"
            >
              <SheetTrigger>
                <Button>Create</Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader class="mb-4">
                  <SheetTitle>Create Category</SheetTitle>
                  <SheetDescription>
                    Create a new category to group your achievements.
                  </SheetDescription>
                </SheetHeader>
                <div>
                  <Form class="space-y-6" @submit="createCategory">
                    <FormField name="displayname">
                      <FormItem>
                        <FormLabel>Displayname</FormLabel>
                        <Input
                          v-model="createCategoryValues.displayName"
                          placeholder="John Doe"
                        />
                        <span
                          class="text-xs text-red-500 font-medium"
                          v-if="v$category.displayName.$error"
                          >{{
                            v$category.displayName.$error
                              ? v$category.displayName.$errors[0].$message
                              : ""
                          }}</span
                        >
                      </FormItem>
                    </FormField>
                    <FormField name="searchName">
                      <FormItem>
                        <FormLabel>Searchname</FormLabel>
                        <FormControl>
                          <Input
                            v-model="createCategoryValues.searchName"
                            placeholder="john_doe"
                          />
                        </FormControl>
                        <FormDescription>
                          The name to search for ingame
                        </FormDescription>
                        <span
                          class="text-xs text-red-500 font-medium"
                          v-if="v$category.searchName.$error"
                          >{{
                            v$category.searchName.$error
                              ? v$category.searchName.$errors[0].$message
                              : ""
                          }}</span
                        >
                      </FormItem>
                    </FormField>
                    <FormField name="description">
                      <FormItem>
                        <FormLabel> Description </FormLabel>
                        <FormControl>
                          <Input
                            v-model="createCategoryValues.description"
                            placeholder="Description"
                          />
                        </FormControl>
                        <FormDescription>
                          A short description of the category (Add && for a new
                          line)
                        </FormDescription>
                        <span
                          class="text-xs text-red-500 font-medium"
                          v-if="v$category.description.$error"
                          >{{
                            v$category.description.$error
                              ? v$category.description.$errors[0].$message
                              : ""
                          }}</span
                        >
                      </FormItem>
                    </FormField>
                    <FormField name="categorytype">
                      <FormItem>
                        <FormLabel> Category type </FormLabel>
                        <FormControl>
                          <Select v-model="createCategoryValues.type">
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel> Categories </SelectLabel>
                                <SelectItem value="NORMAL">Normal</SelectItem>
                                <SelectItem value="EVENT">Event</SelectItem>
                                <SelectItem value="HIDDEN">Hidden</SelectItem>
                                <SelectItem value="HISTORICAL"
                                  >Historical</SelectItem
                                >
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                          <span
                            class="text-xs text-red-500 font-medium"
                            v-if="v$category.type.$error"
                            >{{
                              v$category.type.$error
                                ? v$category.type.$errors[0].$message
                                : ""
                            }}</span
                          >
                        </FormControl>
                      </FormItem>
                    </FormField>
                    <FormField name="icon">
                      <FormItem>
                        <FormLabel> Icon </FormLabel>
                        <FormControl>
                          <Input
                            v-model="createCategoryValues.icon"
                            placeholder="DIAMOND_SWORD"
                          />
                        </FormControl>
                        <FormDescription>
                          Please use the Minecraft material name
                        </FormDescription>
                        <span
                          class="text-xs text-red-500 font-medium"
                          v-if="v$category.icon.$error"
                          >{{
                            v$category.icon.$error
                              ? v$category.icon.$errors[0].$message
                              : ""
                          }}</span
                        >
                      </FormItem>
                    </FormField>
                    <FormField name="modelData">
                      <FormItem>
                        <FormLabel> Icon modeldata </FormLabel>
                        <FormControl>
                          <Input
                            v-model="createCategoryValues.iconModelData"
                            placeholder="10010110"
                          />
                        </FormControl>
                        <span
                          class="text-xs text-red-500 font-medium"
                          v-if="v$category.iconModelData.$error"
                          >{{
                            v$category.iconModelData.$error
                              ? v$category.iconModelData.$errors[0].$message
                              : ""
                          }}</span
                        >
                      </FormItem>
                    </FormField>
                    <Button> Create </Button>
                  </Form>
                </div>
              </SheetContent>
            </Sheet>
          </DialogRoot>
        </div>
        <div
          class="px-4 pt-4 h-[calc(100vh-128px)] overflow-y-auto border-t border-t-primary-foreground"
        >
          <div class="grid gap-4">
            <Card
              v-if="isLoading"
              class="hover:cursor-pointer hover:bg-accent transition-colors"
              v-for="i in 5"
              :key="i"
            >
              <CardHeader>
                <div class="w-full">
                  <div>
                    <Skeleton class="w-[200px] h-4 mb-2" />
                    <Skeleton class="w-full h-3" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div class="flex space-x-2">
                  <Skeleton class="h-3 w-[50px]" />
                  <Skeleton class="h-3 w-[50px]" />
                </div>
              </CardContent>
            </Card>
            <Card
              @click="clickCategory(category)"
              v-if="!isLoading && categories.length > 0"
              class="hover:cursor-pointer hover:bg-accent transition-colors"
              v-for="category in categories"
              :key="category.id"
            >
              <CardHeader>
                <div class="flex justify-between">
                  <div class="max-w-[80%]">
                    <h1 class="font-semibold">{{ category.displayName }}</h1>
                    <p class="text-sm font-medium text-muted-foreground">
                      {{ category.description.replace(/&&/g, "\n") }}
                    </p>
                  </div>
                  <Button
                    size="icon"
                    variant="outline"
                    class="size-8"
                    @click="clickEditCategory(category)"
                    ><svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="size-4"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                      />
                    </svg>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Badge variant="secondary" class="mb-2">{{
                  category.type
                }}</Badge>

                <div class="flex gap-2 flex-wrap">
                  <Badge variant="outline"
                    >{{
                      category.achievements?.filter(
                        (a: Achievement) => a.type == AchievementType.NORMAL
                      ).length
                    }}
                    achievements</Badge
                  >
                  <Badge variant="outline"
                    >{{
                      category.achievements?.filter(
                        (a: Achievement) => a.type == AchievementType.SECRET
                      ).length
                    }}
                    secrets</Badge
                  >
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </aside>
      <main class="w-full">
        <div
          class="flex items-centerfull w-full justify-between border-b border-b-border p-4"
        >
          <h1 class="text-lg font-bold">
            Achievements for
            {{ selectedCategory ? selectedCategory.displayName : "..." }}
          </h1>
          <Button>Create achievement</Button>
        </div>
        <div class="p-4 h-[calc(100vh-128px)]">
          <div class="grid grid-cols-4 gap-4 w-full">
            <Card
              v-for="achievement in selectedCategory?.achievements"
              :key="achievement.id"
              class="flex flex-col justify-between"
            >
              <CardHeader>
                <div class="flex justify-between">
                  <div class="max-w-[80%]">
                    <h1 class="font-semibold">{{ achievement.displayName }}</h1>
                    <p class="text-sm font-medium text-muted-foreground">
                      {{ achievement.description.replace(/&&/g, "\n") }}
                    </p>
                  </div>
                  <Button size="icon" variant="outline" class="size-8"
                    ><svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="size-4"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                      />
                    </svg>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div class="flex space-x-2">
                  <Badge variant="outline"
                    >{{ achievement.rewardValue }}
                    {{ achievement.rewardType }}</Badge
                  >
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  </DashboardProvider>
</template>
