import state from '/imports/ui/modules/temporal/state';
import mutations from './mutations';
import { Module } from 'vuex';
import { RootState, TemporalState } from '@typings/vuex-store';

const temporal: Module<TemporalState, RootState> = {
    namespaced: true,
    mutations,
    state
};

export default temporal;
