<template>
  <div align="center">
    <div v-if="loading">
      <h3>Loading. . .</h3>
    </div>
    <div v-else>
      <v-icon size="120" :color="status?'green':'red'">
        {{ status ? 'mdi-check-circle' : 'mdi-cancel' }}
      </v-icon>
      <h3 class="text-wrap">
        {{ message }}
        <small v-text="description"></small>
      </h3>
      <v-btn :to="{name:'login'}" color="primary">Return to login</v-btn>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import AlertMessage from './../../components/Utilities/Alerts/AlertMessage.vue';

export default (Vue as VueConstructor<Vue & { $alert: InstanceType<typeof AlertMessage> }>).extend({
  name: 'VerifyAccount',
  data() {
    return {
      loading: true,
      status: false,
      message: null,
      description: null
    };
  },
  mounted() {
    const token = this.$route.params.token;
    Accounts.verifyEmail(token, (errorVerifyEmail: Error | Meteor.Error | Meteor.TypedError | undefined) => {
      this.loading = false;
      if (errorVerifyEmail) {
        console.error('Verify email failed: ', errorVerifyEmail);
        this.message = 'An error occurred while verifying email';
        this.description = 'Try enroll again or use the forgot password option';
        this.status = false;
      } else {
        this.message = 'Email verified successfully. Now you can login.';
        this.status = true;
      }
    });
  }
});
</script>

<style scoped>

</style>
