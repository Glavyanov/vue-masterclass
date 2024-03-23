<template>
  <the-navbar />
  <div class="container">
    <div class="col-full" style="flex-direction: column">
      <router-view v-show="showPage" @ready="onPageReady" :key="`${$route.path}${JSON.stringify($route.query)}`"/>
      <AppSpinner v-show="!showPage" />
    </div>
  </div>
</template>

<script>
import TheNavbar from "@/components/TheNavbar";
import { mapActions } from "vuex";
import NProgress from "nprogress";

export default {
  name: "App",
  components: { TheNavbar },
  data() {
    return {
      showPage: false,
    };
  },
  methods: {
    ...mapActions(["fetchAuthUser"]),
    onPageReady() {
      this.showPage = true;
      NProgress.done();
    }
  },
  async created() {
    NProgress.configure({
      speed: 200,
      showSpinner: false,
    });
    await this.fetchAuthUser();
    this.$router.beforeEach(() => {
      this.showPage = false;
      NProgress.start();
    });
  },
};
</script>

<style>
@import "assets/app.css";
@import "nprogress/nprogress.css";
</style>
