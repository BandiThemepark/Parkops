<script setup lang="ts">
import Toaster from "./components/ui/toast/Toaster.vue";
import { checkApiStatus } from "./lib/backend/general";
(async () => {
  checkApiStatus();
})();
</script>

<template><Toaster /> <RouterView /></template>
