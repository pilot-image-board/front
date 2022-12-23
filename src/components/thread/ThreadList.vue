<script setup lang="ts">
import { ref, defineProps } from "vue";
import { Thread } from "@/models";
import { threadService } from "@/services";
import { useAlertsStore } from "@/stores";
import InfiniteLoading from "v3-infinite-loading";
import LoadingComponent from "@/App.vue";
import ThreadItem from "@/components/thread/ThreadItem.vue";

// props
const props = defineProps({
  boardId: {
    type: Number,
    required: true,
  },
  preview: {
    type: Boolean,
    required: false,
    default: false,
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
  <thread-item
    :thread="thread"
    v-for="thread in threads"
    :key="thread.id"
    :preview="true"
  />
  <infinite-loading @infinite="loadMore" />
  <loading-component v-if="loading" />
</template>

<script lang="ts">
export default {
  name: "ThreadList",
};
</script>

<style scoped></style>
