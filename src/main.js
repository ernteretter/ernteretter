import Vue from 'vue'
import App from './App.vue'
import landingPage from './pages/landingPage'

//plugins
import firebase from 'firebase/app'
import VueRouter from 'vue-router'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

//enable plugins
Vue.use(VueRouter)
Vue.use(Vuetify)

const routes = [
  {path: "/home", component: landingPage},
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDzHKaBLhLz9G2q84cn9yvNUqP77S0te_g",
  authDomain: "ernteretter.firebaseapp.com",
  databaseURL: "https://ernteretter.firebaseio.com",
  projectId: "ernteretter",
  storageBucket: "ernteretter.appspot.com",
  messagingSenderId: "382367402085",
  appId: "1:382367402085:web:e4af34683a66509efc9e8c"
};
firebase.initializeApp(firebaseConfig);

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
