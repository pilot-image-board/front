import { defineStore } from "pinia";
import { ref } from "vue";
import { User } from "@/models";
import axios from "axios";

export const useUserStore = defineStore("user", () => {
  const user = ref({} as User);

  const initUser = () => {
    const token = localStorage.getItem("access_token");
    if (token) {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace("-", "+").replace("_", "/");
      const decodedToken = JSON.parse(window.atob(base64));
      user.value = {
        id: decodedToken.sub,
        username: decodedToken.username,
        isAdmin: decodedToken.isAdmin,
      };
    }
  };

  const isAdmin = () => {
    return !!user.value.isAdmin;
  };

  const emptyUser = () => {
    user.value = {} as User;
    localStorage.removeItem("access_token");
    delete axios.defaults.headers.common["Authorization"];
  };

  initUser();

  const isConnected = () => {
    return user.value.id !== undefined;
  };

  return { user, isConnected, initUser, emptyUser, isAdmin };
});
