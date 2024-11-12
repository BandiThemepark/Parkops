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
  CoinsIcon,
  LeafyGreenIcon,
  RouterIcon,
  ServerOffIcon,
  MedalIcon,
  ShirtIcon,
} from "lucide-vue-next";
import Card from "@/components/ui/card/Card.vue";
import CardHeader from "@/components/ui/card/CardHeader.vue";
import CardTitle from "@/components/ui/card/CardTitle.vue";
import CardDescription from "@/components/ui/card/CardDescription.vue";
import CardContent from "@/components/ui/card/CardContent.vue";
import Badge from "@/components/ui/badge/Badge.vue";

const playerData = ref([]);
const isLoading = ref(false);
(async () => {
  isLoading.value = true;
  const data = await Promise.all([getAllPlayers()]);
  playerData.value = data[0].data;
  isLoading.value = false;
})();

const secondsToNiceTime = (seconds: number) => {
  const days = Math.floor(seconds / (3600 * 24));
  const hours = Math.floor((seconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${days}d ${hours}h ${minutes}m`;
};
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
      v-slot="{ rowData }"
    >
      <div>
        <div class="">
          <Card>
            <CardHeader>
              <CardTitle> Online time </CardTitle>
              <CardDescription>
                {{ secondsToNiceTime(rowData.playtime || 0) }}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div class="w-full flex h-8 rounded-lg overflow-hidden">
                <div
                  class="bg-stone-700 h-full flex items-center pl-2"
                  :style="{
                    width:
                      (rowData.playtime || 0) + (rowData.afkTime || 0) === 0
                        ? '50%'
                        : (((rowData.playtime || 0) - (rowData.afkTime || 0)) /
                            (rowData.playtime || 0)) *
                            100 +
                          '%',
                  }"
                >
                  <span class="truncate text-accent font-medium">
                    Active:
                    {{
                      secondsToNiceTime(
                        (rowData.playtime || 0) - (rowData.afkTime || 0)
                      )
                    }}
                  </span>
                </div>
                <div
                  class="bg-stone-600 h-full flex items-center pl-2"
                  :style="{
                    width:
                      (rowData.playtime || 0) + (rowData.afkTime || 0) === 0
                        ? '50%'
                        : ((rowData.afkTime || 0) / (rowData.playtime || 0)) *
                            100 +
                          '%',
                  }"
                >
                  <span class="truncate text-accent font-medium">
                    AFK: {{ secondsToNiceTime(rowData.afkTime || 0) }}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
          <div class="mt-4 flex gap-2">
            <Badge variant="outline"
              ><div class="flex items-center space-x-3">
                <CoinsIcon class="size-4" />
                <h1 class="font-medium">Wallet:</h1>
                <p>{{ rowData.coins }} coins</p>
              </div></Badge
            >
            <Badge variant="outline"
              ><div class="flex items-center space-x-3">
                <MedalIcon class="size-4" />
                <h1 class="font-medium">Achievements:</h1>
                <p>{{ rowData.achievements?.length || 0 }}</p>
              </div></Badge
            >
            <Badge variant="outline"
              ><div class="flex items-center space-x-3">
                <ShirtIcon class="size-4" />
                <h1 class="font-medium">Cosmetics:</h1>
                <p>{{ rowData.cosmetics?.length || 0 }}</p>
              </div></Badge
            >
          </div>
        </div>
      </div>
    </DynaTable>
  </DashboardProvider>
</template>
