<template>
    <v-snackbar
        v-model="snackbar"
        :timeout="timeout"
	  top auto-height
      >
      <v-layout row>
    <v-flex xs12 >
      <v-card>
        <v-toolbar dark>

			  <v-text-field  
		  ></v-text-field>


        </v-toolbar>

        <v-list dense>
          <template v-for="(item, index) in items">
            
            <v-divider
              v-if="item.divider"
              :key="index"
            ></v-divider>

            <v-list-tile
              v-else
              :key="item.title"
              @keydown.enter=""
            >
                <v-list-tile-title v-html="item.title"></v-list-tile-title>
            </v-list-tile>
          </template>
        </v-list> 
       </v-card>
    </v-flex>
  </v-layout> 
      </v-snackbar>
</template>

<script>
import { EventBus } from './Event'
export default {
  name: 'nb-search',
  data () {
    return {
      snackbar: false,
      timeout: 0,
      items: [
        {
          avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
          title: 'Brunch this weekend?',
          subtitle:
            "<span class='text--primary'>Ali Connors</span> &mdash; I'll be in your neighborhood doing errands this weekend. Do you want to hang out?"
        },
        { divider: true, inset: true },
        {
          avatar: 'https://cdn.vuetifyjs.com/images/lists/2.jpg',
          title: 'Summer BBQ <span class="grey--text text--lighten-1">4</span>',
          subtitle:
            "<span class='text--primary'>to Alex, Scott, Jennifer</span> &mdash; Wish I could come, but I'm out of town this weekend."
        },
        { divider: true, inset: true },
        {
          avatar: 'https://cdn.vuetifyjs.com/images/lists/3.jpg',
          title: 'Oui oui',
          subtitle:
            "<span class='text--primary'>Sandra Adams</span> &mdash; Do you have Paris recommendations? Have you ever been?"
        }
      ]
    }
  },
  created () {
    const vm = this
    EventBus.$on('openSearchPane', e => {
      vm.snackbar = true
    })
    EventBus.$on('hideSearchPane', e => {
      vm.snackbar = false
    })
  }
}
</script>
<style lang="scss">
div.v-snack__content {
  padding: 0px;
}
</style>



