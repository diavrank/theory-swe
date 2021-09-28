import state from './state';
import mutations from './mutations';
import { Module } from 'vuex';
import { AuthState, RootState } from '/imports/ui/typings/vuex-store';

const authentication: Module<AuthState, RootState> = {
    namespaced: true,
    mutations,
    state
};

export default authentication;
