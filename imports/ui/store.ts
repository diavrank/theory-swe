import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';
import auth from './modules/authentication';
import temporal from './modules/temporal';
import navigation from './modules/navigation';
import VuexPersistence from 'vuex-persist';
import { RootState } from '/imports/ui/typings/vuex-store';

Vue.use(Vuex);
const vuexLocal = new VuexPersistence({
	storage: window.localStorage,
	modules: ['auth', 'temporal', 'navigation']
});

const store: StoreOptions<RootState> = {
	modules: {
		auth,
		temporal,
		navigation
	},
	plugins: [vuexLocal.plugin]
};

export default new Vuex.Store<RootState>(store);
