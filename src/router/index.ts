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
    path: "/admin",
    name: "admin",
    component: () => import("../views/admin/AdminView.vue"),
    meta: {
      title: "Admin",
    },
  },
  {
    path: "/create-category",
    name: "create-category",
    component: () => import("../views/admin/CreateCategoryView.vue"),
    meta: {
      title: "Create Category",
    },
  },
  {
    path: "/category/:categoryId/edit",
    name: "edit-category",
    component: () => import("../views/admin/EditCategoryView.vue"),
    meta: {
      title: "Edit Category",
    },
  },
  {
    path: "/create-board",
    name: "create-board",
    component: () => import("../views/admin/CreateBoardView.vue"),
    meta: {
      title: "Create Category",
    },
  },
  {
    path: "/board/:boardId/edit",
    name: "edit-board",
    component: () => import("../views/admin/EditBoardView.vue"),
    meta: {
      title: "Edit Category",
    },
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
    path: "/:boardId/start-thread",
    name: "start-thread",
    component: () => import("../views/thread/StartThreadView.vue"),
    meta: {
      title: "Start Thread",
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
