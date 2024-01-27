<template>
  <div class="col-full push-top">
    <h1>
      Editing <i>{{ thread.title }}</i>
    </h1>

    <ThreadEditor
      :title="thread.title"
      :text="text"
      @save="save"
      @cancel="cancel"
    />
  </div>
</template>

<script>
import ThreadEditor from "@/components/ThreadEditor";

export default {
  components: { ThreadEditor },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  methods: {
    async save({ title, text }) {
      await this.$store.dispatch("updateThread", {
        title,
        text,
        id: this.id,
      });

      this.$router.push({ name: "ThreadShow", params: { id: this.id } });
    },
    cancel() {
      this.$router.go(-1);
    },
  },
  computed: {
    thread() {
      return this.$store.state.threads.find((t) => t.id === this.id);
    },
    text() {
      return this.$store.state.posts.find((p) => p.id === this.thread.posts[0])
        .text;
    },
  },
};
</script>
