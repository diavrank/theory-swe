import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core';

export const useTemporalStore = defineStore('temporal', {
    state: () => ({
        element: <any> null,
        status: false,
        drawer: useStorage('drawer', true)
    }),
    actions: {
        setElement(element: any) {
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
