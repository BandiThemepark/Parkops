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
  CopyIcon,
  Trash2Icon,
} from "lucide-vue-next";
import { PropType } from "vue";
import { BandiUser } from "./userColumns";

const props = defineProps({
  user: {
    type: Object as PropType<BandiUser>,
    required: true,
  },
});

function copy(email: string) {
  navigator.clipboard.writeText(email);
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

      <DropdownMenuItem @click="copy(user.email!)">
        <CopyIcon class="size-4 mr-2" />
        <span>Copy email</span>
      </DropdownMenuItem>
      <DropdownMenuItem>
        <PencilIcon class="size-4 mr-2" />
        <span>Edit</span>
      </DropdownMenuItem>
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
