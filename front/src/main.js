const PROD = true

import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'

Vue.config.productionTip = false

Vue.prototype.$socketPath = (PROD ? `sofe3770api.tk` : `localhost:3770`)

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')