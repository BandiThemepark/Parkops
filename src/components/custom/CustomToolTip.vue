<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

defineProps<{
  title?: string;
  data: {
    name: string;
    color: string;
    value: any;
  }[];
}>();

const formatTitle = (title: string) => {
  // try to cast title to Date, if it fails, return title
  const date = new Date(title);
  return isNaN(date.getTime())
    ? title
    : new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
      }).format(date);
};
</script>

<template>
  <Card class="text-sm">
    <CardHeader v-if="title" class="p-3 pb-0">
      <span class="font-semibold">{{ formatTitle(title) }}</span>
    </CardHeader>
    <CardContent class="p-3 min-w-[180px] flex flex-col gap-1">
      <div v-for="(item, key) in data" :key="key" class="flex justify-between">
        <div class="flex items-center">
          <span
            class="w-1.5 h-full mr-2 rounded-lg"
            :style="{ backgroundColor: item.color }"
          >
          </span>
          <span>{{ item.name }}</span>
        </div>
        <span class="font-semibold ml-4">{{ item.value }}</span>
      </div>
    </CardContent>
  </Card>
</template>
