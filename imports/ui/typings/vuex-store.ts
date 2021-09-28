import { User } from '/imports/ui/typings/users';

interface RootState {
    version: string;
    auth: AuthState,
    temporal: TemporalState,
    navigation: NavigationState
}

interface AuthState {
    user?: User;
    isLogged: boolean;
    error: boolean;
    errorMessage: string;
}

interface TemporalState {
    element: any;
    status: boolean;
    drawer: boolean | null;
}

interface NavigationState {
    path?: string;
    _id?: string;
    title?: string;
}

export {
    RootState,
    AuthState,
    TemporalState,
    NavigationState
}
