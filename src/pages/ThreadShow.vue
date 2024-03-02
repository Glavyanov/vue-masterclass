<template>
  <div class="col-large push-top" v-if="asyncDataStatus_ready">
    <h1>
      {{ thread.title }}
      <router-link
        v-if="thread?.userId === authenticated?.id"
        :to="{ name: 'ThreadEdit', params: { id: thread.id } }"
        class="btn-green btn-small"
        tag="button"
      >
        Edit Thread
      </router-link>
    </h1>

    <p>
      By <a href="#" class="link-unstyled">{{ thread.author?.name }}</a
      >,
      <AppDate :timeStamp="thread?.publishedAt" />
      <span
        class="hide-mobile text-faded text-small"
        style="float: right; margin-top: 2px"
      >
        {{ thread.repliesCount }}
        replies by
        {{ thread.contributorsCount }}
        contributors</span
      >
    </p>

    <post-list :posts="threadPosts" />
    <post-editor v-if="authenticated" @save="addPost" />
    <div v-else class="text-center" style="margin-bottom: 50px;">
      <router-link :to="{ name: 'SignIn', query: { redirectTo: $route.path } }">Sign In</router-link> or <router-link :to="{ name: 'Register',  query: { redirectTo: $route.path } }">Register</router-link> to reply.
    </div>
  </div>
</template>

<script>
import PostList from "@/components/PostList.vue";
import PostEditor from "@/components/PostEditor.vue";
import asyncDataStatus from "@/mixins/asyncDataStatus";
import { mapGetters } from "vuex";

export default {
  components: {
    PostList,
    PostEditor,
  },
  mixins: [asyncDataStatus],
  props: {
    id: {
      required: true,
      type: String,
    },
  },
  computed: {
    ...mapGetters({ authenticated: "authUser"}),
    posts() {
      return this.$store.state.posts;
    },
    thread() {
      return this.$store.getters.thread(this.id);
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
  async created() {
    const id = this.id;
    const thread = await this.$store.dispatch('fetchThread', { id });
    // fetch user
    await this.$store.dispatch('fetchUser', { id: thread.userId });

    //fetch the posts
    const posts = await this.$store.dispatch("fetchPosts", {ids: thread.posts});
    //fetch the users associated with the posts.
    const usersIds = posts.map( p => p.userId );
    await this.$store.dispatch("fetchUsers", { ids: usersIds });
    this.asyncDataStatus_fetched();
    
  },
};
</script>
