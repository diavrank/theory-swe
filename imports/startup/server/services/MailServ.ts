import { Meteor } from 'meteor/meteor';
// @ts-ignore
import { SSR } from 'meteor/meteorhacks:ssr';

if (Meteor.isDevelopment) {
	if (Meteor.settings.private?.SENDER_EMAILS) {
		process.env.EMAIL_SERVICES = Meteor.settings.private.SENDER_EMAILS.SERVICES;
	} else {
		console.warn('[Scaffold] - Emails sender are not configured. Emails will not be sent. ');
	}
}

const name = 'Scaffold';
const email = `<${ process.env.EMAIL_SERVICES }>`;
const from = `${ name } ${ email }`;
const emailResetPassword = 'email_reset_password.html';
const emailVerifyEmail = 'email_verify_email.html';
const emailEnrollAccount = 'email_enroll_account.html';

const productSrc = `${ process.env.ROOT_URL }/img/meteor-vue.png`;

Accounts.emailTemplates.siteName = name;
Accounts.emailTemplates.from = from;
const emailTemplates = Accounts.emailTemplates;

// Reset Password
emailTemplates.resetPassword = {
	subject() {
		return `Reset your password`;
	},
	html(_user: Meteor.User, url: string) {
		const urlWithoutHash = url.replace('#/', '');
		SSR.compileTemplate('emailResetPassword', Assets.getText(emailResetPassword));
		if (Meteor.isDevelopment) console.info(`Password reset link: ${ urlWithoutHash }`);
		return SSR.render('emailResetPassword', {
			productSrc,
			urlWithoutHash
		});
	}
};

// Enroll Account
emailTemplates.enrollAccount = {
	subject() {
		return `Welcome to ${ name }`;
	},
	html(_user: Meteor.User, url: string) {
		const urlWithoutHash = url.replace('#/', '');
		if (Meteor.isDevelopment) console.info(`Set initial password link: ${ urlWithoutHash }`);
		SSR.compileTemplate('emailEnrollAccount', Assets.getText(emailEnrollAccount));
		return SSR.render('emailEnrollAccount', {
			productSrc,
			urlWithoutHash
		});
	}
};

// Verify Email
emailTemplates.verifyEmail = {
	subject() {
		return `Verify your email`;
	},
	html(_user: Meteor.User, url: string) {
		const urlWithoutHash = url.replace('#/', '');
		if (Meteor.isDevelopment) console.info(`Verify email link: ${ urlWithoutHash }`);
		SSR.compileTemplate('emailVerifyEmail', Assets.getText(emailVerifyEmail));
		return SSR.render('emailVerifyEmail', {
			productSrc,
			urlWithoutHash
		});
	}
};

//Activate the service of Mails.
if (Meteor.isDevelopment) {
	if (Meteor.settings.private?.MAIL_URL) {
		process.env.MAIL_URL = Meteor.settings.private.MAIL_URL;
		process.env.ROOT_URL = Meteor.settings.private.ROOT_URL;
	} else {
		console.warn('[Scaffold] - Email settings are not configured. Emails will not be sent. ');
	}
}
