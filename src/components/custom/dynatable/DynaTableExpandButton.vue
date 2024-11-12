<script setup lang="ts">
import { Button } from "@/components/ui/button";

import { Maximize2Icon, Minimize2Icon } from "lucide-vue-next";

const props = defineProps({
  isExpanded: Boolean,
});

defineEmits<{
  (e: "expand"): void;
}>();
</script>

<template>
  <Button @click="$emit('expand')" variant="ghost" class="w-8 h-8 p-0">
    <span class="sr-only">Open menu</span>
    <Maximize2Icon v-if="!isExpanded" class="w-4 h-4" />
    <Minimize2Icon v-else class="w-4 h-4" />
  </Button>
</template>
