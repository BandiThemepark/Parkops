<script lang="ts" setup>
import DashboardProvider from "@/components/custom/DashboardProvider.vue";
import { getOneShop } from "@/lib/backend/shops";
import { Shop } from "@/lib/backendTypes";
import { onBeforeMount, ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const shop = ref<Shop>({} as Shop);
const isLoading = ref(false);

onBeforeMount(async () => {
  isLoading.value = true;
  console.log(route.params.id);
  const data = await getOneShop(route.params.id as string);
  shop.value = data.data.data;
  isLoading.value = false;
  console.log(shop.value);
});
</script>

<template>
  <DashboardProvider>
    <div>
      <h1 class="font-semibold text-lg">{{ shop.displayName }}</h1>
      <h3 class="text-sm -mt-1 text-muted-foreground">{{ shop.name }}</h3>
    </div>
  </DashboardProvider>
</template>
