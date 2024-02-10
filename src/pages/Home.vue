<template>
  <h1 class="push-top">Welcome to the Forum</h1>
  <CategoryList :categories="categories" />
</template>

<script>
import CategoryList from "@/components/CategoryList.vue";

export default {
  components: {
    CategoryList,
  },
  computed: {
    categories () {
      return this.$store.state.categories;
    },
  },
  async beforeCreate(){
    const categories = await this.$store.dispatch('fetchAllCategories');
    const forumsIds = categories.map(c => c.forums).flat();
    this.$store.dispatch('fetchForums', { ids: forumsIds});
  }
};
</script>
