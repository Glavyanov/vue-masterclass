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
          return state.posts.filter((p) => p.userId === user.id);
        },

        get postsCount() {
          return this.posts.length;
        },

        get threads() {
          return state.threads.filter((t) => t.userId === user.id);
        },

        get threadsCount() {
          return this.threads.length;
        },
      };
    },
  },
  actions: {
    createPost({ commit, state }, post) {
      const postId = "foo" + Math.random();
      post.id = postId;
      post.userId = state.authId;
      post.publishedAt = Math.floor(Date.now() / 1000);
      commit("setPost", { post });
      commit("appendPostToThread", { postId, threadId: post.threadId });
    },
    updateUser({ commit }, user) {
      commit("setUser", { user, userId: user.id });
    },
    async updateThread({ commit, state }, { title, text, id }) {
      const thread = state.threads.find((t) => t.id === id);
      const post = state.posts.find((p) => p.id === thread.posts[0]);
      const newThread = { ...thread, title };
      const newPost = { ...post, text };

      commit("setThread", { thread: newThread });
      commit("setPost", { post: newPost });

      return thread;
    },
    async createThread({ commit, state, dispatch }, { title, text, forumId }) {
      const id = "foo" + Math.random();
      const userId = state.authId;
      const publishedAt = Math.floor(Date.now() / 1000);
      const thread = {
        forumId,
        title,
        id,
        publishedAt,
        userId,
      };
      commit("setThread", { thread });
      commit("appendThreadToUser", { userId, threadId: id });
      commit("appendThreadToForum", { forumId, threadId: id });
      dispatch("createPost", { text, threadId: id });

      return state.threads.find((t) => t.id === id);
    },
  },
  mutations: {
    setPost(state, { post }) {
      const index = state.posts.findIndex((p) => p.id === post.id);
      if (post.id && index !== -1) {
        state.posts[index] = post;
      } else {
        state.posts.push(post);
      }
    },
    setThread(state, { thread }) {
      const index = state.threads.findIndex((t) => t.id === thread.id);
      if (thread.id && index !== -1) {
        state.threads[index] = thread;
      } else {
        state.threads.push(thread);
      }
    },
    appendPostToThread(state, { postId, threadId }) {
      const thread = state.threads.find((t) => t.id === threadId);
      thread.posts ||= [];
      thread.posts.push(postId);
    },
    setUser(state, { user, userId }) {
      const userIndex = state.users.findIndex((u) => u.id === userId);
      state.users[userIndex] = user;
    },
    appendThreadToForum(state, { forumId, threadId }) {
      const forum = state.forums.find((f) => f.id === forumId);
      forum.threads ||= [];
      forum.threads.push(threadId);
    },
    appendThreadToUser(state, { userId, threadId }) {
      const user = state.users.find((u) => u.id === userId);
      user.threads ||= [];
      user.threads.push(threadId);
    },
  },
});
