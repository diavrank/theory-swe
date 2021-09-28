<template>
	<div>
		<div class="d-flex flex-row justify-start">
			<v-btn color="primary" icon :to="{name:'login'}">
				<v-icon>arrow_back</v-icon>
			</v-btn>
			<div class="title">Olvidé mi contraseña</div>
		</div>
		<ValidationObserver ref="forgotPasswordObserver">
			<v-form @submit.prevent="forgotPassword">
				<ValidationProvider v-slot="{errors}" name="correo electrónico" rules="email|required">
					<v-text-field v-model="user.email"
					              id="inputEmail" name="email"
					              :error-messages="errors"
					              label="Correo electrónico*"
                        data-test-id="input-email"
					              required>
					</v-text-field>
				</ValidationProvider>
				<v-btn type="submit" class="mt-2" color="primary" rounded data-test-id="recover-button">Recuperar</v-btn>
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
							this.$alert.showAlertSimple('error',
								'Ocurrió un error al enviar el correo.');
						} else {
							this.$alert.showAlertSimple('success',
								'Correo enviado! Por favor abra su correo electrónico y haga click en el link del ' +
								'mensaje que le enviamos.');
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
