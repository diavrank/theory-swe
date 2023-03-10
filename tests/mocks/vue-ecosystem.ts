// Vee validate rules
import { vi} from 'vitest';
import { createVuetify } from 'vuetify';
import { Router, useRouter } from 'vue-router';
import { defineRule } from 'vee-validate';
import { required } from '@vee-validate/rules';

export const setRouterResponse= (options: Partial<Router>) => {
    // @ts-ignore
    vi.mocked(useRouter).mockImplementationOnce((): Partial<Router> => options);
};

export const setVVRules = (rules: string[]) => {
    rules.forEach((rule) => {
        defineRule(rule, required);
    });
};


export const alertMock = {
    closeAlert: vi.fn(),
    showAlertFull: vi.fn(),
    showAlertSimple: vi.fn()
};

export const loaderMock = {
    activate: vi.fn(),
    deactivate: vi.fn()
};

const vuetify = createVuetify();

export const mountOptions = {
    global: {
        plugins: [vuetify],
        provide: {
            alert: alertMock,
            loader: loaderMock
        }
    }
};

