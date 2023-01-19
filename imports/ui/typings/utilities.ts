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

export {
    ModalData,
    DatatableHeader,
    VueDraggableEvents
}
