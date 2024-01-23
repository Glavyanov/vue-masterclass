<template>
  <div class="col-large push-top" v-if="thread">
    <h1>{{ thread.title }}</h1>
    <post-list :posts="threadPosts"/>
  </div>
</template>

<script>
import sourceData from "@/data.json";
import PostList from "@/components/PostList.vue";

export default {
  components: {
    PostList,
  },
  props: {
    id: {
      required: true,
      type: String,
    },
  },
  computed: {
    thread() {
      return sourceData.threads.find((t) => t.id === this.id);
    },
    threadPosts() {
      return sourceData.posts.filter((p) => p.threadId === this.id);
    },
  },
  mounted() {
    this.thread || this.$router.push({ name: 'NotFound' });
  }
};
</script>
