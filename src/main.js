import { createApp } from "vue";
import App from "./App.vue";

//El @ representa al directorio source
import "@/assets/css/tailwind.css";

import router from "@/router.js";

createApp(App)
  .use(router)
  .mount("#app");
