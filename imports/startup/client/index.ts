// Libs
import { Meteor } from 'meteor/meteor';
import { createApp } from 'vue';

// Main app
import mitt, { Emitter, EventType } from 'mitt';
import { createPinia } from 'pinia';
import { VueMeteor } from 'vue-meteor-tracker';
import App from '../../ui/App.vue';
import '../../ui/plugins';
import vuetify from '../../ui/plugins/vuetify';
import router from '../../ui/router';
import AlertMessage from '/imports/ui/components/Utilities/Alerts/AlertMessage.vue';
import Loader from '/imports/ui/components/Utilities/Loaders/Loader.vue';
import { VCan } from '/imports/ui/directives/v-can-directive';
import filters from '/imports/ui/filters';
import { loadFonts } from '/imports/ui/plugins/webfontloader';

declare module 'vue' {
	interface ComponentCustomProperties {
		$alert: typeof AlertMessage;
		$loader: typeof Loader;
		$filters: typeof filters,
		emitter: Emitter<Record<EventType, unknown>>;
	}
}

Meteor.startup(() => {
	loadFonts();
	const emitter = mitt();
	const pinia = createPinia();
	// @ts-ignore
	const app = createApp(App);
	app.use(pinia);
	app.use(router);
	app.use(VueMeteor);
	app.use(vuetify);
	app.directive('can', VCan);
	app.config.globalProperties.$filters = filters;
	app.config.globalProperties.emitter = emitter;
	app.mount('app');
});
