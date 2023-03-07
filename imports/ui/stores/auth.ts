import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core';
import { User } from '@typings/users';

export interface AuthStoreType {
    user: User | undefined;
    isLogged: boolean;
    error: boolean;
    errorMessage: string;
}

export const useAuthStore = defineStore('auth', {
    state: () => ({
        // @ts-ignore
        user: <User | undefined> (useStorage('user', undefined, undefined, {
            serializer: {
                read: (v?: string) => v && v !== 'undefined' ? JSON.parse(v) : undefined,
                write: (v?: User) => v ? JSON.stringify(v) : undefined,
            },
        }) as unknown),
        isLogged: useStorage('isLogged', false),
        error: useStorage('error', false),
        errorMessage: useStorage('errorMessage', '')
    }),
    actions: {
        setUser(user: User) {
            this.user = user;
            this.isLogged = true;
            this.error = false;
            this.errorMessage = '';
        },
        logout() {
            this.user = undefined;
            this.isLogged = false;
        },
        authError(error: number) {
            if (error === 403) {
                this.errorMessage = 'Incorrect credentials';
            }
            this.error = true;
            this.user = undefined;
            this.isLogged = false;
        }
    }
})
