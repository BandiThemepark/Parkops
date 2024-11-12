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
import { MoreHorizontal } from "lucide-vue-next";
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
      <DropdownMenuItem @click="copy(player.id)">
        Copy payment ID
      </DropdownMenuItem>
      <DropdownMenuItem @click="$emit('expand')"> Expand </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem>View customer</DropdownMenuItem>
      <DropdownMenuItem>View payment details</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
