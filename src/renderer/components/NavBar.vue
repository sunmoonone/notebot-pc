<template>
<v-navigation-drawer permanent fixed left value="true" app width="280" >
<v-container fluid fill-height class="pa-0">
	<v-layout fill-height column wrap>
	  <v-flex xs12 class="icon-bar theme--dark">
		<v-layout fill-height column class="icon-bar-layout">

		<div class="icon-item">
		<router-link flat icon to='/profile' >
		  <v-icon large>mdi-account-circle</v-icon>
		</router-link>
		</div>
		<div class="icon-item">
		<router-link flat to="/dir" icon>
		  <v-icon >mdi-folder</v-icon>
		</router-link>
		</div>
		<div class="icon-item">
		<router-link flat to="/dir" icon>
		  <v-icon >mdi-calendar-text</v-icon>
		</router-link>
		</div>
		<div class="icon-item">
		<router-link flat icon to="/settings">
		  <v-icon >mdi-settings</v-icon>
		</router-link>
		</div>
		<v-spacer></v-spacer>
		<div class="icon-item">
		<router-link flat icon to='/profile' >
		  <v-icon>mdi-sync</v-icon>
		</router-link>
		</div>
		<div class="icon-item bottom">
		<v-menu offset-y top>
		  <v-btn flat icon slot="activator" >
			  <v-icon>mdi-plus</v-icon>
		  </v-btn>
		  <v-list>
			<v-list-tile
			  v-for="(item, index) in items"
			  :key="index"
			  @click="onAddClick(item.action)"
			>
			  <v-list-tile-title>{{ item.title }}</v-list-tile-title>
			</v-list-tile>
		  </v-list>
		</v-menu>
		</div>
		</v-layout>			
	 </v-flex>           
	 <v-flex xs12 fill-height>
	  <router-view name="nav"></router-view>
	 </v-flex>
	</v-layout>
  </v-container>
</v-navigation-drawer>
</template>

<script>

import DirPane from './NavBar/DirPane'
import SettingsPane from './NavBar/SettingsPane'
import ProfilePane from './NavBar/ProfilePane'

export default {
  name: 'nb-nav',
  components: { 'nb-dir': DirPane, 'nb-settings': SettingsPane, 'nb-profile': ProfilePane },
  methods: {
    onAddClick (action) {
      console.log(action)
    }
  },
  data: () => {
    return {
      items: [
        {
          title: 'Folder',
          action: 'addFolder'
        },
        {
          title: 'Topic plan',
          action: 'addTopicPlan'
        },
        {
          title: 'Rich text',
          action: 'addRichText'
        },
        {
          title: 'Markdown',
          action: 'addMarkDown'
        }
      ]
    }
  }
}
</script>


<style lang="scss" scoped>
.v-navigation-drawer{
	padding:0px
}
.icon-bar {
	padding-top: 20px;
	max-width: none;

	.icon-bar-layout {
		align-items: center;
	}
	&.theme--dark{
		border-right: 1px solid hsla(0,0%,100%,.12);
	}
	&.theme--light{
		border-right: 1px solid rgba(0,0,0,.12);
	}
}
.icon-item{
	margin-bottom: 15px;
	a {
		text-decoration: none;
	}
}

</style>
