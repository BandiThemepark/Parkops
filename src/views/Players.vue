<script setup lang="ts">
import { ref } from "vue";
import DashboardProvider from "../components/custom/DashboardProvider.vue";
import DynamicTable from "../components/custom/dynamictable/DynamicTable.vue";

const testData = [
  {
    id: "1",
    name: "John Doe",
    firstJoined: "2021-01-01",
    lastSeen: "2021-01-01",
  },
  {
    id: "2",
    name: "Jane Doe",
    firstJoined: "2020-01-01",
    lastSeen: "2021-01-01",
  },
  {
    id: "3",
    name: "John Smith",
    firstJoined: "2019-01-01",
    lastSeen: "2021-01-01",
  },
];

const header = ref([
  {
    name: "Name",
    objectSelector: "name",
    sortable: true,
  },
  {
    name: "Joined since",
    objectSelector: "firstJoined",
    sortable: false,
  },
  {
    name: "Last seen",
    objectSelector: "lastSeen",
    sortable: true,
    alignedRight: true,
    format: (value: string) => {
      if (!value) return "";
      return new Date(value!).toLocaleTimeString();
    },
  },
]);
</script>

<template>
  <DashboardProvider>
    <DynamicTable
      :header="header"
      :data="testData"
      :max-lines="10"
      :is-loading="false"
    />
  </DashboardProvider>
</template>
