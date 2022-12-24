import { defineStore } from "pinia";
import { ref } from "vue";
import { Post } from "@/models";

export const usePostsStore = defineStore("posts", () => {
  const posts = ref([] as Post[]);

  function addPosts(newPosts: Post[]) {
    newPosts.forEach((newPost) => {
      if (!posts.value.some((existingPost) => existingPost.id === newPost.id)) {
        posts.value.push(newPost);
      }
    });
  }

  function resetPosts() {
    posts.value = [];
  }

  return { posts, addPosts, resetPosts };
});
