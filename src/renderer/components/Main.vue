<template>

  <v-content>
    

      <v-tabs
        v-model="currentItem"
        fixed-tabs
        dark
      >
        <v-tab
          v-for="item in items"
          :href="'#tab-' + item"
          :key="item"
        >
          {{ item }}
        </v-tab>

        <v-menu
          v-if="more.length"
          left
        >
          <a slot="activator" >
            <v-icon>add</v-icon>
          </a>

          <v-list>
            <v-list-tile
              v-for="item in more"
              :key="item"
              @click="addItem(item)"
            >
              {{ item }}
            </v-list-tile>
          </v-list>
        </v-menu>

    <v-tabs-items v-model="currentItem">
      <v-tab-item
        v-for="item in items"
        :id="'tab-' + item"
        :key="item"
      >
        <v-card flat>
          <v-card-text>
            <h2>{{ item }}</h2>
            {{ text }}
          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
    
      </v-tabs>
  </v-content>
</template>

<script>
import Editor from '@/components/Editor/Editor'

export default {
  name: 'nb-main',
  components: {
    'nb-editor': Editor
  },
  data: () => ({
    currentItem: 'tab-Web',
    items: [
      'Web', 'Shopping', 'Videos', 'Images'
    ],
    more: [
      'News', 'Maps', 'Books', 'Flights', 'Apps'
    ],
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
  }),
  methods: {
    addItem (item) {
      const removed = this.items.splice(0, 1)
      this.items.push(
        ...this.more.splice(this.more.indexOf(item), 1)
      )
      this.more.push(...removed)
      this.$nextTick(() => { this.currentItem = 'tab-' + item })
    }
  }
}
</script>
