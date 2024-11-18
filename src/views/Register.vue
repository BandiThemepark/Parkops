<script lang="ts" setup>
import Card from "@/components/ui/card/Card.vue";
import CardContent from "@/components/ui/card/CardContent.vue";
import CardDescription from "@/components/ui/card/CardDescription.vue";
import CardHeader from "@/components/ui/card/CardHeader.vue";
import CardTitle from "@/components/ui/card/CardTitle.vue";
import useVuelidate from "@vuelidate/core";
import { email, required, sameAs } from "@vuelidate/validators";
import { reactive, ref } from "vue";
import Input from "@/components/ui/input/Input.vue";
import Button from "@/components/ui/button/Button.vue";
import { Form } from "vee-validate";
import { FormField } from "@/components/ui/form";
import FormLabel from "@/components/ui/form/FormLabel.vue";
import FormControl from "@/components/ui/form/FormControl.vue";
import FormItem from "@/components/ui/form/FormItem.vue";
import { createUser } from "@/lib/backend/users";
import { useRoute } from "vue-router";
import { useToast } from "@/components/ui/toast";
import router from "@/middleware/router";
const route = useRoute();
const { toast } = useToast();
const registrationValues = reactive({
  name: "",
  email: "",
  password: "",
});

const registrationRules = {
  name: {
    required,
  },
  email: {
    required,
    email,
  },
  password: {
    required,
  },
};

const v$ = useVuelidate(registrationRules, registrationValues);

const register = async () => {
  v$.value.$validate();
  if (v$.value.$error) {
    return;
  }
  const token = (route.query.token as string) || "";
  const data = await createUser(token, registrationValues);
  if (data.status === 200) {
    toast({
      title: "Welcom to Bandi",
      description: "Your account has been created successfully",
    });
    router.push({ path: "/" });
  } else {
    toast({
      title: "Error",
      description: "An error occurred while creating your account",
      variant: "destructive",
    });
  }
};
</script>
<template>
  <div class="h-screen w-screen flex items-center justify-center">
    <Card class="w-[450px]">
      <CardHeader>
        <CardTitle> Register </CardTitle>
        <CardDescription>
          Your first steps to become one of us!
        </CardDescription>
        <CardContent>
          <div class="grid gap-2 mt-8 w-full">
            <div class="w-full">
              <Form class="space-y-6" @submit="register">
                <FormField name="name">
                  <FormItem>
                    <FormLabel for="name">Name</FormLabel>
                    <FormControl>
                      <Input
                        id="name"
                        v-model="registrationValues.name"
                        type="text"
                        placeholder="John Doe"
                        class="w-full"
                      />
                    </FormControl>
                    <span
                      class="text-xs text-red-500 font-medium"
                      v-if="v$.name.$error"
                      >{{
                        v$.name.$error ? v$.name.$errors[0].$message : ""
                      }}</span
                    >
                  </FormItem>
                </FormField>
                <FormField name="email">
                  <FormItem>
                    <FormLabel for="email">Email</FormLabel>
                    <FormControl>
                      <Input
                        id="email"
                        v-model="registrationValues.email"
                        type="email"
                        placeholder="jhon.doe@mail.com"
                      />
                    </FormControl>
                    <span
                      class="text-xs text-red-500 font-medium"
                      v-if="v$.email.$error"
                      >{{
                        v$.email.$error ? v$.email.$errors[0].$message : ""
                      }}</span
                    >
                  </FormItem>
                </FormField>
                <FormField name="password">
                  <FormItem>
                    <FormLabel for="password">Password</FormLabel>
                    <FormControl>
                      <Input
                        id="password"
                        v-model="registrationValues.password"
                        type="password"
                        placeholder="P@ssw0rd"
                      />
                    </FormControl>
                    <span
                      class="text-xs text-red-500 font-medium"
                      v-if="v$.password.$error"
                      >{{
                        v$.password.$error
                          ? v$.password.$errors[0].$message
                          : ""
                      }}</span
                    >
                  </FormItem>
                </FormField>
                <Button :is-loading="true">Register</Button>
              </Form>
            </div>
          </div>
        </CardContent>
      </CardHeader>
    </Card>
  </div>
</template>
