<template>
    <v-row>
        <v-col md="12">
            <v-card>
                <v-card-title>
                    <div class="text-h5">Verify signature</div>
                </v-card-title>
                <v-card-text>
                    <v-file-input
                        v-model="publicKey"
                        color="deep-purple-accent-4"
                        label="Public Key"
                        variant="outlined"
                        prepend-icon="key"
                        :show-size="1000"
                    >
                        <template v-slot:selection="{ fileNames }">
                            <template
                                v-for="fileName in fileNames"
                                :key="fileName"
                            >
                                <v-chip
                                    color="deep-purple-accent-4"
                                    label
                                    size="small"
                                    class="me-2"
                                >
                                    {{ fileName }}
                                </v-chip>
                            </template>
                        </template>
                    </v-file-input>

                    <v-file-input
                        v-model="documentToSign"
                        color="cyan-darken-4"
                        label="File"
                        variant="outlined"
                        :show-size="1000"
                    >
                        <template v-slot:selection="{ fileNames }">
                            <template
                                v-for="fileName in fileNames"
                                :key="fileName"
                            >
                                <v-chip
                                    color="cyan-darken-4"
                                    label
                                    size="small"
                                    class="me-2"
                                >
                                    {{ fileName }}
                                </v-chip>
                            </template>
                        </template>
                    </v-file-input>

                    <v-textarea
                        name="input-7-1"
                        variant="filled"
                        label="Signature"
                        auto-grow
                        v-model="signature"
                    ></v-textarea>
                    <div class="d-flex justify-center">
                        <v-btn
                            type="button"
                            @click="verifySignature"
                            color="primary"
                            variant="outlined"
                            rounded
                            depressed
                        >
                            Verify
                        </v-btn>
                    </div>
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { ResponseMessage } from '@server/utils/ResponseMessage';

export default defineComponent({
    name: 'VerifySignature',
    data: () => ({
        publicKey: [],
        publicKeyBase64: null,
        documentToSign: [],
        documentToSignBase64: null,
        signature: '',
    }),
    mounted() {
        this.emitter.on('setSignatureToVerify', (signature) => {
            this.signature = signature as unknown as string;
        });
    },
    watch: {
        publicKey(newFiles: Array<File>) {
            if (newFiles && typeof FileReader != 'undefined') {
                const newFile = newFiles[0];
                const reader = new FileReader();
                reader.onload = function (ev: any) {
                    // @ts-ignore
                    this.publicKeyBase64 = ev.target.result;
                }.bind(this);
                reader.readAsDataURL(newFile);
            }
        },
        documentToSign(newFiles: Array<File>) {
            if (newFiles && typeof FileReader != 'undefined') {
                const newFile = newFiles[0];
                const reader = new FileReader();
                reader.onload = function (ev: any) {
                    // @ts-ignore
                    this.documentToSignBase64 = ev.target.result;
                }.bind(this);
                reader.readAsDataURL(newFile);
            }
        },
    },
    methods: {
        verifySignature() {
            this.$loader.activate('Verifying. . .');
            Meteor.call(
                'digitalSignature.verify',
                {
                    publicKeyBase64: this.publicKeyBase64,
                    documentBase64: this.documentToSignBase64,
                    signatureBase64: this.signature,
                },
                (error: Meteor.Error, response: ResponseMessage) => {
                    this.$loader.deactivate();
                    if (error) {
                        console.error('Error to sign document: ', error);
                        this.$alert.showAlertSimple('error', error.reason!);
                    } else {
                        const messageColor = response.data
                            ? 'success'
                            : 'error';
                        const message = response.data
                            ? 'The signature is valid'
                            : 'The signature is not valid';

                        this.$alert.showAlertSimple(messageColor, message);
                    }
                },
            );
        },
    },
});
</script>

<style scoped></style>
