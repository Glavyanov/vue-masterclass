<template>
  <div v-if="asyncDataStatus_ready" class="container col-full">
    <h1>{{ category?.name }}</h1>
    <ForumList :title="category?.name" :forums="getForumsForCategory(category)" />
  </div>
</template>

<script>
import ForumList from "@/components/ForumList.vue";
import asyncDataStatus from "@/mixins/asyncDataStatus";

export default {
  components: { ForumList },
  mixins: [asyncDataStatus],
  props: {
    id: {
      required: true,
      type: String,
    },
  },
  computed: {
    category() {
      return this.$store.state.categories.find((c) => c.id === this.id) || {};
    },
  },
  methods: {
    getForumsForCategory(cat) {
      return this.$store.state.forums.filter((x) => x.categoryId === cat.id);
    },
  },
  async created(){
    const category = await this.$store.dispatch('fetchCategory', { id:this.id })
    await this.$store.dispatch('fetchForums', { ids: category.forums});
    this.asyncDataStatus_fetched();
  }
};
</script>
