<template>
  <ForumList 
    v-for="category in categories" 
    :key="category.id"
    :forums="getForumsForCategory(category)"
    :title="category.name"
    :category-id="category.id"
  />
</template>

<script>
import ForumList from './ForumList.vue';

export default {
   components: { ForumList },
    props: {
        categories: {
            required: true,
            type: Array,
        },
    },
    methods: {
      getForumsForCategory(cat){
        return this.$store.state.forums.filter(x => x.categoryId === cat.id);
      }
    },
};
</script>
