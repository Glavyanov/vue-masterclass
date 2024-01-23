import PageHome from "@/components/PageHome";
import PageThreadShow from "@/components/PageThreadShow";
import NotFound from "@/components/PageNotFound";
import {createRouter, createWebHistory} from "vue-router";

const routes = [
  {
    path: "/",
    name: 'Home',
    component: PageHome,
  },
  {
    path: "/thread/:id",
    name: 'ThreadShow',
    component: PageThreadShow,
    props: true
  },
  {
    path: "/:pathMatch(.*)*",
    name: 'NotFound',
    component: NotFound,
  },
];
const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;