import Vue from 'vue';

interface MeteorSubscription {
    [key: string]: Function | Array<string | number | boolean | any>
}

interface MeteorOption {
    $subscribe: MeteorSubscription,
    [key: string]: Function | MeteorSubscription
}

declare module 'vue/types/options' {
    interface ComponentOptions<V extends Vue> {
        meteor?: MeteorOption
    }
}
