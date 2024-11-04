<script lang="ts" setup>
import Button from "@/components/ui/button/Button.vue";
import router, { routes, getRoutesForRole } from "../../middleware/router";
import { Roles } from "../../middleware/authentication";
import useAuthentication from "../../middleware/authentication";
import { ref, defineProps } from "vue";
import { useRoute } from "vue-router";
import { User } from "firebase/auth";
import SidebarProvider from "../ui/sidebar/SidebarProvider.vue";
import SidebarTrigger from "../ui/sidebar/SidebarTrigger.vue";
import AppSideBar from "./appsidebar/AppSideBar.vue";
import Separator from "../ui/separator/Separator.vue";

const userRole = ref<Roles>(Roles.NONE);
const userouter = useRoute();
const currentUser = ref<null | User>(null);
const props = defineProps({
  hasPadding: {
    type: Boolean,
    default: true,
  },
});
(async () => {
  userRole.value = await useAuthentication.getUserRole();
  currentUser.value = await useAuthentication.getUser();
})();

const logout = () => {
  useAuthentication.logout();
  setTimeout(() => {
    router.push({ name: "login" });
  }, 1000);
};
</script>
<template>
  <SidebarProvider>
    <AppSideBar />
    <main class="flex flex-col w-full">
      <div class="border-b h-min w-full border-border p-4 flex items-center">
        <SidebarTrigger />
        <Separator orientation="vertical" />
      </div>
      <div
        class="overflow-y-auto w-full"
        :class="{ 'p-4 lg:p-16': props.hasPadding }"
      >
        <slot />
      </div>
    </main>
  </SidebarProvider>
</template>
