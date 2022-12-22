<script setup lang="ts">
import { ref } from "vue";
import { Board } from "@/models";
import { boardService } from "@/services";
import { useRoute, useRouter } from "vue-router";
import { useAlertsStore } from "@/stores";
import CardComponent from "@/components/common/CardComponent.vue";
import ThreadList from "@/components/thread/ThreadList.vue";

// Router and route
const router = useRouter();
const route = useRoute();

// route params
const boardId = route.params.boardId;

// refs
const board = ref({} as Board);

// logic
if (Number.isNaN(+boardId)) {
  router.replace({
    name: "not-found",
    params: { pathMatch: route.path.substring(1).split("/") },
    query: route.query,
    hash: route.hash,
  });
} else {
  try {
    const response = await boardService.getBoard(+boardId);
    board.value = response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      router.replace({
        name: "not-found",
        params: { pathMatch: route.path.substring(1).split("/") },
        query: route.query,
        hash: route.hash,
      });
    } else {
      useAlertsStore().addAlert({
        type: "error",
        description: "Something went wrong... Try again later",
        timeout: 5000,
      });
      await router.push({
        name: "home",
      });
    }
  }
}
</script>

<template>
  <article>
    <h1>{{ board.title }}</h1>
    <p>{{ board.description }}</p>
    <thread-list :board-id="board.id" />
  </article>
</template>

<script lang="ts">
export default {
  name: "BoardView",
};
</script>

<style scoped></style>
