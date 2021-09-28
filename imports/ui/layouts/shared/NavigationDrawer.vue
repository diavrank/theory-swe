<template>
  <v-navigation-drawer
      app
      dark
      hide-overlay
      overlay-color="#000"
      :overlay-opacity="0"
      @input="toggle($event)"
      v-model="navigationDrawer"
      src="/img/meteorImpact.jpg">
    <template v-slot:prepend>
      <div class="overlay"></div>
    </template>
    <v-list dense
            nav
            class="py-0">
      <v-list-item class="pa-5 text-center">
        <v-list-item-avatar>
          <img alt="METEOR" src="/img/meteor-vue.png" height="50px">
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>TheorySwe</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <v-divider></v-divider>
    <v-list dense nav class="py-0">
      <v-list-item-group v-model="optionSelected" active-class="active">
        <template v-for="option in options">
          <v-list-item :key="option.title" :to="{ name: option.namePath }" link>
            <v-list-item-icon>
              <v-icon>{{ option.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{ option.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-divider v-if="option.divider"></v-divider>
        </template>
      </v-list-item-group>
    </v-list>
    <footer-view></footer-view>
  </v-navigation-drawer>
</template>

<script lang="ts">
	import FooterView from './FooterView.vue';
	import { mapMutations, mapState } from 'vuex';
	import Vue from 'vue';
	import { Meteor } from 'meteor/meteor';

	interface SystemOption {
		title: string;
		namePath: string;
		icon: string;
		divider: boolean;
	}

	export default Vue.extend({
		name: 'NavigationDrawer',
		components: { FooterView },
		data: () => ({
			options: [] as SystemOption[],
			optionSelected: 0,
			navigationDrawer: null as boolean | null
		}),
		created() {
			Meteor.call('getSystemOptions', (err: Meteor.Error, options: SystemOption[]) => {
				if (err) {
					console.error('Failed to get system options', err);
				} else {
					this.options = options;
				}
			});
		},
		computed: {
			...mapState('temporal', ['drawer'])
		},
		methods: {
			...mapMutations('temporal', ['setDrawer']),
			updateSelectedOption() {
				const optionSelected = this.options.filter(option => option.namePath === this.$route.name);
				if (optionSelected.length > 0) {
					this.optionSelected = this.options.indexOf(optionSelected[0]);
				}
			},
			toggle(isShowed: boolean) {
				this.navigationDrawer = isShowed
				this.setDrawer(this.navigationDrawer);
			}
		},
		watch: {
			'$route'() {
				this.updateSelectedOption();
			},
			drawer(newValue) {
				this.navigationDrawer = newValue;
			}
		}
	})
</script>

<style scoped lang="sass">
	.overlay
		position: absolute
		background-image: linear-gradient(to right, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.5))
		width: 100%
		height: 100%

		.active
			color: white
			background-color: var(--v-accent-base)

		.theme--dark.v-list-item--active:before
			opacity: 0
</style>
