<template>
<v-app id="app1">
<v-navigation-drawer
    dark
    permanent
   fixed
   left
   value="true" 
   app
   width="65"
  >
    <v-container fluid fill-height class="pa-0">
        <v-layout fill-height column wrap>

<div>
            <v-btn flat icon color="pink">
              <v-icon>favorite</v-icon>
            </v-btn>
</div>
            <v-btn flat icon color="indigo">
              <v-icon>star</v-icon>
            </v-btn>

            <v-btn flat icon color="green">
              <v-icon>cached</v-icon>
            </v-btn>
          
			<v-spacer></v-spacer>
            <v-btn flat icon color="deep-orange">
              <v-icon>thumb_up</v-icon>
            </v-btn>

        </v-layout>
      </v-container>
  </v-navigation-drawer>
  <v-content>
      <v-container fluid fill-height>
        <v-layout justify-center align-center>
          <v-flex text-xs-center>
          <router-view></router-view>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
</v-app>
</template>

<script>
  export default {
    name: 'notebot',
    data: () => ({
      navDrawer: null,
      settingsDrawer: null,
      items: [{icon: '$vuetify.icons.cancel', title: 'helloworld'}],
      links: [{link: 'http://www.baidu.com'}]
    }),
    props: {
      source: String
    }
  }
</script>