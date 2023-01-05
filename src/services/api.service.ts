import axios from "axios";
export const API_BASE_URL =
  process.env.VUE_APP_NODE_ENV === "production"
    ? process.env.VUE_APP_API_BASE_URL
    : "http://localhost:3000/v1";
export const IMAGE_SERVER_BASE_URL =
  process.env.VUE_APP_NODE_ENV === "production"
    ? process.env.VUE_APP_IMAGE_SERVER_URL
    : "http://localhost:3030";

axios.defaults.withCredentials = true;

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export let apiService = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer " + localStorage.getItem("access_token"),
  },
});

export let imageService = axios.create({
  baseURL: IMAGE_SERVER_BASE_URL,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "multipart/form-data",
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
  imageService = axios.create({
    baseURL: IMAGE_SERVER_BASE_URL,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "multipart/form-data",
      Authorization: "Bearer " + localStorage.getItem("access_token"),
    },
  });
};
