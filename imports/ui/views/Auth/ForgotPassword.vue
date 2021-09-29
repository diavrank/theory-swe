<template>
	<div>
		<div class="d-flex flex-row justify-start">
			<v-btn color="primary" icon :to="{name:'login'}">
				<v-icon>arrow_back</v-icon>
			</v-btn>
			<div class="title">Forgot my password</div>
		</div>
		<ValidationObserver ref="forgotPasswordObserver">
			<v-form @submit.prevent="forgotPassword">
				<ValidationProvider v-slot="{errors}" name="email" rules="email|required">
					<v-text-field v-model="user.email"
					              id="inputEmail" name="email"
					              :error-messages="errors"
					              label="Email*"
                        data-test-id="input-email"
					              required>
					</v-text-field>
				</ValidationProvider>
				<v-btn type="submit" class="mt-2" color="primary" rounded data-test-id="recover-button">Recover</v-btn>
			</v-form>
		</ValidationObserver>
	</div>
</template>

<script lang="ts">
	import validateForm from './../../mixins/validateForm';
	import { ValidationProvider, ValidationObserver } from 'vee-validate';
  import Vue, { VueConstructor} from 'vue';
  import AlertMessage from './../../components/Utilities/Alerts/AlertMessage.vue';
  import { Meteor } from 'meteor/meteor';
  import { Accounts } from 'meteor/accounts-base'

	export default (Vue as VueConstructor<Vue &
      InstanceType<typeof validateForm> &
      {
        $refs: {
          forgotPasswordObserver: InstanceType<typeof ValidationObserver>
        },
        $alert: InstanceType<typeof AlertMessage>
      }>).extend({
		name: 'ForgotPassword',
		mixins: [validateForm],
		components: {
			ValidationProvider,
			ValidationObserver
		},
		data() {
			return {
				user: {
					email: undefined
				}
			};
		},
		methods: {
			async forgotPassword() {
				if (await this.isFormValid(this.$refs.forgotPasswordObserver)) {
					Accounts.forgotPassword(this.user, (err: Meteor.Error | any) => {
						if (err) {
							console.error('Error sending email', err);
							this.$alert.showAlertSimple('error', 'An error occurred while sending email.');
						} else {
							this.$alert.showAlertSimple('success',
                  'Email sent! Please open your email and click on the message link that we sent.');
							setTimeout(() => {
								this.$router.push({ name: 'login' });
							}, 5000);
						}
					});

				}
			}
		}
	})
</script>

<style scoped>

</style>
