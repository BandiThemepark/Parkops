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
import { Player } from "@/lib/backendTypes";
import {
  MoreHorizontal,
  PencilIcon,
  TimerResetIcon,
  CopyIcon,
  Maximize2Icon,
} from "lucide-vue-next";
import { PropType } from "vue";

const props = defineProps({
  player: {
    type: Object as PropType<Player>,
    required: true,
  },
});

function copy(id: string) {
  navigator.clipboard.writeText(id);
}

defineEmits<{
  (e: "expand"): void;
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

      <DropdownMenuItem @click="copy(player.id)">
        <CopyIcon class="size-4 mr-2" />
        <span>Copy UUID</span>
      </DropdownMenuItem>
      <DropdownMenuItem @click="$emit('expand')">
        <Maximize2Icon class="size-4 mr-2" />
        <span>Expand</span>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem>
        <PencilIcon class="size-4 mr-2" />
        <span>Edit</span>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        class="text-destructive hover:!bg-destructive hover:!text-destructive-foreground"
      >
        <TimerResetIcon class="size-4 mr-2" />
        <span>Reset</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
