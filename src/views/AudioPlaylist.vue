<script lang="ts" setup>
import AudioPlaylistDragDrop from "@/components/custom/AudioPlaylistDragDrop.vue";
import DashboardProvider from "@/components/custom/DashboardProvider.vue";
import DynaTable from "@/components/custom/dynatable/DynaTable.vue";
import { audioPlaylistColumns } from "@/components/custom/dynatable/scenarioSpecific/audiosources/audioPlaylistColumns";
import Card from "@/components/ui/card/Card.vue";
import CardContent from "@/components/ui/card/CardContent.vue";
import CardDescription from "@/components/ui/card/CardDescription.vue";
import CardHeader from "@/components/ui/card/CardHeader.vue";
import CardTitle from "@/components/ui/card/CardTitle.vue";
import { useToast } from "@/components/ui/toast";
import { getAudioPlaylists } from "@/lib/backend/audio";
import { AudioSource } from "@/lib/backendTypes";
import { GripHorizontalIcon } from "lucide-vue-next";
import { computed, ref } from "vue";
import { VueDraggableNext } from "vue-draggable-next";
const { toast } = useToast();

const audioPlaylist = ref([]);

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

const drag = ref(false);

(async () => {
  await refreshAudioPlaylist();
})();
</script>
<template>
  <DashboardProvider>
    <Card>
      <CardHeader>
        <CardTitle> Audio Playlist </CardTitle>
        <CardDescription>
          All the playlists available in the server
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DynaTable
          :has-extended-row="true"
          :data="audioPlaylist"
          :columns="audioPlaylistColumns({ updateData: refreshAudioPlaylist })"
          v-slot="{ rowData }"
        >
          <h1 class="font-semibold mb-2">Tracks in this playlist</h1>
          <AudioPlaylistDragDrop
            :audioSources="rowData.audioSources!"
            :order="JSON.parse(rowData.audioSourceOrder)"
            :playList="rowData"
          />
        </DynaTable>
      </CardContent>
    </Card>
  </DashboardProvider>
</template>
