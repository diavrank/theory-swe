// Libs
import { Meteor } from 'meteor/meteor';
import Vue from 'vue';
import vuetify from '../../ui/plugins/vuetify';
import '../../ui/plugins';
import '../../ui/filters';
import '../../ui/directives';

// Main app
import App from '../../ui/App.vue';
import router from '../../ui/router';
import store from '../../ui/store';

Meteor.startup(() => {
	new Vue({
		router,
		store,
		vuetify,
		render: h => h(App)
	}).$mount('app');
});
