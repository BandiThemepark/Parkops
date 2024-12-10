<script lang="ts" setup>
import Badge from "@/components/ui/badge/Badge.vue";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Region } from "@/lib/backendTypes";
import { PropType } from "vue";

defineProps({
  regions: Array as PropType<Region[]>,
});
</script>

<template>
  <HoverCard v-if="regions">
    <HoverCardTrigger>
      <Badge variant="outline"> {{ regions?.length ?? 0 }} regions </Badge>
    </HoverCardTrigger>
    <HoverCardContent>
      <div>
        <div>
          <h1 class="font-semibold text-sm">Played in:</h1>
          <ul>
            <li v-for="region in regions">
              {{ region.name }}
            </li>
          </ul>
        </div>
      </div>
    </HoverCardContent>
  </HoverCard>
  <Badge v-else variant="outline"> 0 regions </Badge>
</template>
