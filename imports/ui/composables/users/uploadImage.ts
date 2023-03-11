import { ref, watch } from 'vue';

export const useUploadImage = (idName: string, onLoad: (ev: any) => void ) => {
    const file = ref([]);

    watch(file, (newFiles: Array<File>) => {
        if (newFiles && typeof (FileReader) != 'undefined') {
            const newFile = newFiles[0];
            const reader = new FileReader();
            reader.onload = function(ev: any) {
                onLoad(ev);
            }
            reader.readAsDataURL(newFile);
        }
    })

    const onClickUploadButton = () => {
        const fileUpload = document.getElementById(idName);
        if (fileUpload != null) {
            fileUpload.click();
        }
    }

    return {
        file,
        onClickUploadButton
    };
};
