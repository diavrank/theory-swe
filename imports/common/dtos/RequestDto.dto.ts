import { Meteor } from 'meteor/meteor';
import MethodInvocation = DDPCommon.MethodInvocation;

export class RequestDto {
    constructor(requestDto: RequestDto) {
        for (const [field, value] of Object.entries(requestDto)) {
            // @ts-ignore
            this[field] = value;
        }
    }

    send(methodInvocation: MethodInvocation, callback: Function) {
        try {
            callback();
        } catch (exception) {
            console.error(`${methodInvocation.name}: `, exception);
            throw new Meteor.Error(
                '403',
                'The information entered is not valid',
            );
        }
    }
}
