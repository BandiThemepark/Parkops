<template>
  <Sheet>
    <SheetTrigger>
      <Button>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-6 mr-2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        Create new
      </Button>
    </SheetTrigger>
    <SheetContent>
      <SheetHeader>
        <SheetTitle>Create cosmetic</SheetTitle>
        <SheetDescription>Enter all of the details below. You can find more information about creating cosmetics <a class="underline text-cyan-400 visited:text-cyan-400" href="https://docs.bandithemepark.net">here.</a></SheetDescription>
      </SheetHeader>

      <div class="py-4 gap-2 grid">
        <div>
          <Label for="email" class="text-sm font-medium">Name</Label>
          <Input id="email" type="email" placeholder="bag_of_bricks" />
        </div>

        <div>
          <Label for="email" class="text-sm font-medium">Display Name</Label>
          <Input id="email" type="email" placeholder="Bag of Bricks" />
        </div>

        <div>
          <Label for="email" class="text-sm font-medium">Description</Label>
          <Input id="email" type="email" placeholder="Line 1&&and line 2" />
        </div>

        <NumberField :default-value="25" :min="0">
          <Label for="email" class="text-sm font-medium">Price</Label>
          <NumberFieldContent>
            <NumberFieldDecrement />
            <NumberFieldInput />
            <NumberFieldIncrement />
          </NumberFieldContent>
        </NumberField>
      </div>

      <SheetFooter>
        <SheetClose as-child>
          <Button>Save changes</Button>
        </SheetClose>
      </SheetFooter>
    </SheetContent>
  </Sheet>
</template>

<script setup lang="ts">
import {Button} from "@/components/ui/button";
import {
  Sheet, SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import {Label} from "radix-vue";
import {Input} from "@/components/ui/input";
import {
  NumberField,
  NumberFieldContent,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput
} from "@/components/ui/number-field";
</script>