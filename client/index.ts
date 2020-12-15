import Vue from 'vue';
const App = () => import('./App.vue');
import router from './router';
import AtComponents from 'at-ui';
Vue.use(AtComponents);
import Axios from './lib/axiosInterceptor';
Vue.prototype.axios = Axios;
import store from './config/store';
import './lib/dateFormat.ts';
import './lib/textFilter.ts';
//Introducing js-base64 to encrypt URL
import { Base64 } from 'js-base64';
Vue.prototype.$Base64 = Base64;

new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
})