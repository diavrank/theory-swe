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
                        v-model="signature"
                        color="cyan-darken-4"
                        label="Signature"
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
                    <v-btn type="submit" color="primary" variant="outlined" rounded depressed>
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

export default defineComponent({
    name: 'VerifySignature',
    data: () => ({
        publicKey: [],
        signature: [],
    }),
});
</script>

<style scoped></style>
