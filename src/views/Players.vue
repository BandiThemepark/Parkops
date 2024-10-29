<script setup lang="ts">
import { ref, h } from "vue";
import DashboardProvider from "../components/custom/DashboardProvider.vue";
import DynamicTable from "../components/custom/dynamictable/DynamicTable.vue";
import { getAllPlayers } from "../lib/backend/players";
import { Badge } from "../components/ui/badge";
import { vnodeToString } from "../lib/utils";

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
</script>

<template>
  <DashboardProvider>
    <DynamicTable
      :header="header"
      :data="playerData"
      :max-lines="10"
      :is-loading="isLoading"
    />
  </DashboardProvider>
</template>
