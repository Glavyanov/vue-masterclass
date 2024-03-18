<template>
  <div class="container"  style="width: fit-content;">
    <div class="flex-grid">
      <div class="col-3 push-top">
        <UserProfileCard v-if="!edit" :user="user" />
        <UserProfileCardEditor v-else :user="user" />
      </div>

      <div class="col-7 push-top">
        <div class="profile-header">
          <span class="text-lead"> {{ user?.username }} recent activity </span>
          <a href="#">See only started threads?</a>
        </div>
        <hr />
        <PostList :posts="user?.posts" />
      </div>
    </div>
  </div>
</template>

<script>
import PostList from "@/components/PostList.vue";
import UserProfileCard from "@/components/UserProfileCard.vue";
import UserProfileCardEditor from "@/components/UserProfileCardEditor.vue";
import { mapGetters } from "vuex";
import asyncDataStatus from "@/mixins/asyncDataStatus";

export default {
  components: {
    PostList,
    UserProfileCard,
    UserProfileCardEditor,
  },
  mixins:[asyncDataStatus],
  props: {
    edit: {
        type: Boolean,
        default: false
    }
  },
  computed: {
    ...mapGetters({ user: "authUser" }),
    lastPostFetched(){
      if(!this.user?.posts?.length){
        return null;
      }
      return this.user.posts[this.user.posts.length - 1];
    }
  },
  async created() {
    await this.$store.dispatch("fetchAuthUserPosts", { startAfter: this.lastPostFetched});

    setTimeout(async () => {
      await this.$store.dispatch("fetchAuthUserPosts", { startAfter: this.lastPostFetched});
    }, 2000);

    this.asyncDataStatus_fetched();
  },
};
</script>
