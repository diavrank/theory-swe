import helmet from 'helmet';
import { Meteor } from 'meteor/meteor';
import { WebApp } from 'meteor/webapp';

Meteor.startup(() => {
	// Sets "X-Frame-Options: SAMEORIGIN"
	WebApp.handlers.use(helmet.frameguard());
	// Sets "X-Content-Type-Options: nosniff"
	WebApp.handlers.use(helmet.noSniff());
	// Sets "X-XSS-Protection: 0"
	WebApp.handlers.use(helmet.xssFilter());
});
