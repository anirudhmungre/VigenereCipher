import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            name: 'home',
            component: () => import('./views/Home.vue')
        },
        {
            path: '/encrypt',
            name: 'encrypt',
            component: () => import('./views/Encrypt.vue')
        },
        {
            path: '/decrypt',
            name: 'decrypt',
            component: () => import('./views/Decrypt.vue')
        },
        {
            path: '/decrypt-brute',
            name: 'bruteforce',
            component: () => import('./views/DecryptBruteforce.vue')
        },
        {
            path: '/decrypt-pso',
            name: 'pso',
            component: () => import('./views/DecryptPSO.vue')
        }
    ]
})
