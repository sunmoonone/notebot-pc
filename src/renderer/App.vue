<template>
<v-app id="app" dark>
  <nb-nav></nb-nav>
  <router-view></router-view>
</v-app>
</template>

<script>
import NavBar from './components/NavBar'
import Editor from './components/Editor'

export default {
  name: 'notebot',
  components: {
    'nb-nav': NavBar,
    'nb-editor': Editor
  },
  data: () => ({
    items: [{ icon: '$vuetify.icons.cancel', title: 'helloworld' }],
    links: [{ link: 'http://www.baidu.com' }]
  }),
  props: {
    source: String
  }
}
</script>