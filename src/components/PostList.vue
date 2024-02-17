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
          <PostEditor v-if="editing === post.id" :post="post" @save="handlePostEditing"/>
          <div v-else v-html="post?.text"></div>
        </div>
        <a
          v-if="post.userId === $store.state.authId"
          @click.prevent="toggleEditingMode(post.id)"
          href="#" style="margin-left: auto; padding-left: 10px;" class="link-unstyled">
          <fa icon="pencil-alt"></fa>
        </a>
      </div>
      <div class="post-date text-faded">
        <div v-if="post.edited?.at" class="edition-info">edited</div>
        <app-date :timeStamp="post?.publishedAt" />
      </div>
    </div>
  </div>
</template>
<script>
import PostEditor from "@/components/PostEditor.vue";
import { mapActions } from "vuex";
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
    ...mapActions(['updatePost']),
    userById(id){
      return this.$store.getters.user(id);
    },
    toggleEditingMode(id){
      this.editing = id === this.editing ? null : id;
    },
    async handlePostEditing(event){
      await this.updatePost(event.post);
      this.editing = null;
    }
  },
};
</script>
