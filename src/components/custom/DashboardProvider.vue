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
import SidebarInset from "../ui/sidebar/SidebarInset.vue";
import { useToast } from "../ui/toast";

const { toast } = useToast();
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
  toast({
    title: "Logged out",
    description: "You have been logged out. Goodbye! 👋",
  });
  setTimeout(() => {
    router.push({ name: "login" });
  }, 1000);
};
</script>
<template>
  <SidebarProvider>
    <AppSideBar />
    <main class="flex flex-col w-full">
      <SidebarInset>
        <header class="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger class="-ml-1" />
          <Separator orientation="vertical" class="mr-2 h-4" />
          <!-- <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem class="hidden md:block">
                <BreadcrumbLink href="#">
                  Building Your Application
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator class="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Data Fetching</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb> -->
        </header>

        <main
          :class="{ 'p-4 lg:p-8': props.hasPadding }"
          class="max-h-[calc(100vh-64px)] overflow-y-hidden"
        >
          <slot />
        </main>
      </SidebarInset>
    </main>
  </SidebarProvider>
</template>
