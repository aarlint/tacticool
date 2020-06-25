import Vue from 'vue'
import App from './App.vue'
import SocketIO from "socket.io-client"
import VueSocketIO from 'vue-socket.io';
import store from './store'

Vue.use(new VueSocketIO({
  debug: true,
  connection: SocketIO('http://10.3.141.1:3000'), //options object is Optional
  vuex: {
    store,
    actionPrefix: 'SOCKET_'
  },
})
);

Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(App),
}).$mount('#app')
