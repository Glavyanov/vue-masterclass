import { createApp } from "vue";
import App from "@/App.vue";
import router from "@/router/router";
import store from "@/store";
import firebaseConfig from "@/config/firebase";

const forumApp = createApp(App);
forumApp.use(router);
forumApp.use(store);

const requireComponent = require.context('./components', true, /App[A-Z]\w+\.(vue|js)$/);
requireComponent.keys().forEach( function(fileName) {
  let componentConfig = requireComponent(fileName)
  componentConfig = componentConfig.default || componentConfig;
  const componentName = componentConfig.name || (
      fileName
      .replace(/^.+\//, '')
      .replace(/\.\w+$/, '')
    )

  // Register component globally
  forumApp.component( componentName, componentConfig)
})

forumApp.mount("#app");
