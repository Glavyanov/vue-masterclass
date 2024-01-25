import { createStore } from "vuex";
import sourceData from "@/data.json";

export default createStore({
  state: {
    ...sourceData,
    authId: "VXjpr2WHa8Ux4Bnggym8QFLdv5C3",
  },
  getters: {
    authUser: (state) => {
      const user = state.users.find((u) => u.id === state.authId);
      if (!user) {
        return null;
      }
      return {
        ...user,

        get posts() {
          return state.posts.filter(
            (p) => p.userId === user.id
          );
        },

        get postsCount() {
          return this.posts.length;
        },

        get threads() {
          return state.threads.filter(
            (t) => t.userId === user.id
          );
        },

        get threadsCount() {
          return this.threads.length;
        },
      };
    },
  },
  actions: {
    createPost({commit, state}, post) {
      const postId = "dfdfds" + Math.random();
      post.id = postId;
      post.userId = state.authId;
      post.publishedAt = Math.floor(Date.now() / 1000),
      commit("setPost", { post });
      commit("appendPostToThread", { postId, threadId: post.threadId });
    },
    updateUser({commit}, user){
        commit("setUser", { user, userId: user.id });
    }
  },
  mutations: {
    setPost(state, { post }) {
      state.posts.push(post);
    },
    appendPostToThread(state, { postId, threadId }) {
        state.threads.find((t) => t.id === threadId).posts.push(postId);
    },
    setUser(state, { user, userId }) {
      const userIndex = state.users.findIndex(u => u.id === userId);
      state.users[userIndex] = user;
    },
  },
});
