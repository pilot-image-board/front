import { apiService } from "./api.service";
import { User } from "@/models";

export const authService = {
  signUp: (data: User) => {
    return apiService.post("/auth/signup", data);
  },
  signIn: (data: User) => {
    return apiService.post("/auth/signin", data);
  },
};
