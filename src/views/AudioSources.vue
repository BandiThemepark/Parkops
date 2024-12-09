<script lang="ts" setup>
import DashboardProvider from "@/components/custom/DashboardProvider.vue";
import DynaTable from "@/components/custom/dynatable/DynaTable.vue";
import { audioSourceColumns } from "@/components/custom/dynatable/scenarioSpecific/audiosources/audioSourceColumns";
import Button from "@/components/ui/button/Button.vue";
import Card from "@/components/ui/card/Card.vue";
import CardContent from "@/components/ui/card/CardContent.vue";
import CardDescription from "@/components/ui/card/CardDescription.vue";
import CardHeader from "@/components/ui/card/CardHeader.vue";
import CardTitle from "@/components/ui/card/CardTitle.vue";
import { createAudioSource, getAudioSources } from "@/lib/backend/audio";
import { PlusIcon } from "lucide-vue-next";
import { ref } from "vue";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { DialogRoot } from "radix-vue";
import DynaForm from "@/components/custom/DynaForm/DynaForm.vue";
import { z } from "zod";
import { AudioSource } from "@/lib/backendTypes";
import { useToast } from "@/components/ui/toast";

const audioSources = ref([]);
const isLoading = ref(false);
const isCreateDialogOpen = ref(false);
const refreshAudioSourceData = async () => {
  const data = await getAudioSources();
  audioSources.value = data.data.data;
  console.log(data.data.data);
};
(async () => {
  isLoading.value = true;
  await refreshAudioSourceData();

  isLoading.value = false;
})();

const onCreateAudioSource = async (audioSource: AudioSource) => {
  const dataToSend = {
    ...audioSource,
    length: calculatedDuration.value,
  };
  console.log(dataToSend);

  const data = await createAudioSource(dataToSend);
  console.log(data);
  isCreateDialogOpen.value = false;
  await refreshAudioSourceData();
};

const calculatedDuration = ref(0);
const { toast } = useToast();
const calculateDuration = (trackLink: string) => {
  try {
    const audio = new Audio(trackLink);
    audio.addEventListener("loadedmetadata", () => {
      console.log(audio.duration);
      calculatedDuration.value = Math.floor(audio.duration);
      toast({
        title: "Duration calculated",
        description: `The duration of the track is ${calculatedDuration.value} seconds`,
      });
    });
  } catch (error) {
    console.error(error);
  }
};

const onSubmit = (values: any) => {};
</script>
<template>
  <Sheet v-model:open="isCreateDialogOpen">
    <SheetContent>
      <SheetHeader>
        <SheetTitle> Create Audio Source </SheetTitle>
        <SheetDescription> Create a new audio source </SheetDescription>
      </SheetHeader>
      <SheetContent>
        <SheetHeader>
          <SheetTitle> Create AudioSource </SheetTitle>
          <SheetDescription> Create a new audio source </SheetDescription>
        </SheetHeader>
        <div>
          <DynaForm
            :inputs="[
              {
                name: 'name',
                label: 'Name',
                type: 'text',
                placeholder: 'Name',
                required: true,
                zodValidation: z.string().min(1),
                description: 'The name of track (displayed in the UI)',
              },
              {
                name: 'author',
                label: 'Author',
                type: 'text',
                placeholder: 'Author',
                required: true,
                zodValidation: z.string().min(1),
                description: 'The author of the track',
              },
              {
                name: 'source',
                label: 'Source',
                type: 'text',
                placeholder: 'Source',
                required: true,
                zodValidation: z.string().min(1),
                description: 'The source of the track',
              },
              {
                name: 'link',
                label: 'Link',
                type: 'text',
                placeholder: 'https://cdn.bandithemepark.net/public/...',
                required: true,
                zodValidation: z.string().url(),
                description: 'The link to the track (mp3)',
                onChange: calculateDuration,
              },
            ]"
            submit-text="Create"
            @submit="onCreateAudioSource"
          />
        </div>
      </SheetContent>
    </SheetContent>
  </Sheet>

  <DashboardProvider>
    <Card>
      <CardHeader>
        <CardTitle> Audio Sources </CardTitle>
        <CardDescription> Manage audio sources </CardDescription>
      </CardHeader>
      <CardContent>
        <div class="flex justify-end">
          <Button @click="isCreateDialogOpen = true">
            <PlusIcon class="size-4" />
            <p>Create</p>
          </Button>
        </div>
        <DynaTable
          :data="audioSources"
          :columns="audioSourceColumns({ updateData: refreshAudioSourceData })"
        />
      </CardContent>
    </Card>
  </DashboardProvider>
</template>
