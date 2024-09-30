import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import useAuthentication, { Roles } from "./authentication";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "login",
    component: () => import("@/views/Login.vue"),
  },
  {
    path: "/home",
    name: "home",
    component: () => import("@/views/Home.vue"),
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, _from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    let currentUser = useAuthentication.getUser();
    if (currentUser) {
      if (to.meta.roles) {
        let result = await useAuthentication.userHasRole(
          to.meta.roles as Roles[]
        );
        if (result) {
          next();
        } else {
          next({ path: "/" });
        }
      }

      // next()
    } else {
      next({ path: "/", query: { redirect: to.fullPath } });
    }
  } else {
    next();
  }
});

export default router;
