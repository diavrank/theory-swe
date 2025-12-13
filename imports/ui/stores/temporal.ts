import { useStorage } from '@vueuse/core';
import { defineStore } from 'pinia';

export const useTemporalStore = defineStore('temporal', {
    state: () => ({
        element: <any> null,
        status: false,
        drawer: useStorage('drawer', true)
    }),
    actions: {
        setElement<T>(element: T) {
            this.element = element;
        },
        setStatus(status: boolean) {
            this.status = status;
        },
        clearElement() {
            this.element = null;
            this.status = false;
        },
        setDrawer(drawer: any) {
            this.drawer = drawer;
        }
    }
})
