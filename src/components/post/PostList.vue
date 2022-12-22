<script setup lang="ts">
import { ref, defineProps } from "vue";
import { useAlertsStore } from "@/stores";
import CardComponent from "@/components/common/CardComponent.vue";
import InfiniteLoading from "v3-infinite-loading";
import "v3-infinite-loading/lib/style.css";
import LoadingComponent from "@/App.vue";
import { Post } from "@/models";
import { postService } from "@/services";
import AuthorBadge from "@/components/common/AuthorBadge.vue";

// props
const props = defineProps({
  threadId: {
    type: Number,
    required: true,
  },
  preview: {
    type: Boolean,
    required: false,
  },
});

// refs
const posts = ref([] as Post[]);
const loading = ref(false);
const offset = ref(0);
let limit: number;

if (props.preview) {
  limit = 4;
} else {
  limit = 10;
}

// logic
const loadMore = async () => {
  try {
    loading.value = true;
    const response = await postService.getPosts({
      limit: limit,
      offset: offset.value,
      threadId: props.threadId,
    });
    response.data.results.forEach((result: Post) => {
      if (!posts.value.some((post: Post) => post.id === result.id)) {
        posts.value.push(result);
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

if (props.preview) {
  loadMore();
}
</script>

<template>
  <card-component class="mb-3" v-for="post in posts" :key="post.id">
    <template #header>
      <div class="d-flex flex-row flex-wrap align-items-baseline">
        <author-badge :author-id="post.creatorId" class="me-2 mb-1" />
        <span class="badge bg-secondary mt-1">
          Posted on {{ new Date(post.createdAt).toLocaleDateString() }}
        </span>
      </div>
    </template>
    <template #body>
      {{ post.description }}
    </template>
  </card-component>
  <template v-if="!preview">
    <infinite-loading @infinite="loadMore" />
    <loading-component v-if="loading" />
  </template>
</template>

<script lang="ts">
export default {
  name: "PostList",
};
</script>

<style scoped></style>
