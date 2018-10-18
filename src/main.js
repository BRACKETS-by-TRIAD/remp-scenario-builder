import Vue from 'vue';

import Vuetify from 'vuetify';
import vuetify_css from 'vuetify/dist/vuetify.min.css';
import Vue2Filters from 'vue2-filters';
import axios from 'axios';

import App from './App.vue';
import store from './store/index';
import * as fromConfig from './config';

Vue.config.productionTip = false;
Vue.use(Vuetify);
Vue.use(Vue2Filters);
axios.defaults.headers.common['Authorization'] = fromConfig.AUTH_TOKEN;

new Vue({
  store,
  render: h => h(App)
}).$mount('#app');
