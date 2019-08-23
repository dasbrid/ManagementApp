import Vue from "vue";
import Router from "vue-router";
import Tokens from "./views/Tokens.vue";
import Preferences from "./views/Preferences.vue";
import Tokendetails from "./views/Tokendetails.vue";
import Newtoken from "./views/Newtoken.vue";

Vue.use(Router);

export default new Router({
    mode: 'history', // I added this.
  routes: [
    {
        path: "/",
        name: "tokens",
        component: Tokens
      },
      {
        path: "/tokens",
        name: "tokens",
        component: Tokens
      },
      {
        path: "/newtoken",
        name: "newtoken",
        component: Newtoken
      },
      {
        // path so that xxx/tokens/n opens up Tokendetails compoent for token id n
        path: '/token/:id',
        name: 'token',
        component: Tokendetails,
        props: true
        // dynamic route
        // has a parameter
      },
      {
        path: "/preferences",
        name: "preferences",
        component: Preferences
      },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "about" */ "./views/About.vue")
    }
  ]
});