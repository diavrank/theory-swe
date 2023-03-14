/**
 * @vitest-environment happy-dom
 */

import { flushPromises, mount, VueWrapper } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import Login from '@views/Auth/Login.vue';
import { createPinia, setActivePinia } from 'pinia';
import { Meteor } from 'meteor/meteor';
import { MockHelper } from '/tests/mocks/meteor';
import { mountOptions, alertMock, setVVRules, setRouterResponse, loaderMock } from '/tests/mocks/vue-ecosystem';

vi.mock('vue-router', () => ({
    useRoute: vi.fn(),
    useRouter: vi.fn(() => ({
        push: () => {}
    }))
}));

interface LoginInstance {
    user: any;
}

describe('Login.vue', () => {

    let wrapper: VueWrapper;
    const push = vi.fn();

    beforeEach(() => {
        setRouterResponse({ push });
        setActivePinia(createPinia());
        setVVRules(['required']);
        wrapper = mount(Login, mountOptions);
    });

    it('should redirects to home route if login successfully', async function () {
        vi.spyOn(Meteor, 'loginWithPassword');
        vi.spyOn(Meteor, 'logoutOtherClients');
        vi.spyOn(loaderMock, 'activate');
        vi.spyOn(loaderMock, 'deactivate');
        const instance = wrapper.vm as unknown as LoginInstance;

        const inputUser = wrapper.find('[data-test-id="input-user"] input');
        inputUser.setValue('ecabrera');

        const inputPassword = wrapper.find('[data-test-id="input-password"] input');
        inputPassword.setValue('Asdf&1234!');

        expect(instance.user.userOrEmail).toBe('ecabrera');
        expect(instance.user.password).toBe('Asdf&1234!');

        const loginButton = wrapper.find('[data-test-id="login-button"]');
        await loginButton.trigger('submit');
        await flushPromises();

        expect(loaderMock.activate).toHaveBeenCalled();
        expect(loaderMock.deactivate).toHaveBeenCalled();
        expect(Meteor.loginWithPassword).toHaveBeenCalledTimes(1);
        expect(Meteor.logoutOtherClients).toHaveBeenCalledTimes(1);
        expect(push).toHaveBeenCalledWith({ name: 'home'});
    });

    it('should call alert message component if input values are wrong', async function() {
        const inputPassword = wrapper.find('[data-test-id="input-password"] input');
        inputPassword.setValue('');

        vi.spyOn(alertMock, 'showAlertFull');
        const loginButton = wrapper.find('[data-test-id="login-button"]');
        await loginButton.trigger('submit');
        await flushPromises();
        expect(alertMock.showAlertFull).toHaveBeenCalledWith(
            'cancel',
            'error',
            'Error in the form',
            '',
            5000,
            'bottom right',
            'Please, complete all required fields with valid values.'
        );
    });

    it('should call alert message component if credentials are invalid', async function () {
        vi.spyOn(alertMock, 'showAlertFull');

        const inputUser = wrapper.find('[data-test-id="input-user"] input');
        inputUser.setValue('ecabrera');

        const inputPassword = wrapper.find('[data-test-id="input-password"] input');
        inputPassword.setValue('Asdf&1234!');

        MockHelper.mockError(new Meteor.Error(403));

        const loginButton = wrapper.find('[data-test-id="login-button"]');
        await loginButton.trigger('submit');
        await flushPromises();

        expect(alertMock.showAlertFull).toHaveBeenCalledWith(
            'mdi:mdi-close-circle',
            'error',
            'Incorrect credentials',
            '',
            5000,
            'bottom'
        );
    });

})
