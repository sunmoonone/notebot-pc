<template>
<v-app id="app" 
	@keydown.ctrl.80.exact.stop="dialog = true"
	dark
>
  <nb-nav></nb-nav>
  <nb-main></nb-main>
  <nb-search :dialog="dialog"></nb-search>
</v-app>
</template>

<script>
import NavBar from './components/NavBar'
import Main from './components/Main'
import SearchPane from './components/SearchPane'
import DefaultSettings from './Settings'

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
    dialog: false,
    keyMap: []
  }),
  props: {
    source: String
  },
  methods: {
    onkeyup (e) {
      /*
	    altKey : false
		ctrlKey : false
		metaKey : false
		shiftKey : false
		key : "p"
		code : "KeyP"
		keyCode : 80
		which : 80
		*/
      if (e.which === 17 || e.which === 16 || e.which === 18 || e.which === 27) {
        this.keyMap = {}
      } else if (17 in this.keyMap) {
        this.keyMap[17][e.which] = false
      }
    },
    onkeydown (e) {
      console.log(e)
      if (e.which === 17) {
        this.keyMap[17] = []
      } else if (17 in this.keyMap) {
        this.keyMap[17][e.which] = true
      }

      if (this.keyMap[17] && this.keyMap[17][80]) {
        console.log('ctrl+p')
        this.$emit('ctrl.p')
      }
    },
    tryEmit () {
      let pressed = '.'.join(this.keyMap)
      let km = DefaultSettings.keyMap
      for (var k of Object.keys(km)) {
        if (km[k] === pressed) {
          this.$emit(k)
        }
      }
    }
  },
  created () {
    document.onkeyup = this.onkeyup
    document.onkeydown = this.onkeydown
  }
}
</script>