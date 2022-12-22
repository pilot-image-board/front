import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import HomeView from "../views/HomeView.vue";
import SignUpView from "../views/auth/SignUpView.vue";
import SignInView from "../views/auth/SignInView.vue";
import { useUserStore } from "@/stores";

const DEFAULT_TITLE = "Pilot";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/signup",
    name: "signup",
    component: SignUpView,
    meta: {
      title: "Sign Up",
    },
  },
  {
    path: "/signin",
    name: "signin",
    component: SignInView,
    meta: {
      title: "Sign In",
    },
  },
  {
    path: "/:boardId",
    name: "board",
    component: () => import("../views/board/BoardView.vue"),
    meta: {
      title: "Board",
    },
  },
  {
    path: "/:boardId/threads/:threadId",
    name: "thread",
    component: () => import("../views/thread/ThreadView.vue"),
    meta: {
      title: "Thread",
    },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: () => import("../views/common/NotFoundView.vue"),
    meta: {
      title: "Not Found",
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  userStore.initUser();
  if (
    (to.name === "signin" || to.name === "signup") &&
    userStore.isConnected()
  ) {
    next({ name: "home" });
  }
  document.title = to.meta.title ? String(to.meta.title) : DEFAULT_TITLE;
  next();
});

export default router;
