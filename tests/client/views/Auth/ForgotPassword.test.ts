import { flushPromises, mount, VueWrapper } from '@vue/test-utils';
import ForgotPassword from '@views/Auth/ForgotPassword.vue';
import { alertMock, mountOptions, setRouterResponse, setVVRules } from '/tests/mocks/vue-ecosystem';
import { vi, expect } from 'vitest';
import { Accounts } from 'meteor/accounts-base';
import { MockHelper } from '/tests/mocks/meteor';

vi.mock('vue-router', () => ({
    useRoute: vi.fn(),
    useRouter: vi.fn(() => ({
        push: () => {}
    }))
}));
describe('ForgotPassword.vue', function () {

    let wrapper: VueWrapper;
    const push = vi.fn();

    beforeEach(() => {
        setRouterResponse({ push });
        setVVRules(['required', 'email']);
        wrapper = mount(ForgotPassword, mountOptions);
    });

    it('should show a success message', async function () {
        vi.useFakeTimers();
        vi.spyOn(Accounts, 'forgotPassword');

        const inputUser = wrapper.find('[data-test-id="input-email"] input');
        inputUser.setValue('myemail@exmaple.com');

        const recoverButton = wrapper.find('[data-test-id="recover-button"]');
        await recoverButton.trigger('submit');
        await flushPromises();

        expect(Accounts.forgotPassword).toHaveBeenCalled();
        expect(alertMock.showAlertSimple).toHaveBeenCalledWith(
            'success',
            'Email sent! Please open your email and click on the message link that we sent'
            );
        expect(push).not.toBeCalled();
        vi.advanceTimersByTime(5000);
        expect(push).toHaveBeenCalledWith({ name: 'login'});
    });

    it('should show an error message if input is empty', async function () {
        vi.spyOn(alertMock, 'showAlertFull');

        const inputEmail = wrapper.find('[data-test-id="input-email"] input');
        inputEmail.setValue('');

        const recoverButton = wrapper.find('[data-test-id="recover-button"]');
        await recoverButton.trigger('submit');
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

    it('should show an error message if there was a server error', async function () {
        const inputUser = wrapper.find('[data-test-id="input-email"] input');
        inputUser.setValue('myemail@example.com');

        MockHelper.mockError({ error: 403 });

        const recoverButton = wrapper.find('[data-test-id="recover-button"]');
        await recoverButton.trigger('submit');
        await flushPromises();

        expect(alertMock.showAlertSimple('error', 'An error occurred while sending email'));
    });
});
