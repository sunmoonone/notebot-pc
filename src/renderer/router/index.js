import Vue from 'vue'
import Router from 'vue-router'
import Editor from '@/components/Editor/Editor'
import DirPane from '../components/NavBar/DirPane'
import SettingsPane from '../components/NavBar/SettingsPane'
import ProfilePane from '../components/NavBar/ProfilePane'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/dir',
      name: 'dir',
      components: { default: Editor, nav: DirPane }
    },
    {
      path: '/settings',
      name: 'settings',
      components: { default: Editor, nav: SettingsPane }
    },
    {
      path: '/profile',
      name: 'profile',
      components: { default: Editor, nav: ProfilePane }
    },
    {
      path: '/',
      redirect: '/dir'
    }
  ]
})
