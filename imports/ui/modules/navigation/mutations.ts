import { NavigationState } from '/imports/ui/typings/vuex-store';
import { MutationTree } from 'vuex';

const setPathAndTitle = (state: any, {path, title}: {path:string, title: string}) => {
	state.path = path;
	state.title = title;
};

const setId = (state: any, {_id}: {_id: string}) => {
	state._id = _id;
};

const resetValues = (state: any) => {
	state.path = null;
	state.title = null;
};

const mutations: MutationTree<NavigationState> = {
	setPathAndTitle,
	resetValues,
	setId
};

export default mutations;
