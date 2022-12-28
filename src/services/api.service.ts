import axios from "axios";
export const API_BASE_URL = "http://localhost:3000";

export let apiService = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer " + localStorage.getItem("access_token"),
  },
});

export const refreshApiService = () => {
  apiService = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("access_token"),
    },
  });
};
