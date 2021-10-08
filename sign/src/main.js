import Vue from 'vue'
import App from './App.vue'
//引入vant
import { Button, Dialog, Form, Field, Toast } from 'vant';
import 'vant/lib/index.css';
Vue.use(Button).use(Dialog).use(Form).use(Field).use(Toast);
//引入animate.css
import "animate.css"
//引入axios
import axios from "axios"
axios.defaults.withCredentials = true
Vue.prototype.axios = axios

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
