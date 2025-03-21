import Home from "@/pages/Home";
import ThreadShow from "@/pages/ThreadShow";
import ThreadCreate from "@/pages/ThreadCreate";
import ThreadEdit from "@/pages/ThreadEdit";
import Forum from "@/pages/Forum";
import Category from "@/pages/Category";
import Register from "@/pages/Register";
import SignIn from "@/pages/SignIn";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/NotFound";
import { createRouter, createWebHistory } from "vue-router";
import store from "@/store";
import NProgress from "nprogress";
import { findById } from "@/helpers";


const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
    meta: { requireGuest: true },
  },
  {
    path: "/login",
    name: "SignIn",
    component: SignIn,
    meta: { requireGuest: true },
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
    meta: { toTop: true, smoothScroll: true, requireAuth: true },
  },
  {
    path: "/profile/edit",
    name: "ProfileEdit",
    component: Profile,
    props: { edit: true },
    meta: { requireAuth: true },
  },
  {
    path: "/category/:id",
    name: "Category",
    component: Category,
    props: true,
  },
  {
    path: "/forum/:id",
    name: "Forum",
    component: Forum,
    props: true,
  },
  {
    path: "/thread/:id",
    name: "ThreadShow",
    component: ThreadShow,
    props: true,
    async beforeEnter(to, _,){
      await store.dispatch("fetchThread", { id: to.params.id});
      const threadExists = findById(store.state.threads, to.params.id);
      if(threadExists){
        return true;
      } else {
        return {
          name: "NotFound",
          params: { pathMatch: to.path.substring(1).split('/')},
          query: to.query,
          hash: to.hash
        }
      }
    },
  },
  {
    path: "/forum/:forumId/thread/create",
    name: "ThreadCreate",
    component: ThreadCreate,
    props: true,
    meta: { requireAuth: true },
  },
  {
    path: "/thread/:id/edit",
    name: "ThreadEdit",
    component: ThreadEdit,
    props: true,
    meta: { requireAuth: true },
  },
  {
    path: "/logout",
    name: "SignOut",
    async beforeEnter( _, from){
      await store.dispatch('signOut');
      if(from.path === "/"){
        NProgress.done();
      }
      return { name: "Home" };
    }
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: NotFound,
  },
];
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to) {
    const scroll = {};

    if (to.meta.toTop) {
      scroll.top = 0;
    }
    if (to.meta.smoothScroll) {
      scroll.behavior = "smooth";
    }
    return scroll;
  },
});

router.beforeEach(async function(to, from){
  await store.dispatch("initAuthentication");

  if(!store.state.authId && to.meta.requireAuth){
    return { 
      name: "SignIn", 
      query: { redirectTo: to.path },
    };
  }
  
  if(store.state.authId && to.meta.requireGuest){
    return { name: from.name};
  }

});

export default router;
