import state from './state';
import mutations from './mutations';
import { NavigationState, RootState } from '@typings/vuex-store';
import { Module } from 'vuex';

const navigation: Module<NavigationState, RootState> = {
    namespaced: true,
    state,
    mutations
};

export default navigation;
