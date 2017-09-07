import Vue from 'vue'
import VueRouter from 'vue-router'

import store from '../store'
import {CHANGE_TOKEN, SET_KEY} from '../modules/auth/actions'

import FormPage from '../modules/form/form.vue'
import AuthPage from '../modules/auth/auth.vue'
import Offers from '../modules/offers/offers.vue'
import Orders from '../modules/orders/orders.vue'
import Search from '../modules/search/search.vue'
import Profile from '../modules/profile/profile.vue'

import {getUserInfo} from '../modules/auth/actions.js'

Vue.use(VueRouter);

const Router = new VueRouter({
    history: false,
    routes: [
        {
            path: '/',
            name: 'start',
            redirect: {name: 'form-page'}
        },
        {
            path: '/form',
            name: 'form-page',
            component: FormPage,
            children: [
                {
                    path: 'offers',
                    name: 'offers',
                    component: Offers
                },
                {
                    path: 'orders',
                    name: 'orders',
                    component: Orders
                },
                {
                    path: 'search',
                    name: 'search',
                    component: Search
                },
                {
                    path: 'profile',
                    name: 'profile',
                    component: Profile
                }
            ]
        },
        {
            path: '/login',
            name: 'auth-page',
            component: AuthPage
        }
    ]
})

Router.beforeEach((to, from, next) => {
    if (to.name === 'auth-page')
        next()
    const failure = () => next({
        name: 'auth-page',
        query: {next: to.path}
    })
    const token = window.localStorage.getItem('immla-front-token');
    const key = window.localStorage.getItem('immla-network-key');
    if (!token) {
        failure()
        return
    }
    getUserInfo().then((res) => {
        if (res.data.success) {
            next()
            store.commit(CHANGE_TOKEN, token)
            store.commit(SET_KEY, key);
            return
        }
        failure()
    }).catch(() => {
        failure()
    })
})
export default Router
