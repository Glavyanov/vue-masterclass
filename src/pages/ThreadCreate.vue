<template>
  <div v-if="asyncDataStatus_ready" class="col-full push-top">
    <h1>
      Create new Thread in <i>{{ forum.name }}</i>
    </h1>

    <ThreadEditor @save="save" @cancel="cancel" @dirty="isDirtyForm = true" @clean="isDirtyForm = false" />
  </div>
</template>

<script>
import ThreadEditor from "@/components/ThreadEditor";
import asyncDataStatus from "@/mixins/asyncDataStatus";

export default {
  components: { ThreadEditor },
  mixins: [asyncDataStatus],
  props: {
    forumId: {
      type: String,
      required: true,
    },
  },
  data(){
    return {
      isDirtyForm: false,
    }
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
  async created(){
    await this.$store.dispatch("fetchForum", { id: this.forumId });
    this.asyncDataStatus_fetched();
  },
  beforeRouteLeave(){
    if(this.isDirtyForm){
      const confirmed = window.confirm("Are you sure you want to leave? Unsaved changes will be lost!");
      if(!confirmed){
        return false;
      }
    }
  }
};
</script>
