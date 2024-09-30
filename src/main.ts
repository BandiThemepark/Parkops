import { createApp } from "vue";
import "./assets/index.css";
import App from "./App.vue";
import router from "./middleware/router";
import useAuthentication from "./middleware/authentication";
(async () => {
  const app = createApp(App);

  // Implementation of middleware
  useAuthentication.init();
  await useAuthentication.restoreAuth();
  app.use(router);

  // Mount the app
  app.mount("#app");
})();
