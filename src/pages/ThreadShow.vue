<template>
  <div class="col-large push-top" v-if="thread">
    <h1>{{ thread.title }}
      <router-link
      :to="{ name: 'ThreadEdit', params: { id: thread.id } }"
      class="btn-green btn-small"
      tag="button"
    >
      Edit Thread
    </router-link>
    </h1>
    <post-list :posts="threadPosts" />
    <post-editor @save="addPost" />
  </div>
</template>

<script>
import PostList from "@/components/PostList.vue";
import PostEditor from "@/components/PostEditor.vue";

export default {
  components: {
    PostList,
    PostEditor,
  },
  props: {
    id: {
      required: true,
      type: String,
    },
  },
  computed: {
    posts() {
      return this.$store.state.posts;
    },
    thread() {
      return this.$store.state.threads.find((t) => t.id === this.id);
    },
    threadPosts() {
      return this.posts.filter((p) => p.threadId === this.id);
    },
  },
  methods: {
    addPost(event) {
      this.$store.dispatch("createPost", {
        ...event.post,
        threadId: this.id,
      });
    },
  },
  mounted() {
    if (!this.thread) {
      this.$router.push({ name: "NotFound" });
    }
  },
};
</script>
