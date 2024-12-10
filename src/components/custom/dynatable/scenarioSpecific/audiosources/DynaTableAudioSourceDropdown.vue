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
import { AudioSource, Cosmetic } from "@/lib/backendTypes";
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
import { deleteAudioSource } from "@/lib/backend/audio";

const props = defineProps({
  audioSource: {
    type: Object as PropType<AudioSource>,
    required: true,
  },
});

const currentUser = useAuthentication.getUser();

const isRemoveDialogOpen = ref(false);

const emit = defineEmits<{
  (e: "expand"): void;
  (e: "refreshAudioSources"): void;
}>();

const { toast } = useToast();

const removeAudioSource = async () => {
  const data = await deleteAudioSource(props.audioSource.id);
  if (data.status == 200) {
    toast({
      title: "Audio source removed",
      description: "The audio source has been removed",
    });
    emit("refreshAudioSources");
  } else {
    toast({
      title: "Error",
      description: "An error occured while removing the audio source",
    });
  }
};

enum Dialogs {
  removeDialog = "removeDialog",
}
const activeDialog = ref<Dialogs | null>(null);
// const emit = defineEmits(["refreshCosmetics"]);

const openAudio = () => {
  window.open(props.audioSource.source, "_blank");
};

const copyAudio = () => {
  navigator.clipboard.writeText(props.audioSource.link);
  toast({
    title: "Link copied",
    description: "The link has been copied to your clipboard",
  });
};

const copyAudioId = () => {
  navigator.clipboard.writeText(props.audioSource.id);
  toast({
    title: "Id copied",
    description: "The id has been copied to your clipboard",
  });
};
</script>

<template>
  <Dialog v-model:open="isRemoveDialogOpen">
    <DialogContent v-if="activeDialog == Dialogs.removeDialog">
      <DialogHeader>
        <DialogTitle>
          Are you sure you want to remove {{ audioSource.name }}?
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
          <Button variant="destructive" @click="removeAudioSource">
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
        <DropdownMenuItem @click="openAudio">
          <HeadphonesIcon class="size-4 mr-2" />
          <span>Open in Spotify</span>
        </DropdownMenuItem>
        <DropdownMenuItem @click="copyAudio">
          <ClipboardCopyIcon class="size-4 mr-2" />

          <span>Copy link</span>
        </DropdownMenuItem>
        <DropdownMenuItem @click="copyAudioId">
          <ClipboardCopyIcon class="size-4 mr-2" />

          <span>Copy ID</span>
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
