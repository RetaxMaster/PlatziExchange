import { createRouter, createWebHistory } from "vue-router";

import Home from "@/views/Home.vue";
import About from "@/views/About.vue";
import Error from "@/views/Error.vue";

const router = createRouter({

  history: createWebHistory(process.env.BASE_URL),

  routes: [
    {
      path: "/",
      name: "Home",
      component: Home
    },
    {
      path: "/about",
      name: "About",
      component: About
    },
    {
      path: "/:catchAll(.*)",
      name: "Error",
      component: Error
    }
  ]

});

export default router;