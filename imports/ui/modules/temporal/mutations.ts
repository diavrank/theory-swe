import { MutationTree } from 'vuex';
import { TemporalState } from '@typings/vuex-store';

const setElement = (state: any, element: any) => {
    state.element = element;
};

const setStatus = (state: any, status: boolean) => {
    state.status = status;
};

const clearElement = (state: any) => {
    state.element = null;
    state.status = null;
};

const setDrawer = (state: any, drawer: any) => {
    state.drawer = drawer;
}

const mutations: MutationTree<TemporalState> = {
    setElement,
    setStatus,
    clearElement,
    setDrawer
}

export default mutations;
