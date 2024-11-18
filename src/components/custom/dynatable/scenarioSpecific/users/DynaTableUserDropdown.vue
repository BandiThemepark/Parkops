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
import { PropType, ref } from "vue";
import { BandiUser } from "./userColumns";
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import DialogContent from "@/components/ui/dialog/DialogContent.vue";
import { deleteUser } from "@/lib/backend/users";
import { useToast } from "@/components/ui/toast";
import router from "@/middleware/router";
import useAuthentication from "@/middleware/authentication";

const props = defineProps({
  user: {
    type: Object as PropType<BandiUser>,
    required: true,
  },
});
const { toast } = useToast();
function copy(email: string) {
  navigator.clipboard.writeText(email);
}
const currentUser = useAuthentication.getUser();
const theRouter = router;
const isRemoveDialogOpen = ref(false);
const removeUser = async (uid: string) => {
  const data = await deleteUser(uid);
  if (data.status === 200) {
    isRemoveDialogOpen.value = false;
    toast({
      title: "User removed",
      description: "User has been removed successfully",
    });
    theRouter.go(0);
  } else {
    toast({
      title: "Error",
      description: "An error occurred while removing the user",
    });
  }
};
defineEmits<{
  (e: "expand"): void;
}>();
</script>

<template>
  <Dialog v-model:open="isRemoveDialogOpen">
    <DialogTrigger> </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <p>
          Are you sure you want to remove {{ user.displayName || "no name" }}?
        </p>
      </DialogHeader>
      <DialogDescription>
        <p>{{ user.displayName || "no name" }} will lose access to ParkOps</p>
        <p>This action is irreversable!</p>
      </DialogDescription>
      <DialogFooter>
        <div class="flex gap-2">
          <Button variant="ghost">Cancel</Button>
          <Button @click="removeUser(user.uid)" variant="destructive"
            >Remove</Button
          >
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

        <DropdownMenuItem @click="copy(user.email!)">
          <CopyIcon class="size-4 mr-2" />
          <span>Copy email</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <PencilIcon class="size-4 mr-2" />
          <span>Edit</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator v-if="currentUser?.uid != user.uid" />
        <DialogTrigger class="w-full" v-if="currentUser?.uid != user.uid">
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
