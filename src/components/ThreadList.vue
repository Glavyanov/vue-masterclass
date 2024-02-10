<template>
  <div class="col-full">
    <div class="thread-list">
      <h2 class="list-title">Threads</h2>

      <div v-for="thread in threads" :key="thread.id" class="thread">
        <div>
          <p>
            <router-link :to="{name: 'ThreadShow', params: { id: thread.id}}" :text="thread.title"/>
          </p>
          <p class="text-faded text-xsmall">
            By <a href="#">{{ userById(thread.userId).name }}</a
            >, <app-date :timeStamp=" thread.publishedAt"/>.

          </p>
        </div>

        <div class="activity">
          <p class="replies-count">{{ thread.repliesCount }} replies</p>

          <img
            class="avatar-medium"
            :src="userById(thread.userId).avatar"
            alt=""
          />

          <div>
            <p class="text-xsmall">
              <a href="#">{{ userById(thread.userId).name }}</a>
            </p>
            <p class="text-xsmall text-faded"><app-date :timeStamp="thread.publishedAt"/></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
    props: {
        threads: {
            type: Array,
            required: true,
        },
    },
    methods: {
        postById(id) {
          return this.$store.state.posts.find((p) => p.id === id);
        },
        userById(id){
          return this.$store.state.users.find((p) => p.id === id) || {};
        } 
    },
};
</script>
