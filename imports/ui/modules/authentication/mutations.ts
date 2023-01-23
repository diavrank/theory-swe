import { User } from '@typings/users';
import { AuthState } from '@typings/vuex-store';
import { MutationTree } from 'vuex';

const setUser = (state: any, user: User) => {
    state.user = user;
    state.isLogged = true;
    state.error = false;
    state.errorMessage = ''
};

const logout = (state: any) => {
    state.user = null;
    state.isLogged = false;
};

const authError = (state: any, error: number) => {

    if (error === 403) {
        state.errorMessage = 'Incorrect credentials';
    }

    state.error = true;
    state.user = null;
    state.isLogged = false;
};

const mutations: MutationTree<AuthState> = {
    setUser,
    logout,
    authError
};

export default mutations;
