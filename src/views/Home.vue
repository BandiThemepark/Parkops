<script setup lang="ts">
import { ref } from "vue";
import DashboardProvider from "../components/custom/DashboardProvider.vue";
import useAuthentication from "../middleware/authentication";
import { Skeleton } from "../components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "../components/ui/card";
import { User } from "firebase/auth";
import { getGeneralServerStats } from "../lib/backend/general";

const isLoading = ref(false);
const user = ref<null | User>(null);
const generalServerStats = ref<null | any>(null);
(async () => {
  isLoading.value = true;
  const data = await Promise.all([
    useAuthentication.getUser(),
    getGeneralServerStats(),
  ]);

  user.value = data[0];
  generalServerStats.value = data[1];
  isLoading.value = false;
})();
</script>

<template>
  <DashboardProvider>
    <h1 class="font-bold text-3xl">
      <span v-if="!isLoading"
        >Howdy <span>{{ user?.displayName?.split(" ")[0] }}</span></span
      >
      <Skeleton v-else class="w-[200px] h-5" />
    </h1>
    <main class="grid md:grid-cols-6 lg:grid-cols-9 xl:grid-cols-12 mt-8 gap-6">
      <Card class="col-span-3">
        <CardHeader>
          <CardDescription
            ><span
              class="flex text-accent-foreground justify-between items-center"
            >
              <span>Unique Players</span>
              <span
                ><svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1"
                  stroke="currentColor"
                  class="size-5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
                  />
                </svg>
              </span> </span
          ></CardDescription>
        </CardHeader>
        <CardContent>
          <h1 v-if="!isLoading" class="text-3xl font-bold">
            {{ generalServerStats[0].uniquePlayers }}
          </h1>
          <Skeleton v-else class="w-full h-12" />
        </CardContent>
      </Card>
      <Card class="col-span-3">
        <CardHeader>
          <CardDescription
            ><span
              class="flex text-accent-foreground justify-between items-center"
            >
              <span>Sold ingame items</span>
              <span
                ><svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1"
                  stroke="currentColor"
                  class="size-5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                  />
                </svg>
              </span> </span
          ></CardDescription>
        </CardHeader>
        <CardContent>
          <h1 v-if="!isLoading" class="text-3xl font-bold">
            {{ generalServerStats[0].soldItems }}
          </h1>
          <Skeleton v-else class="w-full h-12" />
        </CardContent>
      </Card>
      <Card class="col-span-3">
        <CardHeader>
          <CardDescription
            ><span
              class="flex text-accent-foreground justify-between items-center"
            >
              <span>Ingame revenue</span>
              <span
                ><svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1"
                  stroke="currentColor"
                  class="size-5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z"
                  />
                </svg>
              </span> </span
          ></CardDescription>
        </CardHeader>
        <CardContent>
          <h1 v-if="!isLoading" class="text-3xl font-bold">
            {{ generalServerStats[0].totalValue.sum }}
          </h1>
          <Skeleton v-else class="w-full h-12" />
        </CardContent>
      </Card>
    </main>
  </DashboardProvider>
</template>
