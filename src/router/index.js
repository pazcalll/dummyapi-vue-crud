import { createRouter, createWebHistory } from "vue-router";
// import VueRouter from ''
import HelloWorld from '../components/HelloWorld.vue'
import WelcomeItem from '../components/WelcomeItem.vue'
// import process from 'process'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: HelloWorld
    }
]

const router = createRouter({
    history: createWebHistory('/'),
    routes
})

export default router