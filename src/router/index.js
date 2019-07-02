import Vue from 'vue'
import Router from 'vue-router'
import index from '@/view/index/index'
import AboutLaws from '@/view/aboutLaws/AboutLaws'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: index
    },
    {
      path: '/aboutLaws',
      name: 'AboutLaws',
      component: AboutLaws
    }
  ]
})
