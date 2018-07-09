<template>
<v-app id="app" dark>
  <nb-nav></nb-nav>
  <nb-main></nb-main>
  <nb-search></nb-search>
</v-app>
</template>

<script>
import NavBar from './components/NavBar'
import Main from './components/Main'
import SearchPane from './components/SearchPane'
import DefaultSettings from './Settings'
import {EventBus} from './components/Event'

export default {
  name: 'notebot',
  components: {
    'nb-nav': NavBar,
    'nb-main': Main,
    'nb-search': SearchPane
  },
  data: () => ({
    items: [{ icon: '$vuetify.icons.cancel', title: 'helloworld' }],
    links: [{ link: 'http://www.baidu.com' }],
    keyMap: []
  }),
  props: {
    source: String
  },
  methods: {
    onkeyup (e) {
      if (this.keyMap.indexOf(e.key) !== -1) {
        this.keyMap.splice(this.keyMap.indexOf(e.key), 1)
      }
    },
    onkeydown (e) {
      if ([16, 17, 18, 27].indexOf(e.which) !== -1 && this.keyMap.indexOf(e.key) === -1) {
        this.keyMap.push(e.key)
        this.tryEmit()
      } else if (
        (e.altKey || e.ctrlKey || e.shiftKey) &&
        this.keyMap.indexOf(e.key) === -1
      ) {
        this.keyMap.push(e.key)
        this.tryEmit()
      }
    },
    tryEmit () {
      let pressed = this.keyMap.join('.').toLowerCase()
      let km = DefaultSettings.keyMap
      for (var k of Object.keys(km)) {
        if (km[k] === pressed) {
          EventBus.$emit(k, pressed)
          console.log('emit ' + k)
        }
      }
    }
  },
  mounted () {
    document.onkeyup = this.onkeyup
    document.onkeydown = this.onkeydown
  }
}
</script>