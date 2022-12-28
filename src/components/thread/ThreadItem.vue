<script setup lang="ts">
import { defineProps } from "vue";
import { Thread } from "@/models";
import CardComponent from "@/components/common/CardComponent.vue";
import AuthorBadge from "@/components/common/AuthorBadge.vue";
import PostList from "@/components/post/PostList.vue";
import PostTimeBadge from "@/components/common/PostTimeBadge.vue";

defineProps({
  thread: {
    type: Object as () => Thread,
    required: true,
  },
  preview: {
    type: Boolean,
    default: false,
    required: false,
  },
});
</script>

<template>
  <card-component>
    <template #header>
      <div class="d-flex flex-column">
        <div class="d-flex flex-row justify-content-between mb-1">
          <h2>{{ thread.title }}</h2>
          <router-link
            v-if="preview"
            :to="{
              name: 'thread',
              params: { boardId: thread.boardId, threadId: thread.id },
            }"
            class="btn btn-primary"
            style="height: fit-content"
          >
            See more
            <font-awesome-icon icon="arrow-right" />
          </router-link>
        </div>
        <div class="d-flex flex-row flex-wrap align-items-baseline">
          <author-badge :authorId="thread.creatorId" class="me-2 mb-1" />
          <post-time-badge :creation-date="thread.createdAt" />
        </div>
      </div>
    </template>
    <template #body>
      <p>{{ thread.description }}</p>
      <post-list :thread-id="thread.id" :preview="preview" />
    </template>
  </card-component>
</template>

<script lang="ts">
export default {
  name: "ThreadItem",
};
</script>

<style scoped></style>
