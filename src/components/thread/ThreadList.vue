<script setup lang="ts">
import { ref, defineProps } from "vue";
import { Thread } from "@/models";
import { threadService } from "@/services";
import { useAlertsStore } from "@/stores";
import CardComponent from "@/components/common/CardComponent.vue";
import InfiniteLoading from "v3-infinite-loading";
import "v3-infinite-loading/lib/style.css";
import LoadingComponent from "@/App.vue";
import PostList from "@/components/post/PostList.vue";
import AuthorBadge from "@/components/common/AuthorBadge.vue";

// props
const props = defineProps({
  boardId: {
    type: Number,
    required: true,
  },
});

// refs
const threads = ref([] as Thread[]);
const loading = ref(false);
const offset = ref(0);
const limit = 10;

// logic
const loadMore = async () => {
  try {
    loading.value = true;
    const response = await threadService.getThreads({
      limit: limit,
      offset: offset.value,
      boardId: props.boardId,
    });
    response.data.results.forEach((result: Thread) => {
      if (!threads.value.some((thread: Thread) => thread.id === result.id)) {
        threads.value.push(result);
      }
    });
    offset.value = offset.value + 10;
    loading.value = false;
  } catch (error: any) {
    useAlertsStore().addAlert({
      type: "error",
      description: "Something went wrong... Try again later",
      timeout: 5000,
    });
    loading.value = false;
  }
};
</script>

<template>
  <card-component class="mb-3" v-for="thread in threads" :key="thread.id">
    <template #header>
      <div class="d-flex flex-column">
        <div class="d-flex flex-row justify-content-between mb-1">
          <h2>{{ thread.title }}</h2>
          <router-link
            :to="{
              name: 'thread',
              params: { boardId: thread.boardId, threadId: thread.id },
            }"
            class="btn btn-primary"
            style="height: fit-content"
          >
            See more
          </router-link>
        </div>
        <div class="d-flex flex-row flex-wrap align-items-baseline">
          <author-badge :authorId="thread.creatorId" class="me-2 mb-1" />
          <span class="badge ml-2 bg-secondary mt-1">
            Posted on {{ new Date(thread.createdAt).toLocaleDateString() }}
          </span>
        </div>
      </div>
    </template>
    <template #body>
      <p>{{ thread.description }}</p>
      <post-list :thread-id="thread.id" :preview="true" />
    </template>
  </card-component>
  <infinite-loading @infinite="loadMore" />
  <loading-component v-if="loading" />
</template>

<script lang="ts">
export default {
  name: "ThreadList",
};
</script>

<style scoped></style>
