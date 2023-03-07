// Libs
import { Meteor } from 'meteor/meteor';
import { createApp } from 'vue';

// Main app
import App from '../../ui/App.vue';
import router from '../../ui/router';
import { VueMeteor } from 'vue-meteor-tracker';
import { VCan } from '/imports/ui/directives/v-can-directive';
import AlertMessage from '/imports/ui/components/Utilities/Alerts/AlertMessage.vue';
import Loader from '/imports/ui/components/Utilities/Loaders/Loader.vue';
import mitt, { Emitter, EventType } from 'mitt';
import vuetify from '../../ui/plugins/vuetify';
import { loadFonts } from '/imports/ui/plugins/webfontloader';
import '../../ui/plugins';
import filters from '/imports/ui/filters';
import { createPinia } from 'pinia';

declare module 'vue' {
	interface ComponentCustomProperties {
		$alert: typeof AlertMessage;
		$loader: typeof Loader;
		$filters: Object,
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
