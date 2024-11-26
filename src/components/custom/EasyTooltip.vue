<script lang="ts" setup>
import Tooltip from "../ui/tooltip/Tooltip.vue";
import TooltipContent from "../ui/tooltip/TooltipContent.vue";
import TooltipProvider from "../ui/tooltip/TooltipProvider.vue";
import TooltipTrigger from "../ui/tooltip/TooltipTrigger.vue";

const props = defineProps({
  tooltipText: String,
  direction: {
    type: String,
    default: "top",
  },
});
</script>
<template>
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger as-child>
        <slot></slot>
      </TooltipTrigger>
      <TooltipContent>
        {{ props.tooltipText }}
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>
