import { createPinia } from "pinia";
import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import "@/assets/style/main.scss";

const pinia = createPinia();

createApp(App).use(router).use(pinia).mount("#app");
