<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { Board, Post, Thread } from "@/models";
import { ref } from "vue";
import { useAlertsStore } from "@/stores";
import { boardService, threadService } from "@/services";
import ThreadItem from "@/components/thread/ThreadItem.vue";

// route and router
const route = useRoute();
const router = useRouter();

// params
const threadId = Number(route.params.threadId);
const boardId = Number(route.params.boardId);

// data
const board = ref({} as Board);
const thread = ref({} as Thread);

// logic
if (Number.isNaN(threadId) || Number.isNaN(boardId)) {
  router.replace({
    name: "not-found",
    params: { pathMatch: route.path.substring(1).split("/") },
    query: route.query,
    hash: route.hash,
  });
} else {
  try {
    const boardResponse = await boardService.getBoard(boardId);
    const threadResponse = await threadService.getThread(threadId);
    if (threadResponse.data.boardId !== boardResponse.data.id) {
      router.replace({
        name: "not-found",
        params: { pathMatch: route.path.substring(1).split("/") },
        query: route.query,
        hash: route.hash,
      });
    } else {
      board.value = boardResponse.data;
      thread.value = threadResponse.data;
    }
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
  <article class="min-vh-75 h-100 pb-3">
    <h1>{{ board.title }}</h1>
    <p>{{ board.description }}</p>
    <router-link
      :to="{ name: 'board', params: { boardId: thread.boardId } }"
      class="btn btn-secondary mb-3"
    >
      Go back
    </router-link>
    <thread-item :thread="thread" />
  </article>
</template>

<script lang="ts">
export default {
  name: "ThreadView",
};
</script>

<style scoped></style>
