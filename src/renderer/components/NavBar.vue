<template>
<v-navigation-drawer permanent fixed left value="true" app width="280" >
<v-container fluid fill-height class="pa-0">
	<v-layout fill-height column wrap>
	  <v-flex xs12 class="icon-bar">
		<v-layout fill-height column>

		<div class="icon-item">
		<router-link flat to="/dir" icon>
		  <v-icon >folder</v-icon>
		</router-link>
		</div>
		<div class="icon-item">
		<router-link flat icon to="/settings">
		  <v-icon >settings</v-icon>
		</router-link>
		</div>
		<div class="icon-item">
		<router-link flat icon to='/profile' >
		  <v-icon>person</v-icon>
		</router-link>
		</div>
		<v-spacer></v-spacer>
		<div class="icon-item bottom">
		<router-link flat icon to='/profile' >
		  <v-icon>add</v-icon>
		</router-link>
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
  components: { 'nb-dir': DirPane, 'nb-settings': SettingsPane, 'nb-profile': ProfilePane }
}
</script>


<style lang="scss" scoped>
.icon-bar {
	padding-left: 10px;
	padding-top: 30px;
	max-width: none;
}
.icon-item{
	margin-bottom: 15px;
	&.bottom {
		margin-bottom: -85px;
	}
}

</style>
