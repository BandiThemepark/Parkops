<script lang="ts" setup>
import FormControl from "@/components/ui/form/FormControl.vue";
import FormItem from "@/components/ui/form/FormItem.vue";
import FormLabel from "@/components/ui/form/FormLabel.vue";
import Input from "@/components/ui/input/Input.vue";
import { required } from "@vuelidate/validators";
import { Form, useForm } from "vee-validate";
import { PropType } from "vue";
import * as z from "zod";
import { toTypedSchema } from "@vee-validate/zod";
import { FormField } from "@/components/ui/form";
import FormDescription from "@/components/ui/form/FormDescription.vue";
import FormMessage from "@/components/ui/form/FormMessage.vue";
import Button from "@/components/ui/button/Button.vue";
import Select from "@/components/ui/select/Select.vue";
import SelectTrigger from "@/components/ui/select/SelectTrigger.vue";
import SelectValue from "@/components/ui/select/SelectValue.vue";
import SelectContent from "@/components/ui/select/SelectContent.vue";
import SelectGroup from "@/components/ui/select/SelectGroup.vue";
import SelectItem from "@/components/ui/select/SelectItem.vue";
import SelectLabel from "@/components/ui/select/SelectLabel.vue";

type InputType =
  | "color"
  | "email"
  | "file"
  | "number"
  | "password"
  | "text"
  | "select";

type DynaInputBase = {
  type: Exclude<InputType, "select">;
  name: string;
  label: string;
  placeholder: string;
  required: boolean;
  zodValidation?: any;
  description?: string;
  onChange?: (e: any) => void;
};

type DynaTableSelectInput = {
  type: "select";
  name: string;
  label: string;
  placeholder: string;
  required: boolean;
  zodValidation?: any;
  description?: string;
  options: {
    groupName: string;
    items: { label: string; value: string }[];
  }[];
};

const emit = defineEmits(["submit"]);

const props = defineProps({
  submitText: {
    type: String,
    default: "Submit",
  },
  inputs: {
    type: Array as PropType<Array<DynaInputBase | DynaTableSelectInput>>,
    required: true,
  },
});

// const formSchema = toTypedSchema(
//   z.object({
//     [props.inputs.map((input) => input.name).join()]: z.object({
//       [props.inputs.map((input) => input.name).join()]: z.string(),
//     }),
//   })
// );

// a zod formschema where the key is the name of the input and the value is the zodValidation if it exists
const formSchema = toTypedSchema(
  z.object(
    props.inputs.reduce((acc, input) => {
      acc[input.name] = input.zodValidation || z.string();
      return acc;
    }, {} as Record<string, any>)
  )
);

const form = useForm({
  validationSchema: formSchema,
});

const onSubmit = form.handleSubmit((values) => {
  console.log(values);
  emit("submit", values);
});
</script>

<template>
  <form @submit="onSubmit" class="space-y-6">
    <FormField
      v-for="input in inputs"
      :key="input.name"
      :name="input.name"
      v-slot="{ componentField }"
    >
      <FormItem>
        <FormLabel :for="input.name">{{ input.label }}</FormLabel>
        <Select v-if="input.type == 'select'" v-bind="componentField">
          <FormControl>
            <SelectTrigger>
              <SelectValue :placeholder="input.placeholder" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup v-for="(group, index) in input.options" :key="index">
                <SelectLabel>{{ group.groupName }}</SelectLabel>
                <SelectItem
                  v-for="(option, index) in group.items"
                  :key="index"
                  :value="option.value"
                >
                  {{ option.label }}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
            <FormDescription v-if="input.description">{{
              input.description
            }}</FormDescription>
            <FormMessage />
          </FormControl>
        </Select>
        <FormControl v-else>
          <Input
            v-bind="componentField"
            :id="input.name"
            :type="input.type"
            :placeholder="input.placeholder"
            :required="input.required"
            @update:modelValue="input.onChange"
          />
          <FormDescription v-if="input.description">{{
            input.description
          }}</FormDescription>
          <FormMessage />
        </FormControl>
      </FormItem>
    </FormField>
    <Button type="submit">{{ submitText }}</Button>
  </form>
</template>
