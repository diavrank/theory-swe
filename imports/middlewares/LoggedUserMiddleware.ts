import { Subscription } from 'meteor/meteor';
// @ts-ignore
import { PublishMiddleware } from 'meteor/peerlibrary:middleware';

export class LoggedUserMiddleware extends PublishMiddleware {
    constructor() {
        super();
    }

    added(publish:Subscription) {
        if(publish.userId){
            return super.added(...arguments);
        }
        return publish.ready();
    }

    changed(publish:Subscription) {
        if(publish.userId){
            return super.changed(...arguments);
        }
        return publish.ready();
    }

    removed(publish:Subscription) {
        if(publish.userId){
            return super.removed(...arguments);
        }
        return publish.ready();
    }

    onReady(publish:Subscription) {
        if(publish.userId){
            return super.onReady(...arguments);
        }
        return publish.ready();
    }

    onStop(publish:Subscription) {
        if(publish.userId){
            return super.onStop(...arguments);
        }
        return publish.ready();
    }

    onError(publish:Subscription) {
        if(publish.userId){
            return super.onError(...arguments);
        }
        return publish.ready();
    }
}