<script setup lang="ts">
import { Button } from "@/components/ui/button";

import {
  ExternalLinkIcon,
  Maximize2Icon,
  Minimize2Icon,
} from "lucide-vue-next";

const props = defineProps({
  toLink: {
    type: String,
    required: true,
  },
});

const openPageInNewTab = () => {
  window.open(props.toLink, "_blank");
};
</script>

<template>
  <Button @click="openPageInNewTab" variant="ghost" class="w-8 h-8 p-0">
    <span class="sr-only">Open page</span>
    <ExternalLinkIcon class="w-4 h-4" />
  </Button>
</template>
