import { User } from '/imports/ui/typings/users';

let error: any = null;
let methodErrors: any = {};
let user: User = {
    _id: '1232',
    username: 'Ovsdrak',
    emails: [
        {
            address: 'erik_osva_150@hotmail.com',
            verified: true
        }
    ],
    profile: {
        _id: '12324',
        profile: 'admin',
        name: 'Erik',
    }
};

const getError = (method?: string) => {
    let result = error;
    Object.keys(methodErrors).some((key: string) => {
        if (key === method) {
            result = methodErrors[method];
            return true;
        }
    })
    return result;
};

export const MockHelper = {
    mockError(newError: any) {
        error = newError;
    },
    mockErrorFor(method: string, newError: any) {
        methodErrors[method] = newError;
    }
};
export const Meteor = {
    // @ts-ignore
    call(methodName: string, props: any, callback: Function) {
        callback(error);
    },
    // @ts-ignore
    loginWithPassword(email: string, password: string, callback: Function) {
        callback(error);
    },
    logoutOtherClients(callback: Function) {
        callback(error);
    },
    user() {
        return user;
    },
    Error: function(code: string | number) {
        // @ts-ignore
        this.error = code;
    }
    // ... more stuff you'd like to mock on the Meteor object
};

export const Accounts = {
    // @ts-ignore
    forgotPassword(username: string, callback: Function) {
        callback(getError('forgotPassword'));
    },
    // @ts-ignore
    resetPassword(token: string, password: string, callback: Function) {
        callback(getError('resetPassword'));
    },
    // @ts-ignore
    verifyEmail(token: string, callback: Function) {
        callback(getError('verifyEmail'));
    }
}

