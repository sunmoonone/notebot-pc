<template>
<v-app id="app" dark>
  <nb-nav></nb-nav>
  <nb-main></nb-main>
</v-app>
</template>

<script>
import NavBar from './components/NavBar'
import Main from './components/Main'

export default {
  name: 'notebot',
  components: {
    'nb-nav': NavBar,
    'nb-main': Main
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