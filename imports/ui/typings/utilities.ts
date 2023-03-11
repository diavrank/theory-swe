import { Meteor } from 'meteor/meteor';
import TypedError = Meteor.TypedError;

interface ModalData {
    mainNameElement?: string,
    _id?: string,
    element: any,
    typeElement?: string,
    preposition?: string
}

interface DatatableHeader {
    key: string;
    title: string;
    sortable: boolean;
    class: string[];
    filter?: Function;
    divider?: boolean;
    align?: string;
}

enum VueDraggableEvents {
    Added = 'added',
    Removed = 'removed'
}

enum Injections {
    AlertMessage = 'alert',
    Loader = 'loader',
    Emitter = 'emitter'
}

type MeteorError = Meteor.Error | Error | TypedError | undefined;

export {
    ModalData,
    DatatableHeader,
    VueDraggableEvents,
    Injections,
    MeteorError
}
