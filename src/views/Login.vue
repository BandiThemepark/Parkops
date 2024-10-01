<script lang="ts" setup>
import Button from "@/components/ui/button/Button.vue";
import Input from "@/components/ui/input/Input.vue";
import useAuthentication from "../middleware/authentication";
import { ref } from "vue";
import { email, required } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import { FirebaseError } from "firebase/app";
import router from "../middleware/router";

const inputValues = ref({
  email: "",
  password: "",
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

const v$ = useVuelidate(inputRules, inputValues);

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
              >{{ v$.email.$error ? v$.email.$errors[0].$message : "" }}</span
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
        <div class="flex items-center text-stone-300 space-x-4 mb-4">
          <div class="w-full h-px bg-stone-300"></div>
          <p>or</p>
          <div class="w-full h-px bg-stone-300"></div>
        </div>
        <div class="text-center w-full">
          <a
            class="underline underline-offset-2 text-stone-500"
            href="https://forms.gle/YPSPM95vLwF5BZB58"
            target="_blank"
            >Become a crewmember!</a
          >
        </div>
      </div>
    </div>
  </main>
</template>
