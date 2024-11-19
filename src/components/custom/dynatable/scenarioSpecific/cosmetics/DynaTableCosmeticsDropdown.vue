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
import {
  MoreHorizontal,
  PencilIcon,
  CopyIcon,
  Trash2Icon,
  ChartColumnIcon,
  CoinsIcon,
  UserCheckIcon,
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

const isRemoveDialogOpen = ref(false);

defineEmits<{
  (e: "expand"): void;
}>();

const { toast } = useToast();

const removeCosmetic = async () => {
  const statistics = await getCosmeticStatistics(props.cosmetic.id);
  console.log(statistics.data);
  if (statistics.data.data.ownedBy.length > 0) {
    toast({
      title: "Cannot remove cosmetic",
      description:
        "Cosmetic is owned by someone\n It would be a shame to remove it from them 😢",
      variant: "destructive",
    });
    isRemoveDialogOpen.value = false;
  } else {
    const data = await deleteCosmetic(props.cosmetic.id);
    if (data.status === 200) {
      toast({
        title: "Cosmetic removed",
        description: "Cosmetic has been removed successfully",
      });
      isRemoveDialogOpen.value = false;
      return;
    }

    toast({
      title: "Error",
      description: "An error occurred while removing the cosmetic",
    });
  }
};

const statistics = ref({} as any);

const openStatisticsDialog = async () => {
  activeDialog.value = Dialogs.infoDialog;
  const data = await getCosmeticStatistics(props.cosmetic.id);
  console.log(data.data);
  statistics.value = data.data.data;
};

enum Dialogs {
  removeDialog = "removeDialog",
  infoDialog = "infoDialog",
}
const activeDialog = ref<Dialogs | null>(null);
</script>

<template>
  <Dialog v-model:open="isRemoveDialogOpen">
    <DialogContent v-if="activeDialog == Dialogs.removeDialog">
      <DialogHeader>
        <DialogTitle>
          Are you sure you want to remove {{ cosmetic.displayName }}?
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
          <Button variant="destructive" @click="removeCosmetic">
            Remove
          </Button>
        </div>
      </DialogFooter>
    </DialogContent>
    <DialogContent v-else-if="activeDialog == Dialogs.infoDialog">
      <DialogHeader>
        <DialogTitle> Cosmetic statistics </DialogTitle>
        <DialogDescription>
          some nice numbers to fill in the page
        </DialogDescription>
      </DialogHeader>
      <div>
        <!-- a place for  -->
        <div class="flex items-center space-x-4 mb-2">
          <CoinsIcon class="w-6 h-6" />
          <div>
            <Badge variant="outline" class="font-semibold -mb-1">
              {{ statistics?.totalRevenue }} coins
            </Badge>
            <p class="text-sm text-muted-foreground">
              Total coins spent for this cosmetic
            </p>
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <UserCheckIcon class="w-6 h-6" />
          <div>
            <Badge variant="outline" class="font-semibold -mb-1">
              {{ statistics?.ownedBy?.length }} player{{
                statistics?.ownedBy?.length == 1 ? "" : "s"
              }}
            </Badge>
            <p class="text-sm text-muted-foreground">Bought this cosmetic</p>
            <p class="text-sm text-muted-foreground">
              {{
                statistics?.ownedBy?.filter((item: any) => item.equipped).length
              }}
              have equipped this item
            </p>
          </div>
        </div>
      </div>
      <DialogFooter>
        <div class="flex gap-2">
          <Button variant="ghost" @click="activeDialog = null"> Close </Button>
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
        <DialogTrigger class="w-full" @click="openStatisticsDialog">
          <DropdownMenuItem>
            <ChartColumnIcon class="size-4 mr-2" />
            <span>Statistics</span>
          </DropdownMenuItem>
        </DialogTrigger>
        <!-- <DropdownMenuItem>
          <PencilIcon class="size-4 mr-2" />
          <span>Statistics</span>
        </DropdownMenuItem> -->
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
