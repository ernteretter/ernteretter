import Vue from 'vue'
import App from './App.vue'

//sites
import landingPage from './pages/landingPage'

import OfferDetails from './pages/OfferDetails'
import login from './pages/login'
import offers from './pages/offers'
import history from './pages/history'
import createOffer from './pages/createOffer';
import editOffer from './pages/editOffer';
import registerHelper from './pages/registerHelper';
import registerHelperSuccess from './pages/registerHelperSuccess';
import registerAgrarian from './pages/registerAgrarian';
import registerAgrarianSuccess from './pages/registerAgrarianSuccess';

//plugins
import firebase from 'firebase/app'
import VueRouter from 'vue-router'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import vuetify from './plugins/vuetify'


//enable plugins
Vue.use(VueRouter)
Vue.use(Vuetify)

const routes = [
  {path: "/", component: landingPage},
  {path: "/offers", component: offers},
  {name: 'offer-details', path: "/offers/:offerId", component: OfferDetails},
  {path: "/login", component: login},
  {path: "/createOffer", component: createOffer},
  {name: "edit-offer", path: "/editOffer/:offerId", component: editOffer},
  {path: "/history", component: history},
  {path: "/registerHelper", component: registerHelper},
  {path: "/registerHelperSuccess", component: registerHelperSuccess},
  {path: "/registerAgrarian", component: registerAgrarian},
  {path: "/registerAgrarianSuccess", component: registerAgrarianSuccess},
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
  vuetify,
  router
}).$mount('#app')
