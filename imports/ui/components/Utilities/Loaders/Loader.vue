<template>
    <v-dialog v-model="loader"
              hide-overlay
              persistent
              width="300">
        <v-card color="primary" dark>
            <v-card-text>
                {{progressLabel}}
                <v-progress-linear indeterminate color="white" class="mb-0">
                </v-progress-linear>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script lang="ts">
import {defineComponent} from 'vue';

    export default defineComponent({
        name:"Loader",
        data(){
            return{
                loader:false,
                progressLabel:''
            }
        },
        methods:{
            activate(progressLabel = 'Loading...') {
                this.loader = true;
                this.progressLabel = progressLabel;
            },
            deactivate(){
                this.loader = false;
            }
        }
    })
</script>

<style scoped>

</style>
