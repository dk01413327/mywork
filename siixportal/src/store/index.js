import Vue from 'vue'
import Vuex from 'vuex'
import meeting from './modules/meeting'
import user from './modules/user'
import man from './modules/man'
import custom from './modules/custom'
import warehouse from './modules/warehouse'
import others from './modules/others'
import tar from './modules/tar'
Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'


export default new Vuex.Store({
   modules: {
     user,
     meeting,
     man,
     custom,
     warehouse,
     others,
     tar,
   },

  strict: debug
})