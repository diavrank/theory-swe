<template>
  <div>
    <div v-if="loading">
      <h3>Loading. . .</h3>
    </div>
    <div v-else>
      <v-icon size="120" :color="status?'green':'red'">
        {{ status ? 'mdi:mdi-check-circle' : 'mdi:mdi-cancel' }}
      </v-icon>
      <h3 class="text-wrap">
        {{ message }}
        <small v-text="description"></small>
      </h3>
      <v-btn @click="$router.push({ name: 'login'})" color="primary" data-test-id="redirect-button">Return to login</v-btn>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Meteor } from 'meteor/meteor';

export default defineComponent({
  name: 'VerifyAccount',
  data() {
    return {
      loading: true,
      status: false,
      message: '',
      description: ''
    };
  },
  mounted() {
    const token = <string>this.$route.params.token;
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
