<script lang="ts" setup>
import DashboardProvider from "@/components/custom/DashboardProvider.vue";
import DynaTable from "@/components/custom/dynatable/DynaTable.vue";
import { ShopsColumns } from "@/components/custom/dynatable/scenarioSpecific/shops/shopsColumns";
import Card from "@/components/ui/card/Card.vue";
import CardContent from "@/components/ui/card/CardContent.vue";
import CardDescription from "@/components/ui/card/CardDescription.vue";
import CardHeader from "@/components/ui/card/CardHeader.vue";
import CardTitle from "@/components/ui/card/CardTitle.vue";
import { useToast } from "@/components/ui/toast";
import { getAllCosmetics } from "@/lib/backend/cosmetics";
import { getShops } from "@/lib/backend/shops";
import { Cosmetic } from "@/lib/backendTypes";
import { computed, ref } from "vue";
const { toast } = useToast();
const isLoading = ref(false);
const shops = ref([]);
const cosmetics = ref([]);

const refreshShops = async () => {
  isLoading.value = true;
  const data = await getShops();
  if (data.status === 200) {
    shops.value = data.data.data;
  } else {
    toast({
      title: "Error",
      description: "Failed to fetch shops",
      variant: "destructive",
    });
  }
  isLoading.value = false;
};

const refreshCosmetics = async () => {
  const data = await getAllCosmetics();
  if (data.status === 200) {
    cosmetics.value = data.data.data;
  } else {
    toast({
      title: "Error",
      description: "Failed to fetch cosmetics",
      variant: "destructive",
    });
  }
};

(async () => {
  await refreshCosmetics();
  await refreshShops();
})();
</script>
<template>
  <DashboardProvider>
    <Card>
      <CardHeader>
        <CardTitle>Shops</CardTitle>
        <CardDescription>Let's make some money $$$</CardDescription>
      </CardHeader>
      <CardContent>
        <DynaTable
          :columns="ShopsColumns({ updateData: refreshShops })"
          :data="shops"
          :search-bar="true"
          search-for="name"
        >
        </DynaTable>
      </CardContent>
    </Card>
  </DashboardProvider>
</template>
