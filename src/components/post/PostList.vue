<script setup lang="ts">
import { ref, defineProps } from "vue";
import { useAlertsStore, usePostsStore } from "@/stores";
import CardComponent from "@/components/common/CardComponent.vue";
import { postService } from "@/services";
import AuthorBadge from "@/components/common/AuthorBadge.vue";
import PostTimeBadge from "@/components/common/PostTimeBadge.vue";
import { Post } from "@/models";

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
let posts = ref([] as Post[]);
const loading = ref(false);
const offset = ref(0);
let limit: number;

if (props.preview) {
  limit = 4;
} else {
  limit = 10000;
  usePostsStore().resetPosts();
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
    if (props.preview) {
      posts.value = response.data.results;
    } else {
      usePostsStore().addPosts(response.data.results);
      posts.value = usePostsStore().posts;
    }
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

await loadMore();

if (!props.preview) {
  setTimeout(() => {
    loadMore();
  }, 15000);
}
</script>

<template>
  <card-component class="mb-3" v-for="post in posts" :key="post.id">
    <template #header>
      <div class="d-flex flex-row flex-wrap align-items-baseline">
        <author-badge :author-id="post.creatorId" class="me-2 mb-1" />
        <post-time-badge :creation-date="post.createdAt" />
      </div>
    </template>
    <template #body>
      {{ post.description }}
    </template>
  </card-component>
</template>

<script lang="ts">
export default {
  name: "PostList",
};
</script>

<style scoped></style>
