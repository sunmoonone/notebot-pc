<template>

  <v-content>
    <v-tabs
      dark
    >
      <v-tab >
        Item 1
      </v-tab>
      <v-tab-item >
        <v-card flat>
          <v-card-text>hello </v-card-text>
        </v-card>
      </v-tab-item>
      
    </v-tabs>
    </v-content>
</template>

<script>

import Editor from '@/components/Editor/Editor'

export default {
  name: 'nb-main',
  components: {
    'nb-editor': Editor
  }
}
</script>
