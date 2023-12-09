<template>
    <v-row>
        <v-col md="12">
            <v-card>
                <v-card-title>
                    <div class="text-h5">Sign document</div>
                </v-card-title>
                <v-card-text>
                    <v-file-input
                        v-model="privateKey"
                        color="deep-purple-accent-4"
                        label="Private Key"
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

                    <div class="d-flex justify-center">
                        <v-btn
                            type="button"
                            @click="signDocument"
                            color="primary"
                            variant="outlined"
                            rounded
                            depressed
                        >
                            Sign
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
    name: 'SignFile',
    data: () => ({
        privateKey: [],
        privateKeyBase64: null,
        documentToSign: [],
        documentToSignBase64: null,
    }),
    watch: {
        privateKey(newFiles: Array<File>) {
            if (newFiles && typeof FileReader != 'undefined') {
                const newFile = newFiles[0];
                const reader = new FileReader();
                reader.onload = function (ev: any) {
                    // @ts-ignore
                    this.privateKeyBase64 = ev.target.result;
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
        signDocument() {
            this.$loader.activate('Signing. . .');
            Meteor.call(
                'digitalSignature.sign',
                {
                    privateKeyBase64: this.privateKeyBase64,
                    documentBase64: this.documentToSignBase64,
                },
                (error: Meteor.Error, response: ResponseMessage) => {
                    this.$loader.deactivate();
                    if (error) {
                        console.error('Error to sign document: ', error);
                        this.$alert.showAlertSimple('error', error.reason!);
                    } else {
                        this.emitter.emit(
                            'setSignatureToVerify',
                            response.data,
                        );
                        this.$alert.showAlertSimple(
                            'success',
                            response.message!,
                        );
                    }
                },
            );
        },
    },
});
</script>

<style scoped></style>
