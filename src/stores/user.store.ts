import { defineStore } from "pinia";
import { ref } from "vue";
import { User } from "@/models";
import axios from "axios";
import { API_BASE_URL, authService, refreshApiService } from "@/services";
import { KEYUTIL, KJUR, RSAKey } from "jsrsasign";

const publicKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAlGElwh6Dn/rsPMBXBo3u
0uOZfWCqlk7mlM+/Azd625aTe7bNsXxoKrb4GNm+D1Cg1WQdhODI/fv9avSyyZ95
ps/A/amvEY39+BSX0nV1xak9NPSOqcEdPlqG9ya/GOcf+ZmbqlrOgeQovu9CZ8S6
zirwWkYCiUFnajr+NW8joo8mjiIgNSho0A+18Ae/JTBM2tK7vif9FrqfhVl7yl0d
3Bs6MbR3tTrnOeI+vQprEplyR16yeEGBsPhSBFAsZPN7KRCVJkpnmRC+eH3jUevm
v6n5JOXk6zE1dAmJrUpIS/opWnKo1usqhRyDtt6tIyjlmSjXIHLuuLqNDdt4HUFN
LwIDAQAB
-----END PUBLIC KEY-----
`;

export const useUserStore = defineStore("user", () => {
  const user = ref({} as User);

  const initUser = async () => {
    const token = localStorage.getItem("access_token");
    if (token) {
      const key = KEYUTIL.getKey(publicKey);
      if (!(key instanceof RSAKey)) {
        console.log("Invalid public key");
        return;
      }
      const isValid = KJUR.jws.JWS.verifyJWT(token, key, {
        alg: ["RS256"],
      });
      if (!isValid) {
        try {
          if (await authService.refresh()) {
            initUser();
          } else {
            emptyUser();
            return;
          }
        } catch (error) {
          emptyUser();
          return;
        }
      }
      const payload = KJUR.jws.JWS.parse(token).payloadObj;
      user.value = payload as User;
    }
  };

  /**
   * @Deprecated use is function
   */
  const isAdmin = () => {
    return user.value.roles?.includes("admin");
  };

  const is = (role: string) => {
    return user.value.roles?.includes(role);
  };

  const emptyUser = () => {
    user.value = {} as User;
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    delete axios.defaults.headers.common["Authorization"];
  };

  initUser();

  const isConnected = () => {
    return user.value.id !== undefined && localStorage.getItem("access_token");
  };

  const refreshUser = async () => {
    if (
      !localStorage.getItem("access_token") ||
      !localStorage.getItem("refresh_token")
    ) {
      emptyUser();
      return false;
    }
    const token = localStorage.getItem("refresh_token");
    if (token) {
      try {
        const response = await axios
          .create({
            baseURL: API_BASE_URL,
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          })
          .post("/auth/refresh");
        localStorage.setItem("access_token", response.data.access_token);
        localStorage.setItem("refresh_token", response.data.refresh_token);

        refreshApiService();

        initUser();
        return true;
      } catch (error) {
        emptyUser();
        return false;
      }
    } else {
      emptyUser();
      return false;
    }
  };

  return { user, isConnected, initUser, emptyUser, isAdmin, is, refreshUser };
});
