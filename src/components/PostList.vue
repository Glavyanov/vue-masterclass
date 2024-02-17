<template>
  <div class="post-list">
    <div class="post" v-for="post in posts" :key="post.id">
      <div class="user-info">
        <a href="#" class="user-name">{{ userById(post.userId)?.name }}</a>

        <a href="#">
          <img
            class="avatar-large"
            :src="userById(post.userId)?.avatar"
            alt=""
          />
        </a>

        <p class="desktop-only text-small">{{userById(post.userId)?.postsCount}} posts</p>
        <p class="desktop-only text-small">{{userById(post.userId)?.threadsCount}} threads</p>
      </div>

      <div class="post-content">
        <div class="col-full">
          <PostEditor v-if="editing === post.id" :post="post"/>
          <p v-else>
            {{ post?.text }}
          </p>
        </div>
        <a 
          @click.prevent="toggleEditingMode(post.id)"
          href="#" style="margin-left: auto; padding-left: 10px;" class="link-unstyled">
          <fa icon="pencil-alt"></fa>
        </a>
      </div>
      <div class="post-date text-faded">
        <app-date :timeStamp="post?.publishedAt" />
      </div>
    </div>
  </div>
</template>
<script>
import PostEditor from "@/components/PostEditor.vue";

export default {
  props: {
    posts: {
      required: true,
      type: Array,
    },
  },
  components : {
    PostEditor
  },
  data(){
    return{
      editing: null,
    }
  },
  methods: {
    userById(id){
      return this.$store.getters.user(id);
    },
    toggleEditingMode(id){
      this.editing = id === this.editing ? null : id;
    }
  },
};
</script>
