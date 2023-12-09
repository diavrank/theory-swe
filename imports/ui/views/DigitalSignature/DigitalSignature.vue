<template>
    <v-container>
        <v-row>
            <v-col>
                <h1>Digital Signature</h1>
            </v-col>
        </v-row>

        <v-row>
            <v-col cols="12" md="12">
                <v-card>
                    <v-card-title>
                        Instructions to generate the keys
                    </v-card-title>
                    <v-card-text>
                        Create your own private key with following command:
                        <v-code class="ma-4">
                            openssl genpkey -algorithm RSA -pkeyopt
                            rsa_keygen_bits:4096 -pkeyopt rsa_keygen_pubexp:3
                            -out privateKey.pem
                        </v-code>
                        Create your public key for above private key:
                        <v-code class="ma-4">
                            openssl pkey -in privateKey.pem -out publicKey.pem
                            -pubout
                        </v-code>
                    </v-card-text>
                </v-card>
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
