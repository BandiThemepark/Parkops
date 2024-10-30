import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import useAuthentication, { Roles } from "./authentication";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "login",
    component: () => import("@/views/Login.vue"),
    meta: {
      inNavigation: false,
    },
  },
  {
    path: "/home",
    name: "home",
    component: () => import("@/views/Home.vue"),
    meta: {
      requiresAuth: true,
      roles: [Roles.OWNER, Roles.CREW],
      minViewLevel: [Roles.CREW],
      inNavigation: true,
      icon: `<svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="size-5"
            >
              <path
                fill-rule="evenodd"
                d="M9.315 7.584C12.195 3.883 16.695 1.5 21.75 1.5a.75.75 0 0 1 .75.75c0 5.056-2.383 9.555-6.084 12.436A6.75 6.75 0 0 1 9.75 22.5a.75.75 0 0 1-.75-.75v-4.131A15.838 15.838 0 0 1 6.382 15H2.25a.75.75 0 0 1-.75-.75 6.75 6.75 0 0 1 7.815-6.666ZM15 6.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z"
                clip-rule="evenodd"
              />
              <path
                d="M5.26 17.242a.75.75 0 1 0-.897-1.203 5.243 5.243 0 0 0-2.05 5.022.75.75 0 0 0 .625.627 5.243 5.243 0 0 0 5.022-2.051.75.75 0 1 0-1.202-.897 3.744 3.744 0 0 1-3.008 1.51c0-1.23.592-2.323 1.51-3.008Z"
              />
            </svg>`,
      navigationName: "Home",
    },
  },
  {
    path: "/players",
    name: "players",
    component: () => import("@/views/Players.vue"),
    meta: {
      requiresAuth: true,
      roles: [Roles.OWNER, Roles.CREW],
      minViewLevel: [Roles.CREW],
      inNavigation: true,
      icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
</svg>
`,
      navigationName: "Players",
    },
  },
  {
    path: "/cosmetics",
    name: "cosmetics",
    component: () => import("@/views/Cosmetics.vue"),
    meta: {
      requiresAuth: true,
      roles: [Roles.OWNER, Roles.CREW],
      minViewLevel: [Roles.CREW],
      inNavigation: true,
      icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
</svg>

`,
      navigationName: "Cosmetics",
    },
  },
  {
    path: "/settings",
    name: "settings",
    component: () => import("@/views/Settings.vue"),
    meta: {
      requiresAuth: true,
      roles: [Roles.OWNER],
      minViewLevel: [Roles.OWNER],
      inNavigation: true,
      icon: ``,
      navigationName: "Settings",
    },
  },
  {
    path: "/achievements",
    name: "achievements",
    component: () => import("@/views/Achievements.vue"),
    meta: {
      requiresAuth: true,
      roles: [Roles.OWNER, Roles.CREW],
      minViewLevel: [Roles.CREW],
      inNavigation: true,
      icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
</svg>

`,
      navigationName: "Achievements",
    },
  },
];

const getRoutesForRole = (allowedRoles: Roles[]) => {
  // using the minViewLevel to filter out the routes that are not allowed
  return routes.filter((route) => {
    if (route.meta?.minViewLevel) {
      return (route.meta.minViewLevel as Roles[]).some(
        (role) => allowedRoles.includes(role) && route.meta?.inNavigation
      );
    }
  });
};

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
  } else if (to.path === "/") {
    let currentUser = useAuthentication.getUser();
    if (currentUser) {
      next({ path: "/home" });
    } else {
      next();
    }
  }
});
export { routes, getRoutesForRole };
export default router;
