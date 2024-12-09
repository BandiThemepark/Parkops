<script lang="ts" setup>
import { computed, onBeforeMount, onUnmounted, ref, watch } from "vue";
import Button from "../ui/button/Button.vue";
import { PauseIcon, PlayIcon } from "lucide-vue-next";

const props = defineProps({
  link: {
    type: String,
    required: true,
  },
});
const triedFetching = ref(false);

const isPlaying = ref(false);

const audioElement = ref<HTMLAudioElement | null>(null);

const playAudio = () => {
  loadAudio();
  if (audioElement.value) {
    audioElement.value.play();
    isPlaying.value = true;
  }
};

const loadAudio = () => {
  if (!audioElement.value) {
    audioElement.value = new Audio(props.link);
  }
};

const pauseAudio = () => {
  if (audioElement.value) {
    audioElement.value.pause();
    isPlaying.value = false;
  }
};

watch(
  () => props.link,
  (newLink) => {
    if (audioElement.value) {
      audioElement.value.pause();
      audioElement.value = null;
    }
    audioElement.value = new Audio(newLink);
  }
);

onUnmounted(() => {
  if (audioElement.value) {
    audioElement.value.pause();
    audioElement.value = null;
  }
});
</script>
<template>
  <div>
    <Button variant="outline" @click="playAudio" v-if="!isPlaying">
      <PlayIcon class="size-4" />
    </Button>
    <Button variant="outline" @click="pauseAudio" v-if="isPlaying">
      <PauseIcon class="size-4" />
    </Button>
  </div>
</template>
