<template>
  <div v-if="asyncDataStatus_ready" class="col-full push-top">
    <div class="forum-header">
      <div class="forum-details">
        <h1>{{ forum.name }}</h1>
        <p class="text-lead">{{ forum.description }}</p>
      </div>
      <router-link :to="{name: 'ThreadCreate', params: { forumId: forum.id }}" class="btn-green btn-small">Start a thread</router-link>
    </div>
  </div>

  <div class="col-full push-top">
    <ThreadList :threads="threads" />
    <v-pagination
      v-model="page"
      :pages="totalPages"
      active-color="#57AD8D"
    />
  </div>
</template>

<script>
import ThreadList from "@/components/ThreadList";
import asyncDataStatus from "@/mixins/asyncDataStatus";
import { watch } from "vue";

export default {
  components: { ThreadList },
  mixins: [asyncDataStatus],
  props: {
    id: {
      required: true,
      type: String,
    },
  },
  data(){
    return {
      page: 1,
      perPage: 4,
    }
  },
  computed: {
    forum() {
      return this.$store.state.forums.find((forum) => forum.id === this.id);
    },
    threads() {
      if(!this.forum) return [];
      return this.$store.state.threads
      .filter(t => t.forumId === this.forum.id)
      .map(thread => this.$store.getters.thread(thread.id));
    },
    threadCount() {
      return this.forum?.threads.length; 
    },
    totalPages() {
      if(!this.threadCount) return 0;
      return Math.ceil(this.threadCount / this.perPage);
    }
  },
  async created(){
    const forum = await this.$store.dispatch('fetchForum', { id: this.id });
    const threads = await this.$store.dispatch('fetchThreadsByPage', { ids: forum.threads, page: this.page, perPage: this.perPage });
    await this.$store.dispatch('fetchUsers', { ids: threads.map( t => t.userId) });
    this.asyncDataStatus_fetched();
  },
  watch: {
    async page(page) {
      const threads = await this.$store.dispatch('fetchThreadsByPage', { ids: this.forum.threads, page , perPage: this.perPage });
      await this.$store.dispatch('fetchUsers', { ids: threads.map( t => t.userId) });
    }
  },
};
</script>
