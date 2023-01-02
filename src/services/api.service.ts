import axios from "axios";
export const API_BASE_URL = "http://localhost:3000/v1";
export const IMAGE_SERVER_BASE_URL = "http://localhost:3030";

export let apiService = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export let imageService = axios.create({
  baseURL: IMAGE_SERVER_BASE_URL,
  headers: {
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
      "Content-Type": "multipart/form-data",
      Authorization: "Bearer " + localStorage.getItem("access_token"),
    },
  });
};
