<template>
  <h1 class="push-top">Welcome to the Forum</h1>
  <CategoryList v-if="asyncDataStatus_ready" :categories="categories" />
</template>

<script>
import CategoryList from "@/components/CategoryList.vue";
import asyncDataStatus from "@/mixins/asyncDataStatus";

export default {
  components: {
    CategoryList,
  },
  mixins: [asyncDataStatus],
  computed: {
    categories () {
      return this.$store.state.categories;
    },
  },
  async beforeCreate(){
    const categories = await this.$store.dispatch('fetchAllCategories');
    const forumsIds = categories.map(c => c.forums).flat();
    await this.$store.dispatch('fetchForums', { ids: forumsIds});
    this.asyncDataStatus_fetched();
  }
};
</script>
