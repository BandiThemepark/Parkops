<script lang="ts" setup>
import { AudioPlaylist, Region } from "@/lib/backendTypes";
import { computed, PropType, ref, watch } from "vue";
import FacetedInput from "@/components/custom/FacetedInput/FacetedInput.vue";
import Button from "../ui/button/Button.vue";
import Badge from "../ui/badge/Badge.vue";
import { updateAudioRegions } from "@/lib/backend/audio";

const props = defineProps({
  availableRegions: {
    type: Array as PropType<Region[]>,
    required: true,
  },
  playlist: {
    type: Object as PropType<AudioPlaylist>,
    required: true,
  },
});

const doublePlaylistValue = ref(props.playlist);

const saveRegions = async () => {
  const data = await updateAudioRegions(
    props.playlist.id,
    selectedValues.value
  );
  if (data.status === 200) {
    console.log("Regions updated");
    doublePlaylistValue.value.region = selectedValues.value
      .map((id) => findRegion(id))
      ?.filter((r) => r !== undefined) as Region[];
    return;
  } else {
    console.log("Failed to update regions");
  }
};

const selectedValues = ref<string[]>(
  (doublePlaylistValue.value.region?.map((r) => r.id) as string[]) ??
    ([] as string[])
);
const mappedPlaylistRegions = computed(
  () => doublePlaylistValue.value.region?.map((r) => r.id) ?? []
);

const listsHaveSameValue = (list1: string[], list2: string[]) => {
  if (list1.length !== list2.length) {
    return false;
  }
  return list1.every((value, index) => value === list2[index]);
};

const findRegion = (id: string) => {
  return props.availableRegions.find((region) => region.id === id);
};
</script>
<template>
  <div class="mb-2">
    <div
      :class="{ 'mb-2': selectedValues.length > 0 }"
      class="gap-2 flex flex-wrap"
    >
      <Badge variant="outline" v-for="region in selectedValues" :key="region">
        {{ findRegion(region)?.name }}
      </Badge>
    </div>
    <FacetedInput
      title="Region"
      v-model="selectedValues"
      :options="
              availableRegions.map((region:Region) => {
                return { label: region.name, value: region.id };
              })
            "
      :has-unique-options="false"
    />
  </div>

  <Button
    class="mb-4"
    v-if="!listsHaveSameValue(selectedValues, mappedPlaylistRegions)"
    @click="saveRegions"
    >Save regions</Button
  >
</template>
