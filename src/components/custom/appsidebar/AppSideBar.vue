<script lang="ts" setup>
import Button from "@/components/ui/button/Button.vue";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "../../../components/ui/sidebar";
import { getRoutesForRole } from "@/middleware/router";
import { Roles } from "@/middleware/authentication";
import { useRoute } from "vue-router";
import { ChevronRightIcon, DashboardIcon, HomeIcon } from "@radix-icons/vue";
import { routes } from "@/middleware/router";
const userouter = useRoute();
const { state } = useSidebar();
</script>

<template>
  <Sidebar collapsible="icon"
    ><SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg">
            <div class="flex space-x-2 items-center">
              <div
                class="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground"
              >
                <DashboardIcon class="size-5" />
              </div>
              <span class="truncate text-lg font-semibold">ParkOps</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel> BandiThemepark </SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem
            v-for="route in getRoutesForRole([Roles.CREW])"
            :key="route.path"
          >
            <RouterLink :to="route.path">
              <SidebarMenuButton
                variant="default"
                :tooltip="route.meta?.navigationName?.toString()"
              >
                <span v-html="route.meta?.icon"></span>
                <span>{{ route.meta?.navigationName?.toString() }}</span>
                <ChevronRightIcon class="ml-auto" />
              </SidebarMenuButton>
            </RouterLink>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
      <SidebarGroup>
        <SidebarGroupLabel> Important stuff </SidebarGroupLabel>
      </SidebarGroup>
    </SidebarContent>
  </Sidebar>
</template>
