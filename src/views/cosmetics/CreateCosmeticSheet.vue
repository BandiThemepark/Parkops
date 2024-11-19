<template>
  <Sheet>
    <SheetTrigger>
      <Button>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          class="size-6 mr-2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
        Create cosmetic
      </Button>
    </SheetTrigger>
    <SheetContent>
      <SheetHeader>
        <SheetTitle>Create cosmetic</SheetTitle>
        <SheetDescription
          >Enter all of the details below. You can find more information about
          creating cosmetics
          <a
            class="underline text-cyan-400 visited:text-cyan-400"
            href="https://docs.bandithemepark.net"
            >here.</a
          ></SheetDescription
        >
      </SheetHeader>

      <div class="py-4 gap-2 grid" v-if="currentPage === 1">
        <div>
          <Label for="email" class="text-sm font-medium">Name</Label>
          <Input id="email" type="text" placeholder="bag_of_bricks" />
        </div>

        <div>
          <Label for="email" class="text-sm font-medium">Display Name</Label>
          <Input id="email" type="text" placeholder="Bag of Bricks" />
        </div>

        <div>
          <Label for="email" class="text-sm font-medium">Description</Label>
          <Input id="email" type="text" placeholder="Line 1&&and line 2" />
        </div>

        <NumberField :default-value="25" :min="0">
          <Label for="email" class="text-sm font-medium">Price</Label>
          <NumberFieldContent>
            <NumberFieldDecrement />
            <NumberFieldInput />
            <NumberFieldIncrement />
          </NumberFieldContent>
        </NumberField>
      </div>

      <SheetFooter v-if="currentPage === 1">
        <Button @click="currentPage++">Next step</Button>
      </SheetFooter>

      <div class="py-4 gap-2 grid" v-if="currentPage === 2">
        <div>
          <Label for="type" class="text-sm font-medium">Type</Label>
          <Select v-model="selectedType" id="type">
            <SelectTrigger>
              <SelectValue placeholder="Select a type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Cosmetic types</SelectLabel>
                <SelectItem v-for="type in types" :value="type.name">
                  {{ type.displayName }}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label for="metadata" class="text-sm font-medium">Metadata</Label>
          <Textarea
            v-model="metadata"
            id="metadata"
            type="text"
            placeholder="Select a type for example metadata"
          />
        </div>

        <div>
          <Label for="requirements" class="text-sm font-medium"
            >Requirements</Label
          >
          <Textarea
            default-value="[]"
            id="requirements"
            type="text"
            placeholder="Enter requirements here"
          />
        </div>
      </div>

      <SheetFooter v-if="currentPage === 2">
        <div class="flex justify-between w-full">
          <Button variant="outline" @click="currentPage--"
            >Previous step</Button
          >

          <SheetClose as-child>
            <Button>Complete</Button>
          </SheetClose>
        </div>
      </SheetFooter>
    </SheetContent>
  </Sheet>
</template>

<script setup lang="ts">
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "radix-vue";
import { Input } from "@/components/ui/input";
import {
  NumberField,
  NumberFieldContent,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
} from "@/components/ui/number-field";
import { ref, watch } from "vue";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const currentPage = ref(1);

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
    defaultMetadata: `{"customModelData":0}`,
  },
  {
    name: "balloon",
    displayName: "Balloon",
    tabName: "Balloons",
    defaultMetadata: `{}`,
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
  },
  {
    name: "backpack",
    displayName: "Backpack",
    tabName: "Backpacks",
    defaultMetadata: `{"customModelData":0}`,
  },
  {
    name: "chestplate",
    displayName: "Chestplate",
    tabName: "Chestplates",
    defaultMetadata: `{}`,
  },
  {
    name: "leggings",
    displayName: "Leggings",
    tabName: "Leggings",
    defaultMetadata: `{}`,
  },
  {
    name: "boots",
    displayName: "Boots",
    tabName: "Boots",
    defaultMetadata: `{}`,
  },
]);

const selectedType = ref();
watch(selectedType, () => {
  metadata.value = types.value.find(
    (t) => t.name === selectedType.value
  )?.defaultMetadata!;
});

const metadata = ref("");
</script>
