import Vue from 'vue'
import App from './App.vue'

//sites
import landingPage from './pages/landingPage'
import OfferDetails from './pages/OfferDetails'
import login from './pages/login'
import offers from './pages/offers'
import history from './pages/history'
import settings from './pages/settings'
import createOffer from './pages/createOffer';
import editOffer from './pages/editOffer';
import register from './pages/register';
import registerHelper from './pages/registerHelper';
import registerHelperSuccess from './pages/registerHelperSuccess';
import registerAgrarian from './pages/registerAgrarian';
import registerAgrarianSuccess from './pages/registerAgrarianSuccess';
import datenschutz from './pages/datenschutz';
import impressum from './pages/impressum';
import chat from './pages/chat';
import information from './pages/information';
import error from './pages/error';
import inbox from './pages/inbox';

//plugins
import firebase from 'firebase/app'
import VueRouter from 'vue-router'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import vuetify from './plugins/vuetify'
import meta from 'vue-meta'
import 'leaflet/dist/leaflet.css';

//enable plugins
Vue.use(VueRouter)
Vue.use(Vuetify)
Vue.use(meta)

const routes = [
  {name: "landingPage", path: "/", component: landingPage},
  {name: "offers", path: "/offers", component: offers},
  {name: 'offer-details', path: "/offers/:offerId", component: OfferDetails},
  {name: "login", path: "/login", component: login, meta: {requiresNotAuth: true}},
  {name: "createOffers", path: "/createOffer", component: createOffer, meta: {requiresAuth: true, requiresFarmer: true}},
  {name: "edit-offer", path: "/editOffer/:offerId", component: editOffer, meta: {requiresAuth: true, requiresFarmer: true}},
  {name: "history", path: "/history", component: history, meta: {requiresAuth: true}},
  {name: "settings", path: "/settings", component: settings, meta: {requiresAuth: true}},
  {name: "register", path: "/register", component: register, meta: {requiresNotAuth: true}},
  {name: "registerHelper", path: "/registerHelper", component: registerHelper, meta: {requiresNotAuth: true}},
  {name: "registerHelperSuccess", path: "/registerHelperSuccess", component: registerHelperSuccess, meta: {requiresNotAuth: true}},
  {name: "registerFarmers", path: "/registerFarmers", component: registerAgrarian, meta: {requiresNotAuth: true}},
  {name: "registerFarmerSuccess", path: "/registerFarmerSuccess", component: registerAgrarianSuccess, meta: {requiresNotAuth: true}},
  {name: "datenschutz", path: "/datenschutz", component: datenschutz},
  {name: "impressum", path: "/impressum", component: impressum},
  {name: "information", path: "/information", component: information},
  {name: "error", path:'*', component: error},
  {name: "chat", path: "/chat/:agrarianId", component: chat, meta: {requiresAuth: true}},
  {name: "inbox", path: "/inbox", component: inbox, meta: {requiresAuth: true}},
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
router.beforeEach(async (to, from, next) => {
  //muss angemeldet sein
  if(to.matched.some(record => record.meta.requiresAuth)){
    firebase.auth().onAuthStateChanged((user) => {
      if(user){
        //ist angemeldet
        if(to.matched.some(record => record.meta.requiresFarmer)){
          firebase.firestore().collection("agrarians").doc(user.uid).get().then((doc) => {
            //muss farmer sein
            if(doc.exists){
              next()
            } else {
              //ist kein farmer
            }
          })
        } else {
          //muss kein farmer sein
          next()
        }    
      } else {
        //ist nicht angemeldet
        next({name: "login"})
      }
    })
  } else if(to.matched.some(record => record.meta.requiresNotAuth)){
    firebase.auth().onAuthStateChanged((user) => {
      if(user){
        next({name: "landingPage"})
      } else {
        next()
      }
    })
  } else {
    next()
  }
})

export default router 

new Vue({
  render: h => h(App),
  vuetify,
  router
}).$mount('#app')


