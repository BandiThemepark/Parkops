<script setup lang="ts">
import { computed, defineProps } from "vue";
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { Loader2Icon } from "lucide-vue-next";

// Define the props and their types
const props = defineProps<{
  size?: "small" | "medium" | "large";
  show?: boolean;
  children?: any;
}>();

// Define the variants using cva
const spinnerVariants = cva("flex-col items-center justify-center", {
  variants: {
    show: {
      true: "flex",
      false: "hidden",
    },
  },
  defaultVariants: {
    show: true,
  },
});

const loaderVariants = cva("animate-spin text-primary", {
  variants: {
    size: {
      small: "size-6",
      medium: "size-8",
      large: "size-12",
    },
  },
  defaultVariants: {
    size: "medium",
  },
});

// Compute the classes for the spinner and loader
const spinnerClasses = computed(() => spinnerVariants({ show: props.show }));
const loaderClasses = computed(() => cn(loaderVariants({ size: props.size })));
</script>

<template>
  <span :class="spinnerClasses">
    <Loader2Icon :class="loaderClasses" />
    <slot />
  </span>
</template>
