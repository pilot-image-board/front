import { apiService } from "./api.service";

export const userService = {
  profile: () => {
    return apiService.post("/user/self");
  },
};
