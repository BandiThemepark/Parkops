<script lang="ts" setup>
import { Button } from "../../ui/button";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "../../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { PropType, ref, watch } from "vue";
import Skeleton from "../../ui/skeleton/Skeleton.vue";

const props = defineProps({
  options: {
    type: Array as PropType<Array<{ value: string; label: string }>>,
    required: true,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  placeholder: {
    type: String,
    default: "Select...",
  },
  placeHolderIfNotFound: {
    type: String,
    default: "No options found.",
  },
  extraActions: {
    type: Array as PropType<Array<{ label: string; action: () => void }>>,
    default: () => [],
  },
  heading: {
    type: String,
    default: "",
  },
  modelValue: {
    required: false,
  },
});

const open = ref(false);
const selected = ref("");

const emit = defineEmits(["update:modelValue"]);

watch(selected, () => {
  emit("update:modelValue", selected.value);
});
</script>

<template>
  <Popover v-model:open="open">
    <PopoverTrigger as-child>
      <Button
        variant="outline"
        role="combobox"
        :aria-expanded="open"
        class="w-[200px] mb-4"
        :disabled="isLoading"
      >
        <span
          v-if="!isLoading"
          class="flex justify-between items-center w-full"
        >
          {{
            selected
              ? props.options.find((option) => option.value === selected)?.label
              : placeholder
          }}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="ml-2 h-4 w-4 shrink-0 opacity-50"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
            />
          </svg>
        </span>
        <Skeleton v-else class="w-full h-[24px]" />

        <!-- <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" /> -->
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-[200px] p-0">
      <Command v-model="selected">
        <CommandInput :placeholder="placeholder" />
        <CommandEmpty>{{ placeHolderIfNotFound }}</CommandEmpty>
        <CommandList>
          <CommandGroup :heading="heading">
            <CommandItem
              v-for="option in props.options"
              :key="option.value"
              :value="option.value"
              variant="select"
              @select="
                (ev) => {
                  if (typeof ev.detail.value === 'string') {
                    selected = ev.detail.value;
                  }
                  open = false;
                }
              "
              ><svg
                :class="{
                  'opacity-100': selected === option.value,
                  'opacity-0': selected !== option.value,
                }"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                class="size-4 mr-2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m4.5 12.75 6 6 9-13.5"
                />
              </svg>

              {{ option.label }}
            </CommandItem>
          </CommandGroup>
          <CommandSeparator v-if="extraActions.length > 0" />
          <CommandGroup heading="Actions" v-if="extraActions.length > 0">
            <CommandItem
              v-for="action in props.extraActions"
              :value="{ label: action.label }"
              :key="action.label"
              variant="ghost"
              @select="
                (ev) => {
                  action.action();
                }
              "
            >
              {{ action.label }}</CommandItem
            >
          </CommandGroup>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
</template>
