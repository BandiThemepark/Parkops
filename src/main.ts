import { createApp } from "vue";
import "./assets/index.css";
import App from "./App.vue";
import router from "./middleware/router";

const app = createApp(App);

// Implementation of middleware
app.use(router);

// Mount the app
app.mount("#app");
