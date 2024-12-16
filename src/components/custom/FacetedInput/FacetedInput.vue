<script setup lang="ts">
import type { Component } from "vue";
import { ref, computed, onBeforeMount } from "vue";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { CheckIcon, PlusCircleIcon } from "lucide-vue-next";
import { watch } from "vue";

type FilterOption = {
  label: string;
  value: string;
  icon?: Component;
};

type StandaloneFilterProps = {
  title: string;
  options: FilterOption[];
  hasUniqueOptions: boolean;
};

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  options: {
    type: Array as () => FilterOption[],
    required: true,
  },
  hasUniqueOptions: {
    type: Boolean,
    required: false,
    default: false,
  },
  modelValue: {
    type: Array as () => string[],
    required: true,
  },
});

const selectedValues = ref<string[]>([]); // Use an array instead of Set

const filterFunction = (
  list: Record<string, any>[] | string[] | number[] | false[] | true[],
  term: string
): Record<string, any>[] | string[] | number[] | false[] | true[] => {
  if (Array.isArray(list)) {
    if (list.length === 0) {
      return list; // Return empty list if no elements
    }

    // Check if the first element is an object with `label` and `value`
    if (
      typeof list[0] === "object" &&
      "label" in list[0] &&
      "value" in list[0]
    ) {
      return (list as Record<string, any>[]).filter(
        (item) =>
          item.label?.toLowerCase().includes(term.toLowerCase()) ||
          item.value?.toLowerCase().includes(term.toLowerCase())
      );
    }

    // Check if the list contains strings
    if (typeof list[0] === "string") {
      return (list as string[]).filter((item) =>
        item.toLowerCase().includes(term.toLowerCase())
      );
    }

    // Check if the list contains numbers
    if (typeof list[0] === "number") {
      return (list as number[]).filter((item) =>
        item.toString().includes(term)
      );
    }

    // Handle other array types like boolean arrays (rare case)
    return list;
  }

  return []; // Return empty list for unsupported types
};

const emit = defineEmits(["update:modelValue"]);
onBeforeMount(() => {
  selectedValues.value = props.modelValue;
});
const selectedCount = computed(() => selectedValues.value.length); // Updated to use array length
</script>

<template>
  <Popover>
    <PopoverTrigger as-child>
      <Button variant="outline" size="sm" class="h-8 border-dashed">
        <PlusCircleIcon class="mr-2 h-4 w-4" />
        {{ props.title }}
        <template v-if="selectedCount > 0">
          <Separator orientation="vertical" class="mx-2 h-4" />
          <Badge
            variant="secondary"
            class="rounded-sm px-1 font-normal lg:hidden"
          >
            {{ selectedCount }}
          </Badge>
          <div class="hidden space-x-1 lg:flex">
            <Badge
              v-if="selectedCount > 2"
              variant="secondary"
              class="rounded-sm px-1 font-normal"
            >
              {{ selectedCount }} selected
            </Badge>
            <template v-else>
              <Badge
                v-for="option in props.options.filter(
                  (option) => selectedValues.includes(option.value) // Updated to use array method
                )"
                :key="option.value"
                variant="secondary"
                class="rounded-sm px-1 font-normal"
              >
                {{ option.label }}
              </Badge>
            </template>
          </div>
        </template>
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-[200px] p-0" align="start">
      <Command :filter-function="filterFunction">
        <CommandInput :placeholder="props.title" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup>
            <CommandItem
              v-for="option in props.options"
              :key="option.value"
              :value="option"
              @select="
                () => {
                  const isSelected = selectedValues.includes(option.value); // Updated to use array method
                  if (isSelected) {
                    selectedValues = selectedValues.filter(
                      (value) => value !== option.value
                    ); // Remove value
                    $emit('update:modelValue', selectedValues);
                  } else {
                    if (props.hasUniqueOptions) {
                      selectedValues = []; // Clear array if unique options
                    }
                    selectedValues.push(option.value); // Add value
                    $emit('update:modelValue', selectedValues);
                  }
                }
              "
            >
              <div
                :class="
                  cn(
                    'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                    selectedValues.includes(option.value) // Updated to use array method
                      ? 'bg-primary text-primary-foreground'
                      : 'opacity-50 [&_svg]:invisible'
                  )
                "
              >
                <CheckIcon :class="cn('h-4 w-4')" />
              </div>
              <component
                :is="option.icon"
                v-if="option.icon"
                class="mr-2 h-4 w-4 text-muted-foreground"
              />
              <span>{{ option.label }}</span>
            </CommandItem>
          </CommandGroup>

          <template v-if="selectedCount > 0">
            <CommandSeparator />
            <CommandGroup>
              <CommandItem
                :value="{ label: 'Clear filters' }"
                class="justify-center text-center"
                @select="selectedValues = []"
              >
                Clear filters
              </CommandItem>
            </CommandGroup>
          </template>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
</template>
