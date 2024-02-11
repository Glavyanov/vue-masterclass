import { createStore } from "vuex";
import { findById, upsert } from "@/helpers";
import firebaseConfig from "@/config/firebase";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

export default createStore({
  state: {
    categories: [],
    forums: [],
    threads: [],
    posts: [],
    users: [],
    authId: "VXjpr2WHa8Ux4Bnggym8QFLdv5C3",
  },
  getters: {
    authUser: (state, getters) => {
      return getters.user(state.authId);
    },
    user: (state) => {
      return (id) => {
        const user = findById(state.users, id);
        if (!user) {
          return null;
        }
        return {
          ...user,
          /* 
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
          }, */
        };
      };
    },
    thread: (state) => {
      return (id) => {
        const thread = findById(state.threads, id);
        if (!thread) return {};
        return {
          ...thread,
          /* get author() {
            return findById(state.users, thread.userId);
          },
          get repliesCount() {
            return thread.posts.length - 1;
          },
          get contributorsCount() {
            return thread.contributors.length;
          }, */
        };
      };
    },
  },
  actions: {
    async createPost({ commit, state }, post) {
      post.userId = state.authId;
      post.publishedAt = Math.floor(Date.now() / 1000);
      const batch = db.batch();
      const postRef = db.collection('posts').doc();
      const threadRef = db.collection('threads').doc(post.threadId);
      batch.set(postRef, post);
      batch.update(threadRef, {
        posts: firebase.firestore.FieldValue.arrayUnion(postRef.id),
        contributors: firebase.firestore.FieldValue.arrayUnion(state.authId)
      });

      await batch.commit();
      
      commit("setItem", { resource: "posts", item: { ...post, id: postRef.id} });
      commit("appendPostToThread", {
        parentId: post.threadId,
        childId: postRef.id,
      });
      commit("appendContributorToThread", {
        parentId: post.threadId,
        childId: state.authId,
      });
    },
    updateUser({ commit }, user) {
      commit("setItem", { resource: "users", item: user });
    },
    async updateThread({ commit, state }, { title, text, id }) {
      const thread = findById(state.threads, id);
      const post = findById(state.posts, thread.posts[0]);
      const newThread = { ...thread, title };
      const newPost = { ...post, text };

      commit("setItem", { resource: "threads", item: newThread });
      commit("setItem", { resource: "posts", item: newPost });

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
      commit("setItem", { resource: "threads", item: thread });
      commit("appendThreadToUser", { parentId: userId, childId: id });
      commit("appendThreadToForum", { parentId: forumId, childId: id });
      dispatch("createPost", { text, threadId: id });

      return findById(state.threads, id);
    },

    //////////////////////////////////////////////////////////
    // Fetch Single Resource
    /////////////////////////////////////////////////////////
    fetchCategory({ dispatch }, { id }) {
      return dispatch("fetchItem", { id, resource: "categories" });
    },
    fetchForum({ dispatch }, { id }) {
      return dispatch("fetchItem", { id, resource: "forums" });
    },
    fetchThread({ dispatch }, { id }) {
      return dispatch("fetchItem", { id, resource: "threads" });
    },
    fetchUser({ dispatch }, { id }) {
      return dispatch("fetchItem", { id, resource: "users" });
    },
    fetchPost({ dispatch }, { id }) {
      return dispatch("fetchItem", { id, resource: "posts" });
    },
    fetchAuthUser({ dispatch, state }) {
      return dispatch("fetchItem", { id: state.authId, resource: "users" });
    },
    //////////////////////////////////////////////////////////
    // Fetch Multiple Resource
    /////////////////////////////////////////////////////////
    fetchCategories({ dispatch }, { ids }) {
      return dispatch("fetchItems", { ids, resource: "categories" });
    },
    fetchForums({ dispatch }, { ids }) {
      return dispatch("fetchItems", { ids, resource: "forums" });
    },
    fetchThreads({ dispatch }, { ids }) {
      return dispatch("fetchItems", { ids, resource: "threads" });
    },
    fetchUsers({ dispatch }, { ids }) {
      return dispatch("fetchItems", { ids, resource: "users" });
    },
    fetchPosts({ dispatch }, { ids }) {
      return dispatch("fetchItems", { ids, resource: "posts" });
    },
    fetchAllCategories({ commit }) {
      return new Promise((resolve) => {
        getFirebaseResource("categories").then((categories) => {
          categories.forEach((item) => {
            commit("setItem", { resource: "categories", item });
          });
          resolve(categories);
        });
      });
    },
    fetchItem({ commit }, { id, resource }) {
      return new Promise((resolve) => {
        db.collection(resource)
          .doc(id)
          .get()
          .then((res) => {
            if (res.exists) {
              const item = { ...res.data(), id: res.id };
              commit("setItem", { resource, item });
              resolve(item);
            }
          });
      });
    },
    fetchItems({ dispatch }, { ids, resource }) {
      return Promise.all(
        ids.map((id) => dispatch("fetchItem", { id, resource }))
      );
    },
  },
  mutations: {
    setItem(state, { resource, item }) {
      upsert(state[resource], item);
    },
    appendPostToThread: makeAppendChildToParentMutation({
      parent: "threads",
      child: "posts",
    }),
    appendThreadToForum: makeAppendChildToParentMutation({
      parent: "forums",
      child: "threads",
    }),
    appendThreadToUser: makeAppendChildToParentMutation({
      parent: "users",
      child: "threads",
    }),
    appendContributorToThread: makeAppendChildToParentMutation({
      parent: "threads",
      child: "contributors",
    }),
  },
});

function makeAppendChildToParentMutation({ parent, child }) {
  return (state, { parentId, childId }) => {
    const resource = findById(state[parent], parentId);
    if (!resource) return;
    resource[child] ||= [];
    if (!resource[child].includes(childId)) {
      resource[child].push(childId);
    }
  };
}

async function getFirebaseResource(resource) {
  return new Promise((resolve) => {
    db.collection(resource)
      .get()
      .then((querySnapshot) => {
        const arr = [];
        querySnapshot.forEach((doc) => {
          arr.push({ ...doc.data(), id: doc.id });
        });
        resolve(arr);
      });
  });
}
