import { createStore } from "vuex";
import sourceData from "@/data.json";

export default createStore({
  state: {
    ...sourceData,
    authId: 'VXjpr2WHa8Ux4Bnggym8QFLdv5C3'
  },
  getters:{
    authUser: state => state.users.find(u => u.id === state.authId)
  },
  actions: {
    createPost(ctx, post) {
      const postId = 'dfdfds' + Math.random();
      post.id = postId;
      ctx.commit("setPost", { post });
      ctx.commit("appendPostToThread", { postId, threadId: post.threadId });
    },
  },
  mutations: {
    setPost(state, { post }) {
      state.posts.push(post);
    },
    appendPostToThread(state, { postId, threadId }) {
        state.threads.find(t => t.id === threadId).posts.push(postId);
    },
  },
});
