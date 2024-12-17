<script setup lang="ts">
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Player, Shop } from "@/lib/backendTypes";
import {
  MoreHorizontal,
  PencilIcon,
  TimerResetIcon,
  CopyIcon,
  Maximize2Icon,
  LandPlotIcon,
  Trash2Icon,
} from "lucide-vue-next";
import { PropType } from "vue";

const props = defineProps({
  shop: {
    type: Object as PropType<Shop>,
    required: true,
  },
});

function copy(id: string) {
  navigator.clipboard.writeText(id);
}

defineEmits<{
  (e: "expand"): void;
  (e: "refreshShops"): void;
}>();
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" class="w-8 h-8 p-0">
        <span class="sr-only">Open menu</span>
        <MoreHorizontal class="w-4 h-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuLabel>Actions</DropdownMenuLabel>
      <DropdownMenuSeparator />

      <DropdownMenuItem @click="copy(`/warp ${shop.name}`)">
        <LandPlotIcon class="size-4 mr-2" />
        <span>Copy warp</span>
      </DropdownMenuItem>
      <DropdownMenuItem @click="$emit('expand')">
        <Maximize2Icon class="size-4 mr-2" />
        <span>Expand</span>
      </DropdownMenuItem>
      <!-- <DropdownMenuItem>
        <PencilIcon class="size-4 mr-2" />
        <span>Edit</span>
      </DropdownMenuItem> -->
      <DropdownMenuSeparator />
      <DropdownMenuItem
        class="text-destructive hover:!bg-destructive hover:!text-destructive-foreground"
      >
        <Trash2Icon class="size-4 mr-2" />
        <span>Remove</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
