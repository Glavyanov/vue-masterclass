import { createApp } from "vue";
import App from "@/App.vue";
import router from "@/router/router";
import store from "@/store";
import FontAwesome from "@/plugins/FontAwesome";
import firebase from "@/helpers/firebase";

firebase.auth().onAuthStateChanged( user => {
  if(user){
    debugger;
    store.dispatch("fetchAuthUser");
  }
});

const forumApp = createApp(App);
forumApp.use(router);
forumApp.use(store);
forumApp.use(FontAwesome);

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
