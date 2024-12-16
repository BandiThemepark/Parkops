<script lang="ts" setup>
import DashboardProvider from "@/components/custom/DashboardProvider.vue";
import Spinner from "@/components/custom/Spinner.vue";
import Breadcrumb from "@/components/ui/breadcrumb/Breadcrumb.vue";
import BreadcrumbItem from "@/components/ui/breadcrumb/BreadcrumbItem.vue";
import BreadcrumbLink from "@/components/ui/breadcrumb/BreadcrumbLink.vue";
import BreadcrumbList from "@/components/ui/breadcrumb/BreadcrumbList.vue";
import BreadcrumbSeparator from "@/components/ui/breadcrumb/BreadcrumbSeparator.vue";
import Button from "@/components/ui/button/Button.vue";
import Card from "@/components/ui/card/Card.vue";
import CardContent from "@/components/ui/card/CardContent.vue";
import CardDescription from "@/components/ui/card/CardDescription.vue";
import CardHeader from "@/components/ui/card/CardHeader.vue";
import CardTitle from "@/components/ui/card/CardTitle.vue";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import Input from "@/components/ui/input/Input.vue";
import { useToast } from "@/components/ui/toast";
import {
  deleteFile,
  downloadFile,
  getFilesAtPath,
  uploadFile,
} from "@/lib/backend/files";
import {
  ClipboardCopyIcon,
  DownloadIcon,
  ExternalLinkIcon,
  FileIcon,
  FolderIcon,
  FolderOpenIcon,
  HomeIcon,
  Loader2Icon,
  Trash2Icon,
  UploadIcon,
} from "lucide-vue-next";
import { computed, ref, watch } from "vue";

type splittedPath = {
  path: string;
  shortPath: string;
};
const minimumPath = ref<string>("/home/ubuntu/bandithemepark/data");
const currentPath = ref<string>(minimumPath.value);
const isFilesLoading = ref(false);
const splittedPath = computed(() => {
  // remove minimumPath from currentPath
  const path = currentPath.value.replace(minimumPath.value, "");
  const splittedPath: splittedPath[] = [];
  const pathArray = path.split("/");
  pathArray.forEach((path, index) => {
    if (path === "") {
      return;
    }
    const shortPath = pathArray.slice(0, index + 1).join("/");
    splittedPath.push({
      path: shortPath,
      shortPath: path,
    });
  });
  return splittedPath;
});

type File = {
  name: string;
  path: string;
  isDirectory: boolean;
};

const files = ref<File[]>([]);

const refreshPath = async () => {
  isFilesLoading.value = true;
  const data = await getFilesAtPath(currentPath.value);
  console.log(data);
  if (data.status === 200) {
    const alteredList: File[] = data.data.data.map((file: any): File => {
      return {
        name: file.name,
        isDirectory: file.type === 1,
        path: currentPath.value + "/" + file.name,
      } as File;
    });
    files.value = alteredList.sort((a, b) => {
      if (a.isDirectory && !b.isDirectory) {
        return -1;
      }
      if (!a.isDirectory && b.isDirectory) {
        return 1;
      }
      return a.name.localeCompare(b.name);
    });
    isFilesLoading.value = false;
  }
};

const onClickFile = async (file: File) => {
  if (file.isDirectory) {
    currentPath.value = file.path;
    await refreshPath();
  }
};

const goBack = async () => {
  if (!canGoBack.value) {
    return;
  }
  const pathArray = currentPath.value.split("/");
  pathArray.pop();
  currentPath.value = pathArray.join("/");
  await refreshPath();
};

const canGoBack = computed(() => {
  return currentPath.value !== minimumPath.value;
});

const gotoPath = async (path: string) => {
  currentPath.value = path;
  await refreshPath();
};

(async () => {
  await refreshPath();
})();

const { toast } = useToast();
const fileUploadInput = ref();
const fileToUpload = ref();
const isUploading = ref(false);
const onFileChange = async (event: Event) => {
  isUploading.value = true;
  const input = event.target as HTMLInputElement;
  if (!input.files || input.files.length === 0) {
    return;
  }

  const file = input.files[0];
  const fileName = file.name;
  // convert to base64 and save it in
  const reader = new FileReader();
  toast({
    title: "Uploading file...",
    description: "Please wait while we upload the file",
  });
  const base64 = await new Promise<string>((resolve) => {
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.readAsDataURL(file);
  });

  const data = await uploadFile(currentPath.value, fileName, base64);
  console.log(data);
  if (data.status === 200) {
    await refreshPath();
    toast({
      title: "File uploaded",
      description: "The file has been uploaded successfully",
    });
    isUploading.value = false;
  } else {
    toast({
      title: "Error uploading file",
      description: "There was an error uploading the file",
      variant: "destructive",
    });
    isUploading.value = false;
  }
};

const removePath = async (path: string) => {
  const data = await deleteFile(path);
  if (data.status === 200) {
    await refreshPath();
    toast({
      title: "File deleted",
      description: "The file has been deleted successfully",
    });
  } else {
    toast({
      title: "Error deleting file",
      description: "There was an error deleting the file",
      variant: "destructive",
    });
  }
};

const download = async (fileName: string) => {
  // download file
  const data = await downloadFile(currentPath.value, fileName);
  const base64 = data.data.data;
  // support every file type base64 is not a stream and can be used for any file type
  // what is octet-stream?

  const linkSource = `data:application/octet-stream;base64,${base64}`;
  const downloadLink = document.createElement("a");
  const f = fileName;

  document.body.appendChild(downloadLink);
  downloadLink.href = linkSource;
  downloadLink.download = f;
  downloadLink.click();

  document.body.removeChild(downloadLink);
  window.URL.revokeObjectURL(linkSource);

  toast({
    title: "File downloaded",
    description: "The file has been downloaded successfully",
  });
};

const createLink = (path: string) => {
  if (path.includes("cdn")) {
    const stripped = path.replace("/home/ubuntu/bandithemepark/data/cdn/", "");
    return `https://cdn.bandithemepark.net/public/${stripped}`;
  } else if (path.includes("resourcepack")) {
    const stripped = path.replace(
      "/home/ubuntu/bandithemepark/data/resourcepack/",
      ""
    );
    return `http://resourcepack.bandithemepark.net/public/${stripped}`;
  }
};

const openLink = (link: string) => {
  console.log(link);
  window.open(createLink(link), "_blank");
};

const copyLink = (path: string) => {
  navigator.clipboard.writeText(createLink(path) as string);
  toast({
    title: "Link copied",
    description: "The link has been copied to your clipboard",
  });
};
</script>
<template>
  <DashboardProvider>
    <Breadcrumb class="mb-4">
      <BreadcrumbList>
        <BreadcrumbItem class="cursor-pointer">
          <BreadcrumbLink as-child @click="gotoPath(minimumPath)">
            <HomeIcon class="size-4" />
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <div
          class="flex items-center space-x-2"
          v-for="(pathitem, index) in splittedPath"
          :key="pathitem.path"
        >
          <BreadcrumbItem>
            <BreadcrumbLink
              as-child
              class="hover:cursor-pointer"
              @click="gotoPath(minimumPath + pathitem.path)"
            >
              <p>
                {{ pathitem.shortPath }}
              </p>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator v-if="index < splittedPath.length - 1" />
        </div>
      </BreadcrumbList>
    </Breadcrumb>
    <div class="relative h-32 mb-4">
      <div
        class="absolute top-0 left-0 w-full h-full flex items-center justify-center"
      >
        <div v-if="!isUploading">
          <UploadIcon
            class="text-muted-foreground m-auto size-4 mb-2 animate-bounce"
          />
          <p class="text-muted-foreground text-sm">
            Psst. Use drag and drop. It's way easier
          </p>
        </div>
        <div v-else>
          <Loader2Icon class="animate-spin" />
        </div>
      </div>
      <Input
        :disabled="isUploading || isFilesLoading"
        @change="onFileChange"
        v-model="fileToUpload"
        ref="fileUploadInput"
        type="file"
        class="border-dashed h-full absolute top-0 bg-transparent"
      />
    </div>

    <Card>
      <CardHeader>
        <CardTitle> Server files </CardTitle>
        <CardDescription>
          <p>Please use with caution</p>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div v-if="isFilesLoading" class="flex justify-center">
          <Loader2Icon class="animate-spin" />
        </div>
        <div v-else>
          <Button
            v-if="canGoBack"
            variant="ghost"
            @click="goBack"
            class="w-full text-left justify-start"
          >
            <FolderIcon class="size-4 fill-primary" />

            <p>..</p>
          </Button>
          <div v-for="file in files" :key="file.path">
            <ContextMenu>
              <ContextMenuTrigger class="w-full flex items-center space-x-2">
                <Button
                  variant="ghost"
                  @click="onClickFile(file)"
                  class="w-full text-left justify-start"
                >
                  <FolderIcon
                    class="size-4 fill-primary"
                    v-if="file.isDirectory"
                  />
                  <FileIcon class="size-4 fill-secondary" v-else />
                  <p>{{ file.name }}</p>
                </Button>
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuItem
                  v-if="file.isDirectory"
                  class="flex space-x-2"
                  @click="gotoPath(file.path)"
                >
                  <FolderOpenIcon class="size-4" />
                  <p>Open</p>
                </ContextMenuItem>
                <ContextMenuItem
                  v-if="!file.isDirectory"
                  class="flex space-x-2"
                  @click="openLink(file.path)"
                >
                  <ExternalLinkIcon class="size-4" />
                  <p>Open</p>
                </ContextMenuItem>
                <ContextMenuItem
                  v-if="!file.isDirectory"
                  class="flex space-x-2"
                  @click="copyLink(file.path)"
                >
                  <ClipboardCopyIcon class="size-4" />
                  <p>Copy link</p>
                </ContextMenuItem>
                <!-- <ContextMenuItem
                  v-if="!file.isDirectory"
                  class="flex space-x-2"
                  @click="download(file.name)"
                >
                  <DownloadIcon class="size-4" />
                  <p>Download</p>
                </ContextMenuItem> -->
                <ContextMenuSeparator />
                <ContextMenuItem
                  class="flex space-x-2 hover:!bg-destructive hover:!text-destructive-foreground"
                  @click="removePath(file.path)"
                >
                  <Trash2Icon class="size-4" />
                  <p>Delete</p>
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  </DashboardProvider>
</template>
