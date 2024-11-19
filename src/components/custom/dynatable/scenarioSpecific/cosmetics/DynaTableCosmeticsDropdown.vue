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
import { Cosmetic } from "@/lib/backendTypes";
import { MoreHorizontal, PencilIcon, CopyIcon } from "lucide-vue-next";
import { PropType, ref } from "vue";

import useAuthentication from "@/middleware/authentication";

const props = defineProps({
  cosmetic: {
    type: Object as PropType<Cosmetic>,
    required: true,
  },
});
function copy(email: string) {
  navigator.clipboard.writeText(email);
}
const currentUser = useAuthentication.getUser();

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

      <DropdownMenuItem @click="$emit('expand')">
        <CopyIcon class="size-4 mr-2" />
        <span>Open</span>
      </DropdownMenuItem>
      <DropdownMenuItem>
        <PencilIcon class="size-4 mr-2" />
        <span>Edit</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
