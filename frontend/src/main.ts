import App from "./App.vue";
import { createApp } from "vue";
import { createRouter } from "./router";
import { createAuth0 } from "@auth0/auth0-vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faLink, faUser, faPowerOff } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { auth0Config } from "./services/api";
import hljs from 'highlight.js/lib/core';
import json from 'highlight.js/lib/languages/json';
import hljsVuePlugin from "@highlightjs/vue-plugin";
import "highlight.js/styles/github.css";
import { createPinia } from "pinia";

hljs.registerLanguage('json', json);

const app = createApp(App);

library.add(faLink, faUser, faPowerOff);

app
  .use(hljsVuePlugin)
  .use(createPinia())
  .use(createRouter(app))
  .use(
    createAuth0({
      domain: auth0Config.domain,
      clientId: auth0Config.clientId,
      authorizationParams: {
        redirect_uri: window.location.origin,
        audience: auth0Config.audience
      }
    })
  )
  .component("font-awesome-icon", FontAwesomeIcon)
  .mount("#app");
