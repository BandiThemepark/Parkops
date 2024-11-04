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
const userouter = useRoute();
const { state } = useSidebar();
</script>

<template>
  <Sidebar variant="sidebar" collapsible="icon" :isMobile="true">
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>ParkOps</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <ul class="grid gap-2">
              <RouterLink
                class="hover:bg-accent hover:text-accent-foreground rounded-lg p-1"
                :class="{ 'p-0': state === 'collapsed' }"
                :to="route.path"
                v-for="route in getRoutesForRole([Roles.CREW])"
                :key="route.path"
                asChild
                ><SidebarMenuItem>
                  <div class="flex items-center space-x-4">
                    <span
                      class="size-8 flex justify-center items-center"
                      v-if="(route.meta?.icon as string)?.trim()"
                      v-html="route.meta?.icon"
                    ></span>
                    <span v-else class="w-8">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        class="size-5"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M11.622 1.602a.75.75 0 0 1 .756 0l2.25 1.313a.75.75 0 0 1-.756 1.295L12 3.118 10.128 4.21a.75.75 0 1 1-.756-1.295l2.25-1.313ZM5.898 5.81a.75.75 0 0 1-.27 1.025l-1.14.665 1.14.665a.75.75 0 1 1-.756 1.295L3.75 8.806v.944a.75.75 0 0 1-1.5 0V7.5a.75.75 0 0 1 .372-.648l2.25-1.312a.75.75 0 0 1 1.026.27Zm12.204 0a.75.75 0 0 1 1.026-.27l2.25 1.312a.75.75 0 0 1 .372.648v2.25a.75.75 0 0 1-1.5 0v-.944l-1.122.654a.75.75 0 1 1-.756-1.295l1.14-.665-1.14-.665a.75.75 0 0 1-.27-1.025Zm-9 5.25a.75.75 0 0 1 1.026-.27L12 11.882l1.872-1.092a.75.75 0 1 1 .756 1.295l-1.878 1.096V15a.75.75 0 0 1-1.5 0v-1.82l-1.878-1.095a.75.75 0 0 1-.27-1.025ZM3 13.5a.75.75 0 0 1 .75.75v1.82l1.878 1.095a.75.75 0 1 1-.756 1.295l-2.25-1.312a.75.75 0 0 1-.372-.648v-2.25A.75.75 0 0 1 3 13.5Zm18 0a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-.372.648l-2.25 1.312a.75.75 0 1 1-.756-1.295l1.878-1.096V14.25a.75.75 0 0 1 .75-.75Zm-9 5.25a.75.75 0 0 1 .75.75v.944l1.122-.654a.75.75 0 1 1 .756 1.295l-2.25 1.313a.75.75 0 0 1-.756 0l-2.25-1.313a.75.75 0 1 1 .756-1.295l1.122.654V19.5a.75.75 0 0 1 .75-.75Z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </span>

                    <span v-if="state != 'collapsed'">{{
                      route.meta?.navigationName
                    }}</span>
                  </div>
                </SidebarMenuItem>
              </RouterLink>
            </ul>
            <!-- <SidebarMenuItem>
              <Button class="justify-start w-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205 3 1m1.5.5-1.5-.5M6.75 7.364V3h-3v18m3-13.636 10.5-3.819"
                  />
                </svg>

                <span>Home</span>
              </Button>
            </SidebarMenuItem> -->
            <!-- {items.map((item) => (
            <SidebarMenuItem key="{item.title}">
              <SidebarMenuButton asChild>
                <a href="{item.url}">
                  <item.icon />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            ))} -->
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      <SidebarGroup>
        <SidebarGroupLabel>Powerful peeps only</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <!-- {items.map((item) => (
            <SidebarMenuItem key="{item.title}">
              <SidebarMenuButton asChild>
                <a href="{item.url}">
                  <item.icon />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            ))} -->
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  </Sidebar>
</template>
