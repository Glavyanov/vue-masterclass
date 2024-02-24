import { createStore } from "vuex";
import { findById, upsert, docToResource } from "@/helpers";
import firebaseConfig from "@/config/firebase";
import firebase from "@/helpers/firebase";

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

export default createStore({
  state: {
    categories: [],
    forums: [],
    threads: [],
    posts: [],
    users: [],
    authId: null/* "VXjpr2WHa8Ux4Bnggym8QFLdv5C3" */,
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
          
          get posts() {
            return state.posts.filter((p) => p.userId === user.id);
          },

          get postsCount() {
            //return this.posts.length;
            return user.postsCount || 0;
          },

          get threads() {
            return state.threads.filter((t) => t.userId === user.id);
          },

          get threadsCount() {
            return user.threads?.length || 0;
          },
        };
      };
    },
    thread: (state) => {
      return (id) => {
        const thread = findById(state.threads, id);
        if (!thread) return {};
        return {
          ...thread,
          get author() {
            return findById(state.users, thread.userId);
          },
          get repliesCount() {
            return thread.posts.length - 1;
          },
          get contributorsCount() {
            return thread.contributors.length;
          },
        };
      };
    },
  },
  actions: {
    async createPost({ commit, state }, post) {
      post.userId = state.authId;
      post.publishedAt = firebase.firestore.FieldValue.serverTimestamp();
      const batch = db.batch();
      const postRef = db.collection('posts').doc();
      const threadRef = db.collection('threads').doc(post.threadId);
      const userRef = db.collection('users').doc(state.authId);
      batch.set(postRef, post);
      batch.update(threadRef, {
        posts: firebase.firestore.FieldValue.arrayUnion(postRef.id),
        contributors: firebase.firestore.FieldValue.arrayUnion(state.authId)
      });
      batch.update(userRef, {
        postsCount: firebase.firestore.FieldValue.increment(1),
      });

      await batch.commit();
      
      const newPost = await postRef.get();
      commit("setItem", { resource: "posts", item: { ...newPost.data(), id: newPost.id} });
      commit("appendPostToThread", {
        parentId: post.threadId,
        childId: newPost.id,
      });
      commit("appendContributorToThread", {
        parentId: post.threadId,
        childId: state.authId,
      });
    },
    async updatePost({commit, state}, { text, id}){
      const post = {
        text,
        edited: {
          at: firebase.firestore.FieldValue.serverTimestamp(),
          by: state.authId,
          moderated: false
        }
      }
      const postRef = db.collection('posts').doc(id);
      await postRef.update(post);
      const updatedPost = await postRef.get()
      commit("setItem", { resource: "posts", item: updatedPost });
    },
    async registerUserWithEmailAndPassword({dispatch}, {email, name, username, password, avatar = null }){
      const result = await firebase.auth().createUserWithEmailAndPassword(email, password);
      await dispatch("createUser", { id: result.user.uid, email, name, username, avatar });
    },
    signInWithEmailAndPassword(context, { email, password } ){
      return firebase.auth().signInWithEmailAndPassword(email, password);
    },
    async signOut({ commit }){
      await firebase.auth().signOut();
      commit("setAuthId", { id: null });
    },
    async createUser({commit}, { id, name, username, email, avatar = null}){
      const registeredAt = firebase.firestore.FieldValue.serverTimestamp();
      const usernameLower = username?.toLowerCase();
      email = email?.toLowerCase();
      const user = { avatar, name, username, email, usernameLower, registeredAt };
      const userRef = db.collection("users").doc(id);
      userRef.set(user);
      const newUser = await userRef.get();
      commit("setItem", { resource: "users", item: newUser});

      return docToResource(newUser);
    },
    updateUser({ commit }, user) {
      commit("setItem", { resource: "users", item: user });
    },
    async updateThread({ commit, state }, { title, text, id }) {
      const thread = findById(state.threads, id);
      const post = findById(state.posts, thread.posts[0]);
      let newThread = { ...thread, title };
      let newPost = { ...post, text };
      const threadRef = db.collection('threads').doc(id);
      const postRef = db.collection('posts').doc(post.id);
      const batch = db.batch();
      batch.update(threadRef, newThread);
      batch.update(postRef, newPost);

      await batch.commit();
      newThread = await threadRef.get();
      newPost = await postRef.get();

      commit("setItem", { resource: "threads", item: newThread });
      commit("setItem", { resource: "posts", item: newPost });

      return docToResource(newThread);
    },
    async createThread({ commit, state, dispatch }, { title, text, forumId }) {
      const userId = state.authId;
      const publishedAt = firebase.firestore.FieldValue.serverTimestamp();
      const threadRef = db.collection('threads').doc();
      const thread = {
        forumId,
        title,
        id: threadRef.id,
        publishedAt,
        userId,
      };

      const userRef = db.collection('users').doc(userId);
      const forumRef = db.collection('forums').doc(forumId);
      const batch = db.batch();
      batch.set(threadRef, thread);
      batch.update(userRef, {
        threads: firebase.firestore.FieldValue.arrayUnion(threadRef.id),
      });
      batch.update(userRef, {
        threads: firebase.firestore.FieldValue.arrayUnion(threadRef.id),
      });
      batch.update(forumRef, {
        threads: firebase.firestore.FieldValue.arrayUnion(threadRef.id),
      });

      await batch.commit();

      const newThread = await threadRef.get();

      commit("setItem", { resource: "threads", item: { ...newThread.data(), id: newThread.id } });
      commit("appendThreadToUser", { parentId: userId, childId: threadRef.id });
      commit("appendThreadToForum", { parentId: forumId, childId: threadRef.id });
      await dispatch("createPost", { text, threadId: threadRef.id });

      return findById(state.threads, threadRef.id);
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
    fetchAuthUser({ dispatch, commit }) {
      const id = firebase.auth().currentUser?.uid;
      if(!id) return;
      commit("setAuthId", { id });
      return dispatch("fetchItem", { id, resource: "users" });
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
    }
  },
  mutations: {
    setItem(state, { resource, item }) {
      upsert(state[resource], docToResource(item));
    },
    setAuthId(state, { id }){
      state.authId = id;
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
