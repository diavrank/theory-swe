<template>
	<div>
		<div class="title">Establecer contraseña</div>
		<ValidationObserver ref="setPasswordFormObserver">
			<v-form @submit.prevent="setPassword">
				<ValidationProvider v-slot="{errors}" name="nueva contraseña"
				                    rules="required|min:8|strength_password"
				                    vid="password">
					<v-text-field v-model="user.password" id="inputNewPassword"
					              :type="showPass.new ? 'text' : 'password'"
					              name="password"
					              :error-messages="errors"
					              label="Nueva contraseña"
                        data-test-id="password-input"
					              autocomplete="new-password">
						<template v-slot:append>
							<v-btn icon @click="showPass.new = !showPass.new" tabindex="-1">
								<v-icon v-if="!showPass.new">mdi-eye</v-icon>
								<v-icon v-else>mdi-eye-off</v-icon>
							</v-btn>
						</template>
					</v-text-field>
				</ValidationProvider>
				<ValidationProvider v-slot="{errors}" name="confirmar contraseña" rules="required|confirmed:password">
					<v-text-field v-model="user.confirmPassword" id="inputConfirmPassword"
					              :type="showPass.confirm ? 'text' : 'password'"
					              :error-messages="errors"
					              name="password_confirmation"
					              label="Confirmar contraseña"
                        data-test-id="input-password-confirmation"
					              required>
						<template v-slot:append>
							<v-btn icon @click="showPass.confirm = !showPass.confirm" tabindex="-1">
								<v-icon v-if="!showPass.confirm">mdi-eye</v-icon>
								<v-icon v-else>mdi-eye-off</v-icon>
							</v-btn>
						</template>
					</v-text-field>
				</ValidationProvider>
				<div class="d-flex justify-start mt-2">
					<v-btn type="submit" color="primary" rounded data-test-id="send-button">Enviar</v-btn>
				</div>
			</v-form>
		</ValidationObserver>
	</div>
</template>

<script lang="ts">
	import { ValidationProvider, ValidationObserver } from 'vee-validate';
  import Vue , { VueConstructor } from 'vue';
  import validateForm from './../../mixins/validateForm';
  import AlertMessage from './../../components/Utilities/Alerts/AlertMessage.vue';
  import { Accounts } from 'meteor/accounts-base';
  import { Meteor } from 'meteor/meteor';

	export default (Vue as VueConstructor<Vue &
      InstanceType<typeof validateForm> &
      {
        $refs: {
          setPasswordFormObserver: InstanceType<typeof ValidationObserver>
        },
        $alert: InstanceType<typeof AlertMessage>
      }
      >).extend( {
		name: 'SetInitialPassword',
		components: {
			ValidationProvider,
			ValidationObserver
		},
		mixins: [validateForm],
		data() {
			return {
				user: {
					password: null,
					confirmPassword: null
				},
				showPass: {
					new: false,
					confirm: false
				}
			};
		},
		methods: {
			async setPassword() {
				if (await this.isFormValid(this.$refs.setPasswordFormObserver)) {
					const token = this.$route.params.token;
					Accounts.resetPassword(token, this.user.password || '', (err:  Error | Meteor.Error | Meteor.TypedError | undefined) => {
						if (err) {
							console.error('An error occurred while setting the password\n', err);
							this.$alert.showAlertSimple('error', 'Se produjo un error al establecer la contraseña');
						} else {
							this.$alert.showAlertSimple('success', 'Se estableció la contraseña exitosamente');
							this.$router.push({ name: 'login' });
						}
					});
				}
			}
		}
	})
</script>

<style scoped>

</style>
