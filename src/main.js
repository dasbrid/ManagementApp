import Vue from 'vue'
import App from './App.vue'
import BootstrapVue from 'bootstrap-vue'
import router from "./router";

Vue.use(BootstrapVue)

import 'bootstrap/dist/css/bootstrap.css'
// note this path is not same as in documentations
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
