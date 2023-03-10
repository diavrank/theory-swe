import { flushPromises, mount, VueWrapper } from '@vue/test-utils';
import { vi , expect, describe, it, beforeEach } from 'vitest';
import ResetPassword from '@views/Auth/ResetPassword.vue';
import {
    alertMock,
    loaderMock,
    mountOptions,
    setRouteResponse,
    setRouterResponse,
    setVVRules
} from '/tests/mocks/vue-ecosystem';
import { MockHelper } from '/tests/mocks/meteor';

vi.mock('vue-router', () => ({
    useRoute: vi.fn(),
    useRouter: vi.fn(() => ({
        push: () => {}
    }))
}));
describe('ResetPassword.vue', () => {
    let wrapper: VueWrapper;
    const push = vi.fn();
    const params = { token: '123' };

    beforeEach(() => {
        setRouterResponse({ push });
        setRouteResponse({ params });
        setVVRules(['required', 'strength_password', 'confirmed']);
        wrapper = mount(ResetPassword, mountOptions);
    });

    it('should show a success message', async function () {
        vi.spyOn(alertMock, 'showAlertSimple');

        const inputPassword = wrapper.find('[data-test-id="password-input"] input');
        inputPassword.setValue('Test123!');

        const inputPasswordConfirmation = wrapper.find('[data-test-id="input-password-confirmation"] input');
        inputPasswordConfirmation.setValue('Test123!');

        const changeButton = wrapper.find('[data-test-id="change-button"]');
        await changeButton.trigger('submit');
        await flushPromises();

        expect(loaderMock.activate).toHaveBeenCalled()
        expect(loaderMock.deactivate).toHaveBeenCalled()
        expect(alertMock.showAlertSimple).toHaveBeenCalledWith(
            'success',
            'Password reset successfully'
        );
    });

    it('should show an error message if input values are invalid', async function () {
        vi.spyOn(alertMock, 'showAlertFull');
        vi.spyOn(loaderMock, 'activate');

        const changeButton = wrapper.find('[data-test-id="change-button"]');
        await changeButton.trigger('submit');
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
        vi.spyOn(alertMock, 'showAlertSimple');

        const inputPassword = wrapper.find('[data-test-id="password-input"] input');
        inputPassword.setValue('Test123!');

        const inputPasswordConfirmation = wrapper.find('[data-test-id="input-password-confirmation"] input');
        inputPasswordConfirmation.setValue('Test123!');

        MockHelper.mockErrorFor('resetPassword', { error: 403 });

        const changeButton = wrapper.find('[data-test-id="change-button"]');
        await changeButton.trigger('submit');
        await flushPromises();

        expect(loaderMock.activate).toHaveBeenCalled()
        expect(loaderMock.deactivate).toHaveBeenCalled()
        expect(alertMock.showAlertSimple).toHaveBeenCalledWith(
            'error',
            'An error occurred while resetting the password'
        );
    });
})
