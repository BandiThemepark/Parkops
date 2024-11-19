<script lang="ts" setup>
import DashboardProvider from "@/components/custom/DashboardProvider.vue";
import Badge from "@/components/ui/badge/Badge.vue";
import Button from "@/components/ui/button/Button.vue";
import Card from "@/components/ui/card/Card.vue";
import CardContent from "@/components/ui/card/CardContent.vue";
import CardDescription from "@/components/ui/card/CardDescription.vue";
import CardFooter from "@/components/ui/card/CardFooter.vue";
import CardHeader from "@/components/ui/card/CardHeader.vue";
import CardTitle from "@/components/ui/card/CardTitle.vue";
import Input from "@/components/ui/input/Input.vue";
import Label from "@/components/ui/label/Label.vue";
import NumberField from "@/components/ui/number-field/NumberField.vue";
import NumberFieldContent from "@/components/ui/number-field/NumberFieldContent.vue";
import NumberFieldDecrement from "@/components/ui/number-field/NumberFieldDecrement.vue";
import NumberFieldIncrement from "@/components/ui/number-field/NumberFieldIncrement.vue";
import NumberFieldInput from "@/components/ui/number-field/NumberFieldInput.vue";
import Select from "@/components/ui/select/Select.vue";
import SelectContent from "@/components/ui/select/SelectContent.vue";
import SelectGroup from "@/components/ui/select/SelectGroup.vue";
import SelectItem from "@/components/ui/select/SelectItem.vue";
import SelectLabel from "@/components/ui/select/SelectLabel.vue";
import SelectTrigger from "@/components/ui/select/SelectTrigger.vue";
import SelectValue from "@/components/ui/select/SelectValue.vue";
import Switch from "@/components/ui/switch/Switch.vue";
import TagsInput from "@/components/ui/tags-input/TagsInput.vue";
import TagsInputInput from "@/components/ui/tags-input/TagsInputInput.vue";
import TagsInputItem from "@/components/ui/tags-input/TagsInputItem.vue";
import TagsInputItemDelete from "@/components/ui/tags-input/TagsInputItemDelete.vue";
import TagsInputItemText from "@/components/ui/tags-input/TagsInputItemText.vue";
import { useToast } from "@/components/ui/toast";
import { createCosmetic } from "@/lib/backend/cosmetics";
import { mayNotHaveSpaces } from "@/lib/validation/validations";
import { CosmeticRequirement } from "@/lib/backendTypes";
import useVuelidate from "@vuelidate/core";
import {
  alpha,
  alphaNum,
  helpers,
  minValue,
  required,
} from "@vuelidate/validators";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  PlusIcon,
  TrashIcon,
} from "lucide-vue-next";
import { computed, reactive, ref, watch } from "vue";
import { useRouter } from "vue-router";

const types = ref([
  {
    name: "hat",
    displayName: "Hat",
    tabName: "Hats",
    defaultMetadata: `{"material":"LEATHER_HORSE_ARMOR","customModelData":0,"heightOffset":0.0}`,
  },
  {
    name: "handheld",
    displayName: "Handheld",
    tabName: "Handhelds",
    defaultMetadata: `{"customModelData":0, "material":"DIAMOND_SWORD"}`,
  },
  {
    name: "balloon",
    displayName: "Balloon",
    tabName: "Balloons",
    defaultMetadata: `{
      "material":"LEATHER_HORSE_ARMOR",
      "customModelData":0,
      "trails":[]
    }`,
  },
  {
    name: "title",
    displayName: "Title",
    tabName: "Titles",
    defaultMetadata: `{"text":"<#FFFFFF>Your text"}`,
  },
  {
    name: "kart",
    displayName: "Kart",
    tabName: "Karts",
    defaultMetadata: `{}`,
    disabled: true,
  },
  {
    name: "backpack",
    displayName: "Backpack",
    tabName: "Backpacks",
    defaultMetadata: `{"customModelData":0}`,
    disabled: true,
  },
  {
    name: "chestplate",
    displayName: "Chestplate",
    tabName: "Chestplates",
    defaultMetadata: `{
      "customModelData":0,
      "material":"DIAMOND_CHESTPLATE",
      "color":"#FFFFFF"
    }`,
  },
  {
    name: "leggings",
    displayName: "Leggings",
    tabName: "Leggings",
    defaultMetadata: `{
      "customModelData":0,
      "material":"DIAMOND_LEGGINGS",
      "color":"#FFFFFF"
    }`,
  },
  {
    name: "boots",
    displayName: "Boots",
    tabName: "Boots",
    defaultMetadata: `{
      "customModelData":0,
      "material":"DIAMOND_BOOTS",
      "color":"#FFFFFF"
    }`,
  },
]);
const step = ref(1);
const router = useRouter();
const nextStep = () => {
  // validate step one
  if (step.value == 1) {
    v$stepOne.value.$validate();

    if (v$stepOne.value.$error) {
      return;
    }

    step.value = 2;
  }
  if (step.value == 2) {
    v$stepTwo.value.$validate();
    if (v$stepTwo.value.$errors.length > 0) return;
    // create the cosmetic
  }
};

const previousStep = () => {
  if (step.value == 1) return;
  step.value = step.value - 1;
};

const stepOneValues = ref({
  name: "",
  displayName: "",
  description: "",
  price: 0,
  consumable: false,
  itemTags: [],
  requirements: [],
});

type HatMetaData = {
  material: string;
  customModelData: number;
  heightOffset: number;
};

type HandheldMetaData = {
  material: string;
  customModelData: number;
};

type BalloonMetaData = {
  material: string;
  customModelData: number;
  trails?: BalloonTrail[];
};

type BalloonTrail = {
  material: string;
  customModelData: number;
  length: number;
};

type TitleMetaData = {
  text: string;
};

type KartMetaData = {};

type BackpackMetaData = {
  customModelData: number;
};

type ChestplateMetaData = {
  customModelData: number;
  material: string;
  color: string;
};

type LeggingsMetaData = {
  customModelData: number;
  material: string;
  color: string;
};

type BootsMetaData = {
  customModelData: number;
  material: string;
  color: string;
};

const isEditingRawTitleColor = ref(false);

const stepTwoValues = ref({
  type: "",
  metaData: {} as
    | HatMetaData
    | HandheldMetaData
    | BalloonMetaData
    | TitleMetaData
    | KartMetaData
    | BackpackMetaData
    | ChestplateMetaData
    | LeggingsMetaData
    | BootsMetaData,
});

const stepOneRules = {
  name: {
    required,
    mayNotHaveSpaces: helpers.withMessage(
      "May not have spaces",
      mayNotHaveSpaces
    ),
  },
  displayName: {
    required,
  },
  description: {
    required,
  },
  price: {
    required,
    minValue: minValue(0),
  },
};

const stepTwoRules = {
  type: required,
  metaData: {
    type: {} as
      | HatMetaData
      | HandheldMetaData
      | BalloonMetaData
      | TitleMetaData
      | KartMetaData
      | BackpackMetaData
      | ChestplateMetaData
      | LeggingsMetaData
      | BootsMetaData,
    required,
  },
};
const selectedColor = ref("#FFFFFF");
const titleText = ref("");
const coloredTitle = computed(() => {
  if (isEditingRawTitleColor.value) return titleText.value;
  return `<${selectedColor.value}>${titleText.value}`;
});
const v$stepOne = useVuelidate(stepOneRules, stepOneValues);
const v$stepTwo = useVuelidate(stepTwoRules, stepTwoValues);
watch(coloredTitle, () => {
  (stepTwoValues.value.metaData as TitleMetaData).text = coloredTitle.value;
});

const isAddingTrail = ref(false);
const toAddTrail = ref({
  material: "",
  customModelData: 0,
  length: 0,
});

const { toast } = useToast();
const startCreateCosmetic = async () => {
  v$stepOne.value.$validate();
  v$stepTwo.value.$validate();

  if (v$stepOne.value.$errors.length > 0 || v$stepTwo.value.$errors.length > 0)
    return;

  const cosmetic = {
    ...stepOneValues.value,
    ...stepTwoValues.value,
  };

  const data = await createCosmetic(cosmetic);
  if (data.status === 200) {
    toast({
      title: "Cosmetic created",
      description: "The cosmetic has been created successfully",
    });
    router.push("/cosmetics");
  } else {
    if (data.status == 409) {
      toast({
        title: "Error",
        description: "A cosmetic with that name already exists",
        variant: "destructive",
      });
      return;
    } else {
      toast({
        title: "Error",
        description: "An error occurred while creating the cosmetic",
        variant: "destructive",
      });
    }
  }
};

watch(
  () => stepTwoValues.value.type,
  () => {
    stepTwoValues.value.metaData = JSON.parse(
      types.value.find((t) => t.name === stepTwoValues.value.type)
        ?.defaultMetadata!
    );
  }
);

const isAddingRequirement = ref(false);

const toAddRequirement = ref({
  type: "",
  settings: "",
});

const addRequirement = () => {
  const requirement: CosmeticRequirement = {
    type: toAddRequirement.value.type,
    settings: toAddRequirement.value.settings,
  };
  (stepOneValues.value as any).requirements.push(requirement);
  isAddingRequirement.value = false;
};

const removeRequirement = (index: number) => {
  (stepOneValues.value as any).requirements.splice(index, 1);
};

const finalizeTrail = () => {
  const trail = {
    material: toAddTrail.value.material,
    customModelData: toAddTrail.value.customModelData,
    length: toAddTrail.value.length,
  };
  (stepTwoValues.value.metaData as BalloonMetaData).trails?.push(trail);
  isAddingTrail.value = false;
};
</script>

<template>
  <DashboardProvider>
    <div v-if="step == 1" class="max-w-[500px]">
      <h1 class="font-medium mb-4 text-lg">General settings</h1>

      <div>
        <Label for="name">Name</Label>
        <Input
          v-model="stepOneValues.name"
          id="name"
          placeholder="Name"
        ></Input>
        <span
          class="text-xs text-red-500 font-medium"
          v-if="v$stepOne.name.$error"
          >{{
            v$stepOne.name.$error ? v$stepOne.name.$errors[0].$message : ""
          }}</span
        >
      </div>
      <div>
        <Label for="displayName">Display name</Label>
        <Input
          v-model="stepOneValues.displayName"
          id="displayName"
          placeholder="Display name"
        ></Input>
        <span
          class="text-xs text-red-500 font-medium"
          v-if="v$stepOne.displayName.$error"
          >{{
            v$stepOne.displayName.$error
              ? v$stepOne.displayName.$errors[0].$message
              : ""
          }}</span
        >
      </div>
      <div>
        <Label for="description">Description</Label>
        <Input
          v-model="stepOneValues.description"
          id="description"
          placeholder="Description"
        ></Input>
        <span
          class="text-xs text-red-500 font-medium"
          v-if="v$stepOne.description.$error"
          >{{
            v$stepOne.description.$error
              ? v$stepOne.description.$errors[0].$message
              : ""
          }}</span
        >
      </div>
      <div class="mb-2">
        <Label for="price">Price</Label>
        <NumberField v-model="stepOneValues.price" id="price">
          <NumberFieldContent>
            <NumberFieldDecrement />
            <NumberFieldInput />
            <NumberFieldIncrement />
          </NumberFieldContent>
        </NumberField>
        <span
          class="text-xs text-red-500 font-medium"
          v-if="v$stepOne.price.$error"
          >{{
            v$stepOne.price.$error ? v$stepOne.price.$errors[0].$message : ""
          }}</span
        >
      </div>
      <div class="mb-2">
        <h1 class="font-medium mb-4 text-lg">Extra options</h1>
        <div class="flex items-center space-x-2 mb-2">
          <Switch v-model:checked="stepOneValues.consumable" id="consumable" />
          <Label for="airplane-mode">Is consumable</Label>
        </div>
        <div class="mb-4">
          <Label for="itemTags">Tags</Label>
          <TagsInput id="itemTags" v-model="stepOneValues.itemTags">
            <TagsInputItem v-for="item in stepOneValues.itemTags" :value="item">
              <TagsInputItemText />
              <TagsInputItemDelete />
            </TagsInputItem>
            <TagsInputInput placeholder="Tags" />
          </TagsInput>
        </div>
        <div>
          <!-- requirements -->
          <h1 class="font-medium mb-4 text-lg">Requirements</h1>
          <div>
            <div
              class="flex justify-between items-center mb-2"
              v-for="(requirement, index) in stepOneValues.requirements"
            >
              <Card class="p-4 w-full">
                <div class="flex justify-between items-center">
                  <div class="flex gap-4">
                    <span class="font-medium">{{ index + 1 }}.</span>
                    <span class="">{{
                      (requirement as CosmeticRequirement).type
                    }}</span>
                    <pre>{{
                      (requirement as CosmeticRequirement).settings
                    }}</pre>
                  </div>
                  <Button variant="ghost" @click="removeRequirement(index)">
                    <TrashIcon class="size-4" />
                  </Button>
                </div>
              </Card>
            </div>
            <Button
              v-if="!isAddingRequirement"
              @click="isAddingRequirement = true"
            >
              <PlusIcon class="size-4" />
              <span>Add requirement</span>
            </Button>
            <div v-if="isAddingRequirement">
              <div class="flex w-full justify-between gap-2 items-end mb-2">
                <div class="w-full">
                  <Label for="requirement">Type</Label>
                  <Input
                    v-model="toAddRequirement.type"
                    id="requirement"
                    placeholder="Type"
                  ></Input>
                </div>
                <div class="w-full">
                  <Label for="Settings">Settings</Label>
                  <Input
                    v-model="toAddRequirement.settings"
                    id="Settings"
                    placeholder="Settings"
                  ></Input>
                </div>
              </div>
              <Button @click="addRequirement">
                <CheckIcon class="size-4" />
                <span>Finalize requirement</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div class="flex w-full justify-between">
        <Button variant="outline" @click="previousStep" :disabled="step == 1">
          <ArrowLeftIcon class="size-4" />
          <span>Previous</span>
        </Button>
        <Button
          variant="outline"
          :disabled="v$stepOne.$error"
          @click="nextStep"
        >
          <ArrowRightIcon class="size-4" />
          <span>Next</span>
        </Button>
      </div>
    </div>
    <!-- <div>{{ stepTwoValues }}</div> -->
    <div class="gap-4 flex flex-col max-w-[500px]" v-if="step == 2">
      <div class="">
        <Label for="type">Type</Label>
        <Select v-model="stepTwoValues.type" id="type">
          <SelectTrigger>
            <SelectValue placeholder="Select a type" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Cosmetic types</SelectLabel>
              <SelectItem
                :disabled="type.disabled"
                v-for="type in types"
                :value="type.name"
              >
                {{ type.displayName }}
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div>
        <section class="flex flex-col gap-4" v-if="stepTwoValues.type == 'hat'">
          <div>
            <Label for="material">Material</Label>

            <Input
              id="material"
              v-model="(stepTwoValues.metaData as HatMetaData).material"
              placeholder="DIAMOND_SWORD"
            ></Input>
          </div>

          <div>
            <Label for="customModelData">Custom model data</Label>
            <NumberField
              v-model="(stepTwoValues.metaData as HatMetaData).customModelData"
              id="customModelData"
            >
              <NumberFieldContent>
                <NumberFieldDecrement />
                <NumberFieldInput />
                <NumberFieldIncrement />
              </NumberFieldContent>
            </NumberField>
          </div>

          <div>
            <Label for="heightOffset">Height offset</Label>
            <NumberField
              v-model="(stepTwoValues.metaData as HatMetaData).heightOffset"
              id="heightOffset"
            >
              <NumberFieldContent>
                <NumberFieldDecrement />
                <NumberFieldInput />
                <NumberFieldIncrement />
              </NumberFieldContent>
            </NumberField>
          </div>
        </section>
        <section v-if="stepTwoValues.type == 'handheld'">
          <div>
            <Label for="material">Material</Label>
            <Input
              id="material"
              v-model="(stepTwoValues.metaData as HandheldMetaData).material"
              placeholder="DIAMOND_SWORD"
            ></Input>
          </div>
          <div>
            <Label for="customModelData">Custom model data</Label>
            <NumberField
              v-model="(stepTwoValues.metaData as HandheldMetaData).customModelData"
              id="customModelData"
            >
              <NumberFieldContent>
                <NumberFieldDecrement />
                <NumberFieldInput />
                <NumberFieldIncrement />
              </NumberFieldContent>
            </NumberField>
          </div>
        </section>
        <section v-if="stepTwoValues.type == 'balloon'">
          <div>
            <Label for="material">Material</Label>
            <Input
              id="material"
              v-model="(stepTwoValues.metaData as BalloonMetaData).material"
              placeholder="DIAMOND_SWORD"
            ></Input>
          </div>
          <div class="mb-4">
            <Label for="customModelData">Custom model data</Label>
            <NumberField
              v-model="(stepTwoValues.metaData as BalloonMetaData).customModelData"
              id="customModelData"
            >
              <NumberFieldContent>
                <NumberFieldDecrement />
                <NumberFieldInput />
                <NumberFieldIncrement />
              </NumberFieldContent>
            </NumberField>
          </div>
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Trails</CardTitle>
                <CardDescription> Add trails to your balloon </CardDescription>
              </CardHeader>
              <CardContent>
                <div>
                  <div
                    class=""
                    v-for="(trail, index) in (stepTwoValues.metaData as BalloonMetaData).trails"
                  >
                    <Card class="p-4">
                      <div class="flex justify-between items-center">
                        <div class="flex gap-4">
                          <span class="font-medium">{{ index + 1 }}.</span>
                          <span class="">{{ trail.material }}</span>
                          <Badge>CMD: {{ trail.customModelData }}</Badge>
                          <Badge>Length: {{ trail.length }}</Badge>
                        </div>
                        <Button
                          variant="ghost"
                          @click="
                            (
                              stepTwoValues.metaData as BalloonMetaData
                            ).trails?.splice(index, 1)
                          "
                        >
                          <TrashIcon class="size-4" />
                        </Button>
                      </div>
                    </Card>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <div v-if="!isAddingTrail">
                  <Button @click="isAddingTrail = true">
                    <PlusIcon class="size-4" />
                    <span>Add trail</span>
                  </Button>
                </div>
                <div v-if="isAddingTrail" class="w-full">
                  <div>
                    <Label for="material">Material</Label>
                    <Input
                      id="material"
                      v-model="toAddTrail.material"
                      placeholder="DIAMOND_SWORD"
                    ></Input>
                  </div>
                  <div>
                    <Label for="customModelData">Custom model data</Label>
                    <NumberField
                      v-model="toAddTrail.customModelData"
                      id="customModelData"
                    >
                      <NumberFieldContent>
                        <NumberFieldDecrement />
                        <NumberFieldInput />
                        <NumberFieldIncrement />
                      </NumberFieldContent>
                    </NumberField>
                  </div>
                  <div class="mb-2">
                    <Label for="length">Length</Label>
                    <NumberField
                      :step="0.001"
                      v-model="toAddTrail.length"
                      id="length"
                    >
                      <NumberFieldContent>
                        <NumberFieldDecrement />
                        <NumberFieldInput />
                        <NumberFieldIncrement />
                      </NumberFieldContent>
                    </NumberField>
                  </div>
                  <Button @click="finalizeTrail">
                    <CheckIcon class="size-4" />
                    <span>Finalize trail</span>
                  </Button>
                </div>
              </CardFooter>
            </Card>
            <!-- Form to add trails by clickign a plus button -->
            <!-- Already created  trails can be removed -->

            <!-- Form for adding a trail -->
          </div>
        </section>
        <section v-if="stepTwoValues.type == 'title'">
          <!-- color picker -->
          <div class="flex items-center gap-2 mb-2">
            <Switch v-model:checked="isEditingRawTitleColor" />
            <Label for="color">Edit raw color</Label>
          </div>
          <div v-if="!isEditingRawTitleColor">
            <Label for="color">Color</Label>
            <Input v-model="selectedColor" id="color" type="color"></Input>
          </div>
          <div>
            <Label for="text">Text</Label>
            <Input
              id="text"
              v-model="titleText"
              placeholder="Your text"
            ></Input>
          </div>
        </section>
        <section v-if="stepTwoValues.type == 'kart'">kart</section>
        <section v-if="stepTwoValues.type == 'backpack'">backpack</section>
        <section v-if="stepTwoValues.type == 'chestplate'">
          <div>
            <Label for="material">Material</Label>
            <Input
              id="material"
              v-model="(stepTwoValues.metaData as ChestplateMetaData).material"
              placeholder="DIAMOND_CHESTPLATE"
            ></Input>
          </div>
          <div>
            <Label for="customModelData">Custom model data</Label>
            <NumberField
              v-model="(stepTwoValues.metaData as ChestplateMetaData).customModelData"
              id="customModelData"
            >
              <NumberFieldContent>
                <NumberFieldDecrement />
                <NumberFieldInput />
                <NumberFieldIncrement />
              </NumberFieldContent>
            </NumberField>
          </div>
          <div>
            <Label for="color">Color</Label>
            <Input
              id="color"
              v-model="(stepTwoValues.metaData as ChestplateMetaData).color"
              type="color"
            ></Input>
          </div>
        </section>
        <section v-if="stepTwoValues.type == 'leggings'">
          <div>
            <Label for="material">Material</Label>
            <Input
              id="material"
              v-model="(stepTwoValues.metaData as LeggingsMetaData).material"
              placeholder="DIAMOND_LEGGINGS"
            ></Input>
          </div>
          <div>
            <Label for="customModelData">Custom model data</Label>
            <NumberField
              v-model="(stepTwoValues.metaData as LeggingsMetaData).customModelData"
              id="customModelData"
            >
              <NumberFieldContent>
                <NumberFieldDecrement />
                <NumberFieldInput />
                <NumberFieldIncrement />
              </NumberFieldContent>
            </NumberField>
          </div>
          <div>
            <Label for="color">Color</Label>
            <Input
              id="color"
              v-model="(stepTwoValues.metaData as LeggingsMetaData).color"
              type="color"
            ></Input>
          </div>
        </section>
        <section v-if="stepTwoValues.type == 'boots'">
          <div>
            <Label for="material">Material</Label>
            <Input
              id="material"
              v-model="(stepTwoValues.metaData as BootsMetaData).material"
              placeholder="DIAMOND_BOOTS"
            ></Input>
          </div>
          <div>
            <Label for="customModelData">Custom model data</Label>
            <NumberField
              v-model="(stepTwoValues.metaData as BootsMetaData).customModelData"
              id="customModelData"
            >
              <NumberFieldContent>
                <NumberFieldDecrement />
                <NumberFieldInput />
                <NumberFieldIncrement />
              </NumberFieldContent>
            </NumberField>
          </div>
          <div>
            <Label for="color">Color</Label>
            <Input
              id="color"
              v-model="(stepTwoValues.metaData as BootsMetaData).color"
              type="color"
            ></Input>
          </div>
        </section>
      </div>
      <div class="flex items-center justify-between">
        <Button @click="previousStep" variant="outline">
          <ArrowLeftIcon class="size-4" />
          <span>Previous</span>
        </Button>
        <Button :disabled="!stepTwoValues.type" @click="startCreateCosmetic()">
          <PlusIcon class="size-4" />
          <span>Create cosmetic</span>
        </Button>
      </div>
    </div>
  </DashboardProvider>
</template>
