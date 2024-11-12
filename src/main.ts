import { createApp } from "vue";
import "./assets/index.css";
import App from "./App.vue";
import router from "./middleware/router";
import useAuthentication from "./middleware/authentication";

(async () => {
  const app = createApp(App);
  // Implementation of middleware
  useAuthentication.init();
  const result = await useAuthentication.restoreAuth();
  console.log("user logged in", result);
  app.use(router);

  // Mount the app
  app.mount("#app");
})();
