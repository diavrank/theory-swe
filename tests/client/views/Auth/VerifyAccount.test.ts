import { flushPromises, mount, VueWrapper } from '@vue/test-utils';
import VerifyAccount from '@views/Auth/VerifyAccount.vue';
import { mountOptions } from '/tests/mocks/vue-ecosystem';
import { expect, vi } from 'vitest';
import { Accounts, MockHelper } from '/tests/mocks/meteor';

Object.defineProperty(global, 'Accounts', {
    value: Accounts,
    writable: false,
});

/**
 * Options API
 */
describe('VerifyAccount.vue', function () {
    let wrapper: VueWrapper;
    const params = { token: '123' };
    const push = vi.fn();
    mountOptions.global.mocks.$route = { params };
    mountOptions.global.mocks.$router = { push };

    it('should show a success message if the token is valid', async function () {
        wrapper = mount(VerifyAccount, mountOptions);

        let message = wrapper.find('h3');
        expect(message.text()).toBe('Loading. . .');

        await flushPromises();

        message = wrapper.find('h3');
        expect(message.text()).toBe('Email verified successfully. Now you can login.');
    });

    it('should show an error message it the token is invalid', async function () {

        MockHelper.mockError({ error: 'The token is invalid'});
        wrapper = mount(VerifyAccount, mountOptions);

        let message = wrapper.find('h3');
        expect(message.text()).toBe('Loading. . .');

        await flushPromises();

        message = wrapper.find('h3');
        expect(message.text()).contain('An error occurred while verifying email');
    });
    it('should have a button that redirects to login', async function () {
        wrapper = mount(VerifyAccount, mountOptions);

        await flushPromises();

        const button = wrapper.find('[data-test-id="redirect-button"]');
        await button.trigger('click');

        expect(push).toHaveBeenCalledWith({ name: 'login'});

    });
});
