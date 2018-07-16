import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'

Vue.use(VueRouter)
Vue.use(Vuex)

import routes from './routes'
import { store } from './store'

let router = new VueRouter(routes)

let app = new Vue({
    el: '#app',
    router,
    store,
    template: '<div></div>',
})
