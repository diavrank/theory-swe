import { User } from '/imports/ui/typings/users';
import { MutationTree } from 'vuex';
import { AuthState } from '/imports/ui/typings/vuex-store';

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
        state.errorMessage = 'Credenciales incorrectas';
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
