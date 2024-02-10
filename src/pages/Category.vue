<template>
  <h1>{{ category?.name }}</h1>
  <ForumList :title="category?.name" :forums="getForumsForCategory(category)" />
</template>

<script>
import ForumList from "@/components/ForumList.vue";
export default {
  components: { ForumList },
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
    this.$store.dispatch('fetchForums', { ids: category.forums});
  }
};
</script>
