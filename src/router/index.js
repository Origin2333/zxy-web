import Vue from 'vue'
import Router from 'vue-router'
import index from '@/view/index/index'
import AboutLaws from '@/view/aboutLaws/AboutLaws'
import MainPage from '@/view/mainPage/MainPage'
import AllData from '@/view/allData/AllData'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'mainPage',
      component: MainPage,
      children: [
        {path: '/', name: 'index', component: index},
        {path: '/index', name: 'index', component: index},
        {path: '/aboutLaws', name: 'aboutLaws', component: AboutLaws},
        {path: '/allData', name: 'allData', component: AllData}
      ]
    }
  ]
})
