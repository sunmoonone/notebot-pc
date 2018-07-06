
<template>
<div>
    <i-button></i-button>
</div> 
   
</template>

<script>
import Vue from 'vue'
import VBtn from 'vuetify'
const TabBtn = Vue.extend({
    mixins: [VBtn],
    name: 'v-tbn',   
	props: {
		active: Boolean
    },
	methods: {
		render :function(h) {
            inner = VBtn.render.apply(this,h)
			return h('div', {}, this.$slots.default)            
		}       
   } 
   
})
export default {
	 TabBtn   
}
</script>


<style lang="scss">

</style>

