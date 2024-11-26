<script lang="ts" setup>
import DashboardProvider from "@/components/custom/DashboardProvider.vue";
import DynaTable from "@/components/custom/dynatable/DynaTable.vue";
import { dbbackupColumns } from "@/components/custom/dynatable/scenarioSpecific/databasebackups/dbbackupColumns";
import Button from "@/components/ui/button/Button.vue";
import Card from "@/components/ui/card/Card.vue";
import CardContent from "@/components/ui/card/CardContent.vue";
import CardDescription from "@/components/ui/card/CardDescription.vue";
import CardHeader from "@/components/ui/card/CardHeader.vue";
import CardTitle from "@/components/ui/card/CardTitle.vue";
import Skeleton from "@/components/ui/skeleton/Skeleton.vue";
import { useToast } from "@/components/ui/toast";
import {
  createBackup,
  getAvailableBackups,
  getDatabaseStats,
} from "@/lib/backend/database";
import {
  BluetoothConnectedIcon,
  CableIcon,
  ClockArrowUpIcon,
  DatabaseBackupIcon,
  DatabaseIcon,
  FilesIcon,
  MemoryStickIcon,
} from "lucide-vue-next";
import { ref } from "vue";

const isLoading = ref<boolean>(false);
const databaseStats = ref<any | null>(null);
const availableBackups = ref<any | null>([]);
const { toast } = useToast();

(async () => {
  isLoading.value = true;
  const axiosResponse = await getDatabaseStats();
  if (axiosResponse.status === 200) {
    databaseStats.value = axiosResponse.data.data;
  } else {
    toast({
      title: "Not working right?",
      description: "Failed to get database stats",
      variant: "destructive",
    });
  }

  const backupsResponse = await getAvailableBackups();
  if (backupsResponse.status === 200) {
    availableBackups.value = backupsResponse.data.data;
  } else {
    toast({
      title: "Not working right?",
      description: "Failed to get available backups",
      variant: "destructive",
    });
  }
  isLoading.value = false;
  // console.log(databaseStats.value);
  console.log(availableBackups.value);
})();

const creatingBackup = ref<boolean>(false);

const startBackup = async () => {
  creatingBackup.value = true;
  const response = await createBackup();
  if (response.status === 200) {
    toast({
      title: "Backup created",
      description: "Backup has been created successfully",
    });
  } else {
    toast({
      title: "Not working right?",
      description: "Failed to create backup",
      variant: "destructive",
    });
  }
  creatingBackup.value = false;
};

const secondsToFormattedTime = (seconds: number) => {
  const days = Math.floor(seconds / (3600 * 24));
  const hours = Math.floor((seconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secondsLeft = Math.floor(seconds % 60);

  // keep out the 0 values
  if (days === 0) {
    return `${hours}h ${minutes}m ${secondsLeft}s`;
  }
  if (hours === 0) {
    return `${minutes}m ${secondsLeft}s`;
  }
  if (minutes === 0) {
    return `${secondsLeft}s`;
  }

  return `${days}d ${hours}h ${minutes}m ${secondsLeft}s`;
};
</script>
<template>
  <DashboardProvider>
    <div class="grid lg:grid-cols-2 xl:grid-cols-4 gap-4 mb-4">
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center space-x-2"
            ><DatabaseIcon class="size-6" /> <span>Size</span>
          </CardTitle>
          <CardDescription>
            <Skeleton v-if="isLoading" class="h-4 w-[200px] mb-2" />
            <Skeleton v-if="isLoading" class="h-4 w-[150px]" />

            <div v-else>
              <p>{{ databaseStats?.size }} MB</p>
              <p>{{ databaseStats?.tables.length }} tables found</p>
            </div>

            <!-- {{ databaseStats?.size }} MB -->
          </CardDescription>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center space-x-2">
            <ClockArrowUpIcon class="size-6" />
            <span>Uptime</span>
          </CardTitle>
          <CardDescription>
            <Skeleton v-if="isLoading" class="h-4 w-[200px]" />
            <span v-else>{{
              secondsToFormattedTime(databaseStats?.uptime)
            }}</span>
            <!-- {{ secondsToFormattedTime(databaseStats?.uptime) }} -->
          </CardDescription>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center space-x-2">
            <CableIcon class="size-6" />
            <span class="">Connections</span>
          </CardTitle>
          <CardDescription>
            <Skeleton v-if="isLoading" class="h-4 w-[200px]" />
            <span v-else>
              {{ databaseStats?.connectedThreads }} client{{
                databaseStats?.connectedThreads > 1 ? "s" : ""
              }}
            </span>
            <!-- {{ databaseStats?.connectedThreads }} client{{
              databaseStats?.connectedThreads > 1 ? "s" : ""
            }} -->
          </CardDescription>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center space-x-2">
            <MemoryStickIcon class="size-6" />
            <span class="">Memory usage</span>
          </CardTitle>
          <CardDescription>
            <div>
              <Skeleton v-if="isLoading" class="h-4 w-[200px]" />
              <div>
                {{ databaseStats?.memory.usedMemory }} MB /
                {{ databaseStats?.memory.totalMemory }} MB
              </div>
              <!-- <div>
                {{ databaseStats?.memory.usedMemory }} MB /
                {{ databaseStats?.memory.totalMemory }} MB
              </div> -->

              <i>I only use what I need 😎</i>
            </div>
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
    <Card>
      <CardHeader>
        <CardTitle>Available backups</CardTitle>
        <CardDescription> All the backups from our database </CardDescription>
      </CardHeader>
      <CardContent>
        <div class="flex justify-end">
          <Button :disabled="creatingBackup" @click="startBackup">
            <DatabaseBackupIcon class="size-4 mr-2" />
            <span>Create backup</span>
          </Button>
        </div>
        <DynaTable :data="availableBackups" :columns="dbbackupColumns" />
      </CardContent>
    </Card>
  </DashboardProvider>
</template>
