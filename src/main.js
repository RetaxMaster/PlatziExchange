import { createApp } from "vue";
import App from "./App.vue";

import Chartkick from "vue-chartkick";
import Chart from 'chart.js'
import { VueSpinners } from "@saeris/vue-spinners";

//El @ representa al directorio source
import "@/assets/css/tailwind.css";

import router from "@/router.js";

createApp(App)
  .use(router)
  .use(Chartkick.use(Chart))
  .use(VueSpinners)
  .mount("#app");
