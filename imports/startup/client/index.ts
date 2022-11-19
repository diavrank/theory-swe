// Libs
import { Meteor } from 'meteor/meteor';
import { createApp } from 'vue';

// Main app
import App from '../../ui/App.vue';
import router from '../../ui/router';
import store from '../../ui/store';
import { VueMeteor } from 'vue-meteor-tracker';
import { VCan } from '/imports/ui/directives/v-can-directive';
import AlertMessage from '/imports/ui/components/Utilities/Alerts/AlertMessage.vue';
import Loader from '/imports/ui/components/Utilities/Loaders/Loader.vue';
import { Store } from 'vuex';
import { AuthState, NavigationState, TemporalState } from '/imports/ui/typings/vuex-store';
import mitt, { Emitter, EventType } from 'mitt';
import vuetify from '../../ui/plugins/vuetify';
import { loadFonts } from '/imports/ui/plugins/webfontloader';
import '../../ui/plugins';

declare module 'vue' {
	interface ComponentCustomProperties {
		$alert: typeof AlertMessage;
		$loader: typeof Loader;
		emitter: Emitter<Record<EventType, unknown>>;
	}
}

declare module '@vue/runtime-core' {
	// Declare your own store states.
	interface State {
		auth: AuthState,
		temporal: TemporalState,
		navigation: NavigationState,
	}

	interface ComponentCustomProperties {
		$store: Store<State>;
	}
}

Meteor.startup(() => {
	loadFonts();
	const emitter = mitt();
	const app = createApp(App);
	app.use(store);
	app.use(router);
	app.use(VueMeteor);
	app.use(vuetify);
	app.directive('can', VCan);
	app.config.globalProperties.emitter = emitter;
	app.mount('app');
});
