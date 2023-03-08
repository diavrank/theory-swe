export const useNullifyObject = (json: any) => {
    for (let jsonKey in json) {
        if (json[jsonKey].constructor === Number || json[jsonKey].constructor === String) {
            json[jsonKey] = null;
        } else if (json[jsonKey].constructor === Object) {
            useNullifyObject(json[jsonKey]);
        }
    }
};
