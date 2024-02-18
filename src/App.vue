<template>
  <the-navbar />
  <div class="container">
    <div class="col-full" style="flex-direction: column">
      <router-view v-show="showPage" @ready="showPage = true" />
      <AppSpinner v-show="!showPage" />
    </div>
  </div>
</template>

<script>
import TheNavbar from "@/components/TheNavbar";
import { mapActions } from "vuex";

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
  },
  async created() {
    await this.fetchAuthUser();
    this.$router.beforeEach(() => {
      this.showPage = false;
    });
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
