import { createStore } from "vuex";
import { findById, upsert } from "@/helpers";
import firebaseConfig from "@/config/firebase";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  setDoc,
  getDoc,
  doc,
} from "firebase/firestore";

const firebase = initializeApp(firebaseConfig);
const db = getFirestore(firebase);

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
    /* authUser: (state, getters) => {
      return getters.user(state.authId);
    }, */
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
    createPost({ commit, state }, post) {
      const postId = "foo" + Math.random();
      post.id = postId;
      post.userId = state.authId;
      post.publishedAt = Math.floor(Date.now() / 1000);
      commit("setPost", { post });
      commit("appendPostToThread", {
        parentId: post.threadId,
        childId: postId,
      });
      commit("appendContributorToThread", {
        parentId: post.threadId,
        childId: post.userId,
      });
    },
    updateUser({ commit }, user) {
      commit("setUser", { user, userId: user.id });
    },
    async updateThread({ commit, state }, { title, text, id }) {
      const thread = findById(state.threads, id);
      const post = findById(state.posts, thread.posts[0]);
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
      commit("appendThreadToUser", { parentId: userId, childId: id });
      commit("appendThreadToForum", { parentId: forumId, childId: id });
      dispatch("createPost", { text, threadId: id });

      return findById(state.threads, id);
    },
    fetchThread({state, commit}, { id }){
      return new Promise((resolve) => {
        // fetch tread
        const docThread = doc(db, "threads", id);
        getDoc(docThread).then((res) => {
          if (res.exists()) {
            const thread = { ...res.data(), id: res.id };
            commit("setThread", { thread });
            resolve(thread);
          }
        });
      });
    },
    fetchUser({state, commit}, { id }){
      return new Promise((resolve) => {
        // fetch tread
        const docUser = doc(db, "users", id);
        getDoc(docUser).then((res) => {
          if (res.exists()) {
            const user = { ...res.data(), id: res.id };
            commit("setUser", { user });
            resolve(user);
          }
        });
      });
    },
    fetchPost({state, commit}, { id }){
      return new Promise((resolve) => {
        // fetch tread
        const docPost = doc(db, "posts", id);
        getDoc(docPost).then((res) => {
          if (res.exists()) {
            const post = { ...res.data(), id: res.id };
            commit("setPost", { post });
            resolve(post);
          }
        });
      });
    },
  },
  mutations: {
    /* async  */setPost(state, { post }) {
      upsert(state.posts, post);
      //await setFirebaseResource("posts", post)
    },
    setThread(state, { thread }) {
      upsert(state.threads, thread);
    },
    setUser(state, { user /* userId */ }) {
      upsert(state.users, user);
      // const userIndex = state.users.findIndex((u) => u.id === userId);
      // state.users[userIndex] = user;
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
    resource[child] ||= [];
    if (!resource[child].includes(childId)) {
      resource[child].push(childId);
    }
  };
}

async function getFirebaseResource(resource) {
  const arr = [];
  const q = collection(db, resource);
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    arr.push({ ...doc.data(), id: doc.id });
  });
  return arr;
}

async function setFirebaseResource(resources, resource) {
  await setDoc(doc(db, resources, resource.id), {
    ...resource,
  });
}
