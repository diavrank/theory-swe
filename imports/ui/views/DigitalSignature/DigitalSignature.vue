<template>
    <v-container>
        <v-row>
            <v-col>
                <h1>Digital Signature</h1>
            </v-col>
        </v-row>

        <v-row>
            <v-col cols="12" xs="12" sm="6" md="6">
                <SignFile />
            </v-col>

            <v-col cols="12" xs="12" sm="6" md="6">
                <VerifySignature />
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import SignFile from '@components/DigitalSignature/SignFile.vue';
import VerifySignature from '@components/DigitalSignature/VerifySignature.vue';

export default defineComponent({
    name: 'DigitalSignature',
    components: { VerifySignature, SignFile },
});
</script>

<style scoped></style>
