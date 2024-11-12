<script lang="ts" setup>
import Button from "@/components/ui/button/Button.vue";
import Input from "@/components/ui/input/Input.vue";
import useAuthentication from "../middleware/authentication";
import { ref } from "vue";
import { email, required } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import { FirebaseError } from "firebase/app";
import router from "../middleware/router";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Separator from "@/components/ui/separator/Separator.vue";
import { verifyRegistration } from "@/lib/backend/users";
import { useToast } from "@/components/ui/toast";
const toaster = useToast();
const inputValues = ref({
  email: "",
  password: "",
});

const registrationValues = ref({
  token: "",
});

const inputRules = {
  email: {
    required,
    email,
  },
  password: {
    required,
  },
};

const registrationRules = {
  token: {
    required,
  },
};

const v$ = useVuelidate(inputRules, inputValues);
const vReg$ = useVuelidate(registrationRules, registrationValues);

const login = async () => {
  v$.value.$validate();
  if (v$.value.$error) {
    return;
  }
  const result = await useAuthentication.loginUsernamePassword(
    inputValues.value.email,
    inputValues.value.password
  );

  // check type of result is a UserCredentil or a FirebaseError
  if (result instanceof FirebaseError) {
    console.error(result);
    return;
  } else {
    router.push({ path: "/home" });
  }
};

const checkRegistration = async () => {
  vReg$.value.$validate();
  if (vReg$.value.$error) {
    return;
  }
  await verifyRegistration(registrationValues.value.token)
    .then((result) => {
      console.log(result);
      if ((result as any).message == "success") {
        // router.push({ path: "/home" });
        toaster.toast({
          title: "Token verified",
          description: "You can now register",
        });
      } else {
      }
    })
    .catch((error) => {
      toaster.toast({
        title: "Registration failed",
        description: "The registration token is invalid",
        variant: "destructive",
      });
    });

  // // check type of result is a UserCredentil or a FirebaseError
  // if (result instanceof FirebaseError) {
  //   console.error(result);
  //   return;
  // } else {
  //   router.push({ path: "/home" });
  // }
};
</script>

<template>
  <main class="w-full h-screen flex">
    <aside
      class="w-full h-full hidden lg:flex bg-stone-900 p-8 text-white flex-col justify-between"
    >
      <h1 class="text-2xl font-bold mb-2">ParkOps</h1>
      <div>
        <q class="text-4xl opacity-70">
          Innovation is the thrill of our rollercoaster, always pushing
          boundaries with new twists and turns. At
          <span class="font-semibold">BandiThemepark</span>, every ride is a
          fresh adventure in creativity.
        </q>
      </div>
    </aside>
    <div
      class="w-full h-full flex justify-center items-center bg-white p-4 sm:p-6"
    >
      <div class="w-full sm:w-[350px]">
        <Tabs default-value="account" class="w-full">
          <TabsList class="w-full mb-16">
            <TabsTrigger class="w-full" value="account"> Login </TabsTrigger>
            <TabsTrigger class="w-full" value="register">
              Register
            </TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            <div class="text-center mb-6">
              <h2 class="font-bold text-2xl">Login to your account</h2>
              <p class="text-sm text-stone-500">
                Just to make sure you are not an imposter
              </p>
            </div>
            <div class="grid gap-2 mb-4">
              <form action="javascript:void(0)"></form>
              <div>
                <Input
                  v-model="inputValues.email"
                  type="email"
                  placeholder="john.doe@gmail.com"
                />
                <span
                  class="text-xs text-red-500 font-medium"
                  v-if="v$.email.$error"
                  >{{
                    v$.email.$error ? v$.email.$errors[0].$message : ""
                  }}</span
                >
              </div>
              <div>
                <Input
                  v-model="inputValues.password"
                  type="password"
                  placeholder="P@ssw0rd"
                />
                <span
                  class="text-xs text-red-500 font-medium"
                  v-if="v$.password.$error"
                  >{{
                    v$.password.$error ? v$.password.$errors[0].$message : ""
                  }}</span
                >
              </div>

              <Button @click="login">Log in</Button>
            </div>
            <Separator label="or" class="my-8" />
            <div class="text-center w-full">
              <a
                class="underline underline-offset-2 text-stone-500"
                href="https://forms.gle/YPSPM95vLwF5BZB58"
                target="_blank"
                >Become a crewmember!</a
              >
            </div>
          </TabsContent>
          <TabsContent value="register">
            <div class="text-center mb-6">
              <h2 class="font-bold text-2xl">Let's check if real</h2>
              <p class="text-sm text-stone-500">
                Just give us the registration token to get started
              </p>
            </div>
            <div class="grid gap-2 mb-4">
              <form action="javascript:void(0)"></form>
              <div>
                <Input
                  v-model="registrationValues.token"
                  type="text"
                  placeholder="as7d68a7d687asd65a78sd56a8asyda"
                />
                <span
                  class="text-xs text-red-500 font-medium"
                  v-if="vReg$.token.$error"
                  >{{
                    vReg$.token.$error ? vReg$.token.$errors[0].$message : ""
                  }}</span
                >
              </div>

              <Button @click="checkRegistration">Verify token</Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  </main>
</template>
