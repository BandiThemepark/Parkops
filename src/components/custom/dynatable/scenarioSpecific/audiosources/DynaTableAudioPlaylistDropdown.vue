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
import { AudioPlaylist, AudioSource, Cosmetic } from "@/lib/backendTypes";
import {
  MoreHorizontal,
  PencilIcon,
  CopyIcon,
  Trash2Icon,
  ChartColumnIcon,
  CoinsIcon,
  UserCheckIcon,
  HeadphonesIcon,
  ClipboardCopyIcon,
  ListOrderedIcon,
} from "lucide-vue-next";
import { PropType, ref } from "vue";

import useAuthentication from "@/middleware/authentication";
import Dialog from "@/components/ui/dialog/Dialog.vue";
import DialogContent from "@/components/ui/dialog/DialogContent.vue";
import DialogHeader from "@/components/ui/dialog/DialogHeader.vue";
import DialogDescription from "@/components/ui/dialog/DialogDescription.vue";
import DialogFooter from "@/components/ui/dialog/DialogFooter.vue";
import { deleteCosmetic, getCosmeticStatistics } from "@/lib/backend/cosmetics";
import DialogTrigger from "@/components/ui/dialog/DialogTrigger.vue";
import { useToast } from "@/components/ui/toast";
import DialogTitle from "@/components/ui/dialog/DialogTitle.vue";
import Badge from "@/components/ui/badge/Badge.vue";
import { deleteAudioPlaylist, deleteAudioSource } from "@/lib/backend/audio";

const props = defineProps({
  audioPlaylist: {
    type: Object as PropType<AudioPlaylist>,
    required: true,
  },
  isExpanded: {
    type: Boolean,
    required: false,
  },
});

const currentUser = useAuthentication.getUser();

const isRemoveDialogOpen = ref(false);

const emit = defineEmits<{
  (e: "expand"): void;
  (e: "refreshAudioSources"): void;
}>();

const { toast } = useToast();

const removeAudioPlaylist = async () => {
  const data = await deleteAudioPlaylist(props.audioPlaylist.id);
  if (data.status === 200) {
    toast({
      title: "Success",
      description: "Audio playlist removed successfully",
    });
    emit("refreshAudioSources");
    if (props.isExpanded) {
      emit("expand");
    }
  } else {
    toast({
      title: "Error",
      description: "Failed to remove audio playlist",
    });
  }
};

enum Dialogs {
  removeDialog = "removeDialog",
}
const activeDialog = ref<Dialogs | null>(null);
// const emit = defineEmits(["refreshCosmetics"]);
</script>

<template>
  <Dialog v-model:open="isRemoveDialogOpen">
    <DialogContent v-if="activeDialog == Dialogs.removeDialog">
      <DialogHeader>
        <DialogTitle>
          Are you sure you want to remove {{ audioPlaylist.name }}?
        </DialogTitle>
        <DialogDescription>
          <p>This action is irreversable!</p>
        </DialogDescription>
      </DialogHeader>

      <DialogFooter>
        <div class="flex gap-2">
          <Button variant="ghost" @click="isRemoveDialogOpen = false">
            Cancel
          </Button>
          <Button variant="destructive" @click="removeAudioPlaylist">
            Remove
          </Button>
        </div>
      </DialogFooter>
    </DialogContent>
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

        <!-- <DropdownMenuItem @click="$emit('expand')">
          <CopyIcon class="size-4 mr-2" />
          <span>Open</span>
        </DropdownMenuItem> -->

        <DropdownMenuItem @click="$emit('expand')">
          <ListOrderedIcon class="size-4 mr-2" />

          <span>Configure</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <PencilIcon class="size-4 mr-2" />
          <span>Edit</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DialogTrigger
          class="w-full"
          @click="activeDialog = Dialogs.removeDialog"
        >
          <DropdownMenuItem
            class="text-destructive hover:!bg-destructive hover:!text-destructive-foreground"
          >
            <Trash2Icon class="size-4 mr-2" />
            <span>Remove</span>
          </DropdownMenuItem>
        </DialogTrigger>
      </DropdownMenuContent>
    </DropdownMenu>
  </Dialog>
</template>
