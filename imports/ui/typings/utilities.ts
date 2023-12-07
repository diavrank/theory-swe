interface ModalData {
    mainNameElement?: string,
    _id?: string,
    element: any,
    typeElement?: string,
    preposition?: string
}

interface DatatableHeader {
    readonly key: string;
    readonly title: string;
    readonly sortable: boolean;
    readonly class: string[];
    readonly filter?: Function;
    readonly divider?: boolean;
    readonly align?: string;
}

enum VueDraggableEvents {
    Added = 'added',
    Removed = 'removed'
}

export {
    ModalData,
    DatatableHeader,
    VueDraggableEvents
}
