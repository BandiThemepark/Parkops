<script setup lang="ts">
import { ref, h } from "vue";
import DashboardProvider from "../components/custom/DashboardProvider.vue";
import DynamicTable from "../components/custom/dynamictable/DynamicTable.vue";
import { getAllPlayers } from "../lib/backend/players";
import { Badge } from "../components/ui/badge";
import { vnodeToString } from "../lib/utils";
import Card from "@/components/ui/card/Card.vue";
import CardHeader from "@/components/ui/card/CardHeader.vue";
import CardTitle from "@/components/ui/card/CardTitle.vue";
import CardDescription from "@/components/ui/card/CardDescription.vue";
import CardContent from "@/components/ui/card/CardContent.vue";
import Input from "@/components/ui/input/Input.vue";
import DropdownMenu from "@/components/ui/dropdown-menu/DropdownMenu.vue";
import DropdownMenuTrigger from "@/components/ui/dropdown-menu/DropdownMenuTrigger.vue";
import Button from "@/components/ui/button/Button.vue";
import DropdownMenuContent from "@/components/ui/dropdown-menu/DropdownMenuContent.vue";
import DropdownMenuItem from "@/components/ui/dropdown-menu/DropdownMenuItem.vue";
import DropdownMenuSeparator from "@/components/ui/dropdown-menu/DropdownMenuSeparator.vue";
import DropdownMenuRadioGroup from "@/components/ui/dropdown-menu/DropdownMenuRadioGroup.vue";
import DropdownMenuRadioItem from "@/components/ui/dropdown-menu/DropdownMenuRadioItem.vue";
import DropdownMenuLabel from "@/components/ui/dropdown-menu/DropdownMenuLabel.vue";
import { ListFilter } from "lucide-vue-next";

const playerData = ref([]);
const isLoading = ref(false);
(async () => {
  isLoading.value = true;
  const data = await Promise.all([getAllPlayers()]);
  playerData.value = data[0].data;
  isLoading.value = false;
})();

const header = ref([
  {
    name: "Playername",
    objectSelector: "playername",
    sortable: true,
  },
  {
    name: "Rank",
    objectSelector: "rank",
    sortable: true,
    format: (value: string) => {
      return vnodeToString(
        h(
          Badge,
          {},
          {
            default: () => h("span", {}, { default: () => value }),
          }
        )
      );
    },
  },
  {
    name: "Last login",
    objectSelector: "lastJoined",
    sortable: true,
    format: (value: string) => {
      return new Date(value).toDateString();
    },
  },
  {
    name: "Status",
    objectSelector: "onServer",
    sortable: true,
    format: (value: string) => {
      if (value == "offline") {
        return `<span class="text-red-500">Offline</span>`;
      } else {
        return `<span class="text-green-500">Online</span>`;
      }
    },
  },
]);

const search = ref("");
const selectedRole = ref("");

const selectRole = (role: string) => {
  selectedRole.value = role;
};
</script>

<template>
  <DashboardProvider>
    <header class="flex justify-between items-end mb-4">
      <div class="relative w-full max-w-sm items-center h-min">
        <Input
          placeholder="Search for a player"
          class="max-w-[350px] pl-10"
          v-model="search"
        />
        <span
          class="absolute left-0 inset-y-0 flex items-center justify-center px-2"
        >
          <svg
            class="size-5 text-muted-foreground"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
        </span>
      </div>
      <div>
        <DropdownMenu v-model="selectedRole">
          <DropdownMenuTrigger as-child>
            <Button variant="outline" size="sm">
              <ListFilter class="mr-2" />
              <span>
                {{ selectedRole == "" ? "All" : selectedRole }} role{{
                  selectedRole == "" ? "s" : ""
                }}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Roles</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup v-model="selectedRole">
              <DropdownMenuRadioItem value=""> All </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="guest">
                Guest
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="vip"> VIP </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="crew"> Crew </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="owner">
                Owner
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>

    <Card>
      <CardHeader>
        <CardTitle> Players </CardTitle>
        <CardDescription>
          A list of all players that have joined the server at least once.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DynamicTable
          :header="header"
          :data="playerData"
          :max-lines="10"
          :is-loading="isLoading"
          :filters="[
            {
              column: 'playername',
              value: search,
            },
            {
              column: 'rank',
              value: selectedRole,
            },
          ]"
        />
      </CardContent>
    </Card>
  </DashboardProvider>
</template>
