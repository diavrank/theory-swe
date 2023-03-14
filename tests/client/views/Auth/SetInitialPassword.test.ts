import { flushPromises, mount, VueWrapper } from '@vue/test-utils';
import { vi, expect } from 'vitest';
import SetInitialPassword from '@views/Auth/SetInitialPassword.vue';
import {
    alertMock,
    loaderMock,
    mountOptions,
    setRouteResponse,
    setRouterResponse,
    setVVRules
} from '/tests/mocks/vue-ecosystem';
import { Accounts, MockHelper } from '/tests/mocks/meteor';

vi.mock('vue-router', () => ({
    useRoute: vi.fn(),
    useRouter: vi.fn(() => ({
        push: () => {}
    }))
}));

Object.defineProperty(global, 'Accounts', {
    value: Accounts,
    writable: false,
});

describe('SetInitialPassword.vue', function () {

    let wrapper: VueWrapper;
    const push = vi.fn();
    const params = { token: '234' };

    beforeEach(() => {
        vi.spyOn(alertMock, 'showAlertSimple')
        vi.spyOn(loaderMock, 'activate')
        vi.spyOn(loaderMock, 'deactivate')

        setRouteResponse({ params });
        setRouterResponse({ push });
        setVVRules(['required', 'strength_password', 'confirmed']);
        wrapper = mount(SetInitialPassword, mountOptions);
    });

    it('should show a success message', async function () {
        const inputPassword = wrapper.find('[data-test-id="password-input"] input');
        await inputPassword.setValue('Test123!');

        const inputPasswordConfirmation = wrapper.find('[data-test-id="input-password-confirmation"] input');
        await inputPasswordConfirmation.setValue('Test123!');

        const sendButton = wrapper.find('[data-test-id="send-button"]');
        await sendButton.trigger('submit');
        await flushPromises();

        expect(loaderMock.activate).toHaveBeenCalled();
        expect(loaderMock.deactivate).toHaveBeenCalled();
        expect(alertMock.showAlertSimple).toHaveBeenCalledWith(
            'success',
            'Password reset successfully'
        );
    });

    it('should show an error message if input values are invalid', async function () {
        const inputPassword = wrapper.find('[data-test-id="password-input"] input');
        await inputPassword.setValue('123');

        const sendButton = wrapper.find('[data-test-id="send-button"]');
        await sendButton.trigger('submit');
        await flushPromises();

        expect(loaderMock.activate).not.toBeCalled();
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

    it('should show an error message if there was a server error', async function () {
        const inputPassword = wrapper.find('[data-test-id="password-input"] input');
        await inputPassword.setValue('Test123!');

        const inputPasswordConfirmation = wrapper.find('[data-test-id="input-password-confirmation"] input');
        await inputPasswordConfirmation.setValue('Test123!');

        MockHelper.mockError({ error: 403 });

        const sendButton = wrapper.find('[data-test-id="send-button"]');
        await sendButton.trigger('submit');
        await flushPromises();

        expect(loaderMock.activate).toHaveBeenCalled();
        expect(loaderMock.deactivate).toHaveBeenCalled();
        expect(alertMock.showAlertSimple).toHaveBeenCalledWith(
            'error',
            'An error occurred while resetting the password'
        );
    });
});
