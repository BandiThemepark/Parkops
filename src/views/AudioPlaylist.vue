<script lang="ts" setup>
import AudioPlaylistDragDrop from "@/components/custom/AudioPlaylistDragDrop.vue";
import AudioPlaylistRegionEdit from "@/components/custom/AudioPlaylistRegionEdit.vue";
import DashboardProvider from "@/components/custom/DashboardProvider.vue";
import DynaForm from "@/components/custom/DynaForm/DynaForm.vue";
import DynaTable from "@/components/custom/dynatable/DynaTable.vue";
import DynaTableFacetedFilter from "@/components/custom/dynatable/DynaTableFacetedFilter.vue";
import { audioPlaylistColumns } from "@/components/custom/dynatable/scenarioSpecific/audiosources/audioPlaylistColumns";
import Button from "@/components/ui/button/Button.vue";
import Card from "@/components/ui/card/Card.vue";
import CardContent from "@/components/ui/card/CardContent.vue";
import CardDescription from "@/components/ui/card/CardDescription.vue";
import CardHeader from "@/components/ui/card/CardHeader.vue";
import CardTitle from "@/components/ui/card/CardTitle.vue";
import Sheet from "@/components/ui/sheet/Sheet.vue";
import SheetClose from "@/components/ui/sheet/SheetClose.vue";
import SheetContent from "@/components/ui/sheet/SheetContent.vue";
import SheetDescription from "@/components/ui/sheet/SheetDescription.vue";
import SheetFooter from "@/components/ui/sheet/SheetFooter.vue";
import SheetHeader from "@/components/ui/sheet/SheetHeader.vue";
import SheetTitle from "@/components/ui/sheet/SheetTitle.vue";
import { useToast } from "@/components/ui/toast";
import { createAudioPlaylist, getAudioPlaylists } from "@/lib/backend/audio";
import { getRegions } from "@/lib/backend/general";
import { AudioSource, Region } from "@/lib/backendTypes";
import { GripHorizontalIcon } from "lucide-vue-next";
import { computed, ref } from "vue";
import { VueDraggableNext } from "vue-draggable-next";
import { z } from "zod";
const { toast } = useToast();

const audioPlaylist = ref([]);
const isCreateSheetOpen = ref(false);
const refreshAudioPlaylist = async () => {
  const response = await getAudioPlaylists();
  if (response.status === 200) {
    audioPlaylist.value = response.data.data;
    console.log(audioPlaylist.value);
    return;
  }
  toast({
    title: "Error",
    description: "Failed to fetch audio playlist",
  });
};

const fetchRegions = async () => {
  const data = await getRegions();
  if (data.status === 200) {
    return data.data;
  }
  return [];
};

const createPlayList = async (formData: any) => {
  const response = await createAudioPlaylist(formData.name);
  if (response.status === 200) {
    toast({
      title: "Success",
      description: "Playlist created successfully",
    });
    isCreateSheetOpen.value = false;
    await refreshAudioPlaylist();
    return;
  }
  toast({
    title: "Error",
    description: "Failed to create playlist",
    variant: "destructive",
  });
};

const drag = ref(false);
const availableRegions = ref([]);
(async () => {
  await refreshAudioPlaylist();
  const regions = await fetchRegions();
  availableRegions.value = regions.data;
})();
</script>
<template>
  <Sheet v-model:open="isCreateSheetOpen">
    <SheetContent>
      <SheetHeader>
        <SheetTitle> Create Audio Playlist </SheetTitle>
        <SheetDescription> Create a new audio playlist </SheetDescription>
        <div>
          <DynaForm
            :inputs="[
              {
                name: 'name',
                label: 'Name',
                type: 'text',
                required: true,
                placeholder: 'Mainstreet christmas 2016',
                zodValidation: z
                  .string()
                  .min(1)
                  .refine(
                    (s) => !s.includes(' '),
                    'Name may not contain spaces'
                  ),
                description: 'Name of the playlist',
              },
            ]"
            submit-text="Create Playlist"
            @submit="createPlayList"
          >
          </DynaForm>
        </div>
      </SheetHeader>
    </SheetContent>
  </Sheet>
  <DashboardProvider>
    <Card>
      <CardHeader>
        <CardTitle> Audio Playlist </CardTitle>
        <CardDescription>
          All the playlists available in the server
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div class="flex justify-end">
          <Button @click="isCreateSheetOpen = true"> Create Playlist </Button>
        </div>
        <DynaTable
          :search-bar="true"
          search-for="name"
          :has-extended-row="true"
          :data="audioPlaylist"
          :columns="audioPlaylistColumns({ updateData: refreshAudioPlaylist })"
          v-slot="{ rowData }"
        >
          <h1 class="font-semibold mb-2">Region</h1>
          <AudioPlaylistRegionEdit
            :availableRegions="availableRegions"
            :playlist="rowData"
          />
          <h1 class="font-semibold mb-2">Tracks in this playlist</h1>
          <AudioPlaylistDragDrop
            :audioSources="rowData.audioSources!"
            :order="rowData.audioSourceOrder"
            :playList="rowData"
          />
        </DynaTable>
      </CardContent>
    </Card>
  </DashboardProvider>
</template>
