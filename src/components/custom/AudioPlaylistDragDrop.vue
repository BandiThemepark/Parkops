<script lang="ts" setup>
import {
  CheckIcon,
  ChevronsUpDownIcon,
  GripHorizontalIcon,
  PlusIcon,
  UnplugIcon,
} from "lucide-vue-next";
import { computed, PropType, ref, watch } from "vue";
import { VueDraggableNext } from "vue-draggable-next";
import Card from "@/components/ui/card/Card.vue";
import CardContent from "@/components/ui/card/CardContent.vue";
import CardDescription from "@/components/ui/card/CardDescription.vue";
import CardHeader from "@/components/ui/card/CardHeader.vue";
import CardTitle from "@/components/ui/card/CardTitle.vue";
import { AudioPlaylist, AudioSource } from "@/lib/backendTypes";
import Button from "../ui/button/Button.vue";
import {
  getAudioSources,
  updateAudioPlaylistOrder,
  updateAudioPlaylistTracks,
} from "@/lib/backend/audio";
import { useToast } from "../ui/toast";
import Dialog from "../ui/dialog/Dialog.vue";
import DialogTrigger from "../ui/dialog/DialogTrigger.vue";
import DialogContent from "../ui/dialog/DialogContent.vue";
import DialogHeader from "../ui/dialog/DialogHeader.vue";
import DialogTitle from "../ui/dialog/DialogTitle.vue";
import DialogDescription from "../ui/dialog/DialogDescription.vue";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { cn } from "@/lib/utils";
import Badge from "../ui/badge/Badge.vue";

const sortAudioSources = (
  audioSources: AudioSource[],
  audioSourceOrder: string[]
) =>
  audioSources.sort(
    (a, b) =>
      (audioSourceOrder.indexOf(a.id) + 1 || Infinity) -
      (audioSourceOrder.indexOf(b.id) + 1 || Infinity)
  );

const { toast } = useToast();

const props = defineProps({
  playList: {
    type: Object as PropType<AudioPlaylist>,
    required: true,
  },
  audioSources: {
    type: Object as PropType<AudioSource[]>,
    required: true,
  },
  order: {
    type: Array as PropType<string[]>,
    required: true,
  },
});

const audioSources = ref(
  sortAudioSources(props.audioSources ?? [], props.order)
);

const newOrder = computed({
  get: () => audioSources.value.map((source) => source.id),
  set: (newOrder) => {
    audioSources.value = sortAudioSources(audioSources.value, newOrder);
  },
});

const hasChanged = computed(() => {
  return JSON.stringify(newOrder.value) !== JSON.stringify(props.order);
});

const saveOrder = async () => {
  // const saveData = await saveTracks();
  // const data = await updateAudioPlaylistOrder(
  //   props.playList.id,
  //   newOrder.value
  // );

  const [saveData, data] = await Promise.all([
    saveTracks(),
    updateAudioPlaylistOrder(props.playList.id, newOrder.value),
  ]);

  if (saveData.status === 200 && data.status === 200) {
    props.playList.audioSourceOrder = JSON.stringify(newOrder.value);
    toast({
      title: "Success",
      description: "Audio playlist order updated",
    });
  } else {
    toast({
      title: "Error",
      description: "Failed to update audio playlist order",
      variant: "destructive",
    });
  }

  // if (data.status === 200) {
  //   props.playList.audioSourceOrder = JSON.stringify(newOrder.value);
  //   toast({
  //     title: "Success",
  //     description: "Audio playlist order updated",
  //   });
  // } else {
  //   toast({
  //     title: "Error",
  //     description: "Failed to update audio playlist order",
  //     variant: "destructive",
  //   });
  // }
};

const saveTracks = async () => {
  const data = await updateAudioPlaylistTracks(
    props.playList.id,
    audioSources.value
  );
  return data;
};

const revertOrder = () => {
  audioSources.value = sortAudioSources(props.audioSources, props.order);
};

const isAddDialogOpen = ref(false);
const availableAudioSources = ref<AudioSource[]>([]);
const selectedAudioSource = ref<AudioSource | undefined>(undefined);
const isSelectOpen = ref(false);

watch(
  () => isAddDialogOpen.value,
  async () => {
    if (isAddDialogOpen.value) {
      const response = await getAudioSources();
      if (response.status === 200) {
        availableAudioSources.value = response.data.data;
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch audio sources",
          variant: "destructive",
        });
      }
    }
  }
);

const addTrackToPlaylist = async () => {
  if (!selectedAudioSource.value) {
    toast({
      title: "Error",
      description: "Please select an audio source",
      variant: "destructive",
    });
    return;
  }
  audioSources.value.push(selectedAudioSource.value!);
  newOrder.value = newOrder.value.concat(selectedAudioSource.value!.id);
  isAddDialogOpen.value = false;
};

const removeTrackFromPlaylist = (audioSource: AudioSource) => {
  audioSources.value = audioSources.value.filter(
    (source) => source.id !== audioSource.id
  );
  newOrder.value = newOrder.value.filter((id) => id !== audioSource.id);
};
</script>

<template>
  <div class="space-y-2">
    <VueDraggableNext
      class="space-y-2"
      ghost-class="ghost"
      :list="audioSources"
      :options="{ animation: 100 }"
    >
      <TransitionGroup type="transition" name="dragdrop">
        <Card
          v-for="source in audioSources"
          :key="source.id"
          class="p-4 flex justify-between dragdrop-move items-center"
        >
          <div class="grid grid-cols-3 w-full gap-8">
            <div class="">
              <p class="font-medium">{{ source.name }}</p>
              <p class="text-muted-foreground -mt-1">{{ source.author }}</p>
            </div>
            <div>
              <p class="font-medium">Duration</p>
              <p class="text-muted-foreground -mt-1">{{ source.length }}s</p>
            </div>
            <div class="w-full">
              <Badge variant="outline" v-for="tag in source.tags">{{
                tag
              }}</Badge>
            </div>
          </div>

          <div class="flex items-center cursor-grab gap-2">
            <Button variant="ghost" @click="removeTrackFromPlaylist(source)">
              <UnplugIcon class="size-4" />
            </Button>
            <GripHorizontalIcon class="size-4" />
          </div>
        </Card>
      </TransitionGroup>
    </VueDraggableNext>
    <div class="flex justify-center">
      <Dialog v-model:open="isAddDialogOpen">
        <DialogTrigger class="w-full">
          <Button variant="outline" class="border-dashed w-full">
            <PlusIcon class="size-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              <p>Add a track to this playlist</p>
            </DialogTitle>
            <DialogDescription>
              Please select a track to add to this playlist
            </DialogDescription>
          </DialogHeader>
          <div>
            <h1 class="mb-2 text-md font-semibold">Select audiosource</h1>
            <Popover v-model:open="isSelectOpen">
              <PopoverTrigger as-child>
                <Button
                  variant="outline"
                  role="combobox"
                  class="w-[200px] justify-between"
                >
                  <p class="truncate">
                    {{
                      selectedAudioSource
                        ? availableAudioSources.find(
                            (audioSource) => audioSource === selectedAudioSource
                          )?.name
                        : "Select audiosource..."
                    }}
                  </p>

                  <ChevronsUpDownIcon
                    class="ml-2 h-4 w-4 shrink-0 opacity-50"
                  />
                </Button>
              </PopoverTrigger>
              <PopoverContent class="w-[200px] p-0">
                <Command>
                  <CommandInput
                    class="h-9"
                    placeholder="Select audiosource..."
                  />
                  <CommandEmpty>No framework found.</CommandEmpty>
                  <CommandList>
                    <CommandGroup>
                      <CommandItem
                        v-for="audioSource in availableAudioSources"
                        :key="audioSource.id"
                        :value="audioSource.name"
                        @select="
                          (ev) => {
                            // if (typeof ev.detail.value === 'string') {
                            selectedAudioSource = audioSource;
                            // }
                            isSelectOpen = false;
                          }
                        "
                      >
                        {{ audioSource.name }}
                        <CheckIcon
                          :class="
                            cn(
                              'ml-auto h-4 w-4',
                              selectedAudioSource === audioSource
                                ? 'opacity-100'
                                : 'opacity-0'
                            )
                          "
                        />
                      </CommandItem>
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          <Button @click="addTrackToPlaylist">Add</Button>
        </DialogContent>
      </Dialog>
    </div>
    <div v-if="hasChanged" class="gap-2 flex">
      <Button @click="saveOrder">Save order</Button>
      <Button @click="revertOrder" variant="outline">Revert order</Button>
    </div>
  </div>
</template>
