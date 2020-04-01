import Vue from 'vue'
import App from './App.vue'

//sites
import landingPage from './pages/landingPage'
import OfferDetails from './pages/OfferDetails'
import login from './pages/login'
import offers from './pages/offers'
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
import account from './pages/account';
import feedback from './pages/feedback'

//plugins
import firebase from 'firebase/app'
import VueRouter from 'vue-router'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import vuetify from './plugins/vuetify'
import Meta from 'vue-meta'
import 'leaflet/dist/leaflet.css';

//enable plugins
Vue.use(VueRouter)
Vue.use(Vuetify)
Vue.use(Meta)

const routes = [
  {name: "landingPage", path: "/", component: landingPage},
  {name: "offers", path: "/offers", component: offers},
  {name: "offers", path: "/offers/:search", component: offers},
  {name: 'offer-details', path: "/offer/:offerId", component: OfferDetails},
  {name: "login", path: "/login", component: login, meta: {requiresNotAuth: true}},
  {name: "createOffers", path: "/createOffer", component: createOffer, meta: {requiresAuth: true, requiresFarmer: true}},
  {name: "edit-offer", path: "/editOffer/:offerId", component: editOffer, meta: {requiresAuth: true, requiresFarmer: true}},
  {name: "register", path: "/register", component: register, meta: {requiresNotAuth: true}},
  {name: "registerHelper", path: "/registerHelper", component: registerHelper, meta: {requiresNotAuth: true}},
  {name: "registerHelperSuccess", path: "/registerHelperSuccess", component: registerHelperSuccess, meta: {requiresNotAuth: true}},
  {name: "registerFarmers", path: "/registerFarmers", component: registerAgrarian, meta: {requiresNotAuth: true}},
  {name: "registerFarmerSuccess", path: "/registerFarmerSuccess", component: registerAgrarianSuccess, meta: {requiresNotAuth: true}},
  {name: "datenschutz", path: "/datenschutz", component: datenschutz},
  {name: "impressum", path: "/impressum", component: impressum},
  {name: "information", path: "/information", component: information},
  {name: "feedback", path: "/feedback", component: feedback},
  {name: "error", path:'*', component: error},
  {name: "chat", path: "/chat/:agrarianId", component: chat, meta: {requiresAuth: true}},
  {name: "account", path: "/account", component: account, meta: {requiresAuth: true}},
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

// Initialize Firebase

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


