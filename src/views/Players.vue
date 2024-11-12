<script setup lang="ts">
import { ref, h } from "vue";
import DashboardProvider from "../components/custom/DashboardProvider.vue";
import { getAllPlayers } from "../lib/backend/players";
import DynaTable from "@/components/custom/dynatable/DynaTable.vue";
import { playerColums } from "@/components/custom/dynatable/scenarioSpecific/players/playerColumns";
import {
  CrownIcon,
  GraduationCapIcon,
  HandCoinsIcon,
  LeafyGreenIcon,
  RouterIcon,
  ServerOffIcon,
} from "lucide-vue-next";
const playerData = ref([]);
const isLoading = ref(false);
(async () => {
  isLoading.value = true;
  const data = await Promise.all([getAllPlayers()]);
  playerData.value = data[0].data;
  isLoading.value = false;
})();
</script>

<template>
  <DashboardProvider>
    <DynaTable
      :columns="playerColums"
      :data="playerData"
      :search-bar="true"
      search-for="playername"
      :extra-faceted-filter="[
        {
          title: 'Role',
          hasUniqueOptions: true,
          options: [
            { label: 'Guest', value: 'guest', icon: LeafyGreenIcon },
            { label: 'VIP', value: 'vip', icon: HandCoinsIcon },
            { label: 'Crew', value: 'crew', icon: GraduationCapIcon },
            { label: 'Owner', value: 'owner', icon: CrownIcon },
          ],
          columnId: 'role',
        },
        {
          title: 'Server',
          hasUniqueOptions: true,
          options: [
            { label: 'Offline', value: 'offline', icon: ServerOffIcon },
            { label: 'Queue', value: 'queue', icon: RouterIcon },
            {
              label: 'BandiThemepark',
              value: 'bandithemepark',
              icon: RouterIcon,
            },
          ],
          columnId: 'onServer',
        },
      ]"
    />

    <!-- <Card>
      <CardHeader>
        <CardTitle> Players </CardTitle>
        <CardDescription>
          A list of all players that have joined the server at least once.
        </CardDescription>
      </CardHeader>
      <CardContent>

      </CardContent>
    </Card> -->
  </DashboardProvider>
</template>
