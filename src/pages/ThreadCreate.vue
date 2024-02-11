<template>
  <div v-if="forum" class="col-full push-top">
    <h1>
      Create new Thread in <i>{{ forum.name }}</i>
    </h1>

    <ThreadEditor @save="save" @cancel="cancel" />
  </div>
</template>

<script>
import ThreadEditor from "@/components/ThreadEditor";

export default {
  components: { ThreadEditor },
  props: {
    forumId: {
      type: String,
      required: true,
    },
  },
  methods: {
    async save({ title, text }) {
      const thread = await this.$store.dispatch("createThread", {
        title,
        text,
        forumId: this.forum.id,
      });
      this.$router.push({ name: "ThreadShow", params: { id: thread.id } });
    },
    cancel() {
      this.$router.go(-1);
    },
  },
  computed: {
    forum() {
      return this.$store.state.forums.find((f) => f.id === this.forumId);
    },
  },
  created(){
    this.$store.dispatch('fetchForum', { id: this.forumId })
  }
};
</script>
