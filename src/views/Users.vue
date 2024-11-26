<script lang="ts" setup>
import DashboardProvider from "@/components/custom/DashboardProvider.vue";
import DynaTable from "@/components/custom/dynatable/DynaTable.vue";
import { userColumns } from "@/components/custom/dynatable/scenarioSpecific/users/userColumns";

import Button from "@/components/ui/button/Button.vue";
import Card from "@/components/ui/card/Card.vue";
import CardContent from "@/components/ui/card/CardContent.vue";
import CardDescription from "@/components/ui/card/CardDescription.vue";
import CardHeader from "@/components/ui/card/CardHeader.vue";
import CardTitle from "@/components/ui/card/CardTitle.vue";

import Dialog from "@/components/ui/dialog/Dialog.vue";
import DialogContent from "@/components/ui/dialog/DialogContent.vue";
import DialogDescription from "@/components/ui/dialog/DialogDescription.vue";
import DialogFooter from "@/components/ui/dialog/DialogFooter.vue";
import DialogHeader from "@/components/ui/dialog/DialogHeader.vue";
import DialogTitle from "@/components/ui/dialog/DialogTitle.vue";
import DropdownMenu from "@/components/ui/dropdown-menu/DropdownMenu.vue";
import DropdownMenuContent from "@/components/ui/dropdown-menu/DropdownMenuContent.vue";
import DropdownMenuGroup from "@/components/ui/dropdown-menu/DropdownMenuGroup.vue";
import DropdownMenuItem from "@/components/ui/dropdown-menu/DropdownMenuItem.vue";
import DropdownMenuLabel from "@/components/ui/dropdown-menu/DropdownMenuLabel.vue";
import DropdownMenuSeparator from "@/components/ui/dropdown-menu/DropdownMenuSeparator.vue";
import DropdownMenuTrigger from "@/components/ui/dropdown-menu/DropdownMenuTrigger.vue";
import Input from "@/components/ui/input/Input.vue";
import Tooltip from "@/components/ui/tooltip/Tooltip.vue";
import TooltipContent from "@/components/ui/tooltip/TooltipContent.vue";
import TooltipProvider from "@/components/ui/tooltip/TooltipProvider.vue";
import TooltipTrigger from "@/components/ui/tooltip/TooltipTrigger.vue";
import { createRegistration, getAllUsers } from "@/lib/backend/users";
import { CopyIcon, PlusIcon } from "lucide-vue-next";
import { ref, VNodeRef } from "vue";

const isLoading = ref(false);
const userData = ref([]);

const inputRef = ref<VNodeRef | null>(null);
const registrationToken = ref("");
const isDialogOpen = ref(false);
const clickCreateRegistration = async (role: string) => {
  isCopied.value = false;
  const data = await createRegistration(role);
  registrationToken.value = data.data.token;
  isDialogOpen.value = true;
};

const isCopied = ref(false);
const copyToClipboard = () => {
  // inputRef.value.select();
  navigator.clipboard.writeText(registrationToken.value);
  isCopied.value = true;
};

(async () => {
  isLoading.value = true;
  const data = await getAllUsers();
  userData.value = data.data;
  isLoading.value = false;
})();
</script>

<template>
  <Dialog v-model:open="isDialogOpen">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Registration created!</DialogTitle>
        <DialogDescription>
          Don't forget to send the registration token to the user. This token
          can't be viewed again.
        </DialogDescription>
        <DialogDescription>
          <b> This token is only valid for 30 minutes. </b>
        </DialogDescription>
      </DialogHeader>
      <div class="flex items-center space-x-2">
        <div class="grid flex-1 gap-2">
          <Input
            :ref="inputRef"
            id="link"
            v-model="registrationToken"
            readonly
          />
        </div>
        <div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger as-child>
                <Button @click="copyToClipboard()" variant="outline">
                  <CopyIcon />
                </Button>
              </TooltipTrigger>
              <TooltipContent> Copy to clipboard </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip :open="isCopied">
              <TooltipTrigger as-child>
                <div></div>
              </TooltipTrigger>
              <TooltipContent class="-translate-y-8">
                Token copied
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      <DialogFooter>
        <Button @click="isDialogOpen = false" variant="default">Close</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
  <DashboardProvider :has-padding="true">
    <Card>
      <CardHeader>
        <CardTitle> Crewmembers </CardTitle>
        <CardDescription>
          All the users who have access to ParkOps
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div class="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="outline">
                <PlusIcon />
                <span>Create invitation</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" class="w-44">
              <DropdownMenuLabel>Select role</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem @click="clickCreateRegistration('CREW')"
                  ><svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                    class="size-4 mr-2"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5"
                    />
                  </svg>

                  <span>Crew</span>
                </DropdownMenuItem>
                <DropdownMenuItem @click="clickCreateRegistration('OWNER')">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                    class="size-4 mr-2"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
                    />
                  </svg>

                  <span> Owner </span>
                </DropdownMenuItem></DropdownMenuGroup
              >
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <DynaTable
          :columns="userColumns"
          :data="userData"
          :searchBar="true"
          search-for="username"
        >
        </DynaTable>
      </CardContent>
    </Card>
  </DashboardProvider>
</template>
