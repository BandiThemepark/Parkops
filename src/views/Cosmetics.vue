<script setup lang="ts">

import DashboardProvider from "@/components/custom/DashboardProvider.vue";
import {ToggleGroup, ToggleGroupItem} from "@/components/ui/toggle-group";
import {ref, watch} from "vue";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {getAllCosmetics} from "@/lib/backend/cosmetics.ts";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Skeleton} from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import CreateCosmeticSheet from "@/views/cosmetics/CreateCosmeticSheet.vue";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {Label} from "radix-vue";

const types = ref([
  {name: "hat", displayName: "Hat", tabName: "Hats"},
  {name: "handheld", displayName: "Handheld", tabName: "Handhelds"},
  {name: "balloon", displayName: "Balloon", tabName: "Balloons"},
  {name: "title", displayName: "Title", tabName: "Titles"},
  {name: "kart", displayName: "Kart", tabName: "Karts"},
  {name: "backpack", displayName: "Backpack", tabName: "Backpacks"},
  {name: "chestplate", displayName: "Chestplate", tabName: "Chestplates"},
  {name: "leggings", displayName: "Leggings", tabName: "Leggings"},
  {name: "boots", displayName: "Boots", tabName: "Boots"},
])

const cosmeticsData = ref([]);
const isLoading = ref(false);

const loadCosmetics = async () => {
  isLoading.value = true;
  const data = await Promise.all([getAllCosmetics(searchText.value, selectedType.value === "all" ? undefined : selectedType.value)]);
  cosmeticsData.value = data[0][0].data.cosmetics;
  isLoading.value = false;
}

const selectedType = ref("all")
const searchText = ref("")

watch(selectedType, () => {
  loadCosmetics()
})

watch(searchText, () => {
  loadCosmetics()
})

const cleanedDescription = (description: string) => {
  return description.replaceAll("&&", " ")
}

const getNameFromType = (type: string) => {
  return types.value.find(t => t.name === type)?.displayName
}

const openDialogType = ref("")

loadCosmetics()
</script>

<template>
  <DashboardProvider>
    <h1 class="font-bold text-3xl">Cosmetics</h1>

    <ToggleGroup v-model="selectedType" type="single" class="justify-start mt-4">
      <ToggleGroupItem value="all">
        <h2>All</h2>
      </ToggleGroupItem>
      <ToggleGroupItem v-for="type in types" :value="type.name">
        <h2>{{ type.tabName }}</h2>
      </ToggleGroupItem>
    </ToggleGroup>

    <div class="flex relative w-full max-w-md items-center gap-1.5 mt-2">
      <Input v-model="searchText" id="search" type="text" placeholder="Search..." class="pl-10"/>
      <span class="absolute start-0 inset-y-0 flex items-center justify-center px-2">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 text-muted-foreground">
          <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
      </span>
      <CreateCosmeticSheet />
    </div>

    <div class="grid grid-cols-4 w-full mt-4 gap-2">
      <Card v-for="cosmetic in cosmeticsData" v-if="!isLoading" class="relative">
        <Dialog>
          <DropdownMenu>
            <DropdownMenuTrigger class="absolute top-2 right-2">
              <Button variant="ghost" size="icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DialogTrigger>
                <DropdownMenuItem @click="openDialogType = 'give'">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4 mr-2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
                  </svg>
                  Give to
                </DropdownMenuItem>
              </DialogTrigger>
              <DropdownMenuItem>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4 mr-2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                </svg>
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator></DropdownMenuSeparator>
              <DialogTrigger>
                <DropdownMenuItem @click="openDialogType = 'delete'" class="text-red-600 focus:bg-red-500 focus:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4 mr-2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                  </svg>
                  Delete
                </DropdownMenuItem>
              </DialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>

          <DialogContent v-if="openDialogType == 'give'">
            <DialogHeader>
              <DialogTitle>Give {{getNameFromType(cosmetic.type)}} {{cosmetic.displayName}}</DialogTitle>
              <DialogDescription>Enter the name of the player you want to give this cosmetic to</DialogDescription>
            </DialogHeader>

            <div class="py-4 pt-2">
              <Label for="giveToPlayerName" class="text-sm font-medium">Player name</Label>
              <Input id="giveToPlayerName" type="text" placeholder="Gezelligheid_" />
            </div>

            <DialogFooter>
              <Button>Confirm</Button>
            </DialogFooter>
          </DialogContent>

          <DialogContent v-if="openDialogType == 'delete'">
            <DialogHeader>
              <DialogTitle>Delete {{cosmetic.displayName}}?</DialogTitle>
              <DialogDescription>Are you sure you want to delete this cosmetic?</DialogDescription>
            </DialogHeader>

            <DialogFooter>
              <Button>Delete</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <CardHeader>
          <CardTitle>{{cosmetic.displayName}}</CardTitle>
          <CardDescription>{{ cleanedDescription(cosmetic.description) }}</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="flex gap-1">
            <Badge>{{getNameFromType(cosmetic.type)}}</Badge>
            <Badge>{{cosmetic.price}} coins</Badge>
          </div>
        </CardContent>
      </Card>

      <Card v-else v-for="i in 15">
        <CardHeader>
          <Skeleton class="w-3/4 h-6" />
          <Skeleton class="w-full h-4" />
          <Skeleton class="w-1/2 h-4" />
        </CardHeader>
        <CardContent>

        </CardContent>
      </Card>
    </div>
  </DashboardProvider>
</template>