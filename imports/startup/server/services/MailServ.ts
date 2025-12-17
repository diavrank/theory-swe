import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';

type MailpitSettings = {
	HOST?: string;
	PORT?: number;
	USER?: string;
	PASSWORD?: string;
};

const mailpitConfig: MailpitSettings | undefined = Meteor.settings.private?.MAILPIT;

const getMailpitMailUrl = (config?: MailpitSettings) => {
	if (!config?.HOST || !config?.PORT) return undefined;

	const hasPassword = typeof config.PASSWORD === 'string' && config.PASSWORD.length > 0;
	const hasUser = typeof config.USER === 'string' && config.USER.length > 0;

	if (!hasUser) return `smtp://${config.HOST}:${config.PORT}`;

	const encodedUser = encodeURIComponent(config.USER);
	const encodedPassword = hasPassword ? encodeURIComponent(config.PASSWORD) : undefined;
	const credentials = encodedPassword ? `${encodedUser}:${encodedPassword}@` : `${encodedUser}@`;

	return `smtp://${credentials}${config.HOST}:${config.PORT}`;
};

const applyRootUrlFromSettings = () => {
	const rootUrl = Meteor.settings.private?.ROOT_URL;
	if (rootUrl) process.env.ROOT_URL = rootUrl;
};

if (Meteor.isDevelopment) {
	if (Meteor.settings.private?.SENDER_EMAILS) {
		process.env.EMAIL_SERVICES = Meteor.settings.private.SENDER_EMAILS.SERVICES;
	} else {
		console.warn('[Scaffold] - Emails sender are not configured. Emails will not be sent. ');
	}
}

const name = 'Scaffold';
const email = `<${process.env.EMAIL_SERVICES}>`;
const from = `${name} ${email}`;
const emailResetPassword = 'email_reset_password.html';
const emailVerifyEmail = 'email_verify_email.html';
const emailEnrollAccount = 'email_enroll_account.html';

const productSrc = `${process.env.ROOT_URL}/img/meteor-vue.png`;

Accounts.emailTemplates.siteName = name;
Accounts.emailTemplates.from = from;
const emailTemplates = Accounts.emailTemplates;

// Reset Password
emailTemplates.resetPassword = {
	subject() {
		return `Reset your password`;
	},
	async html(_user: Meteor.User, url: string) {
		const urlWithoutHash = url.replace('#/', '');
		const emailResetPasswordTemplate = await Assets.getTextAsync(emailResetPassword);
		SSR.compileTemplate('emailResetPassword', emailResetPasswordTemplate);
		if (Meteor.isDevelopment) console.info(`Password reset link: ${urlWithoutHash}`);
		return SSR.render('emailResetPassword', {
			productSrc,
			urlWithoutHash
		});
	}
};

// Enroll Account
emailTemplates.enrollAccount = {
	subject() {
		return `Welcome to ${name}`;
	},
	async html(_user: Meteor.User, url: string) {
		const urlWithoutHash = url.replace('#/', '');
		if (Meteor.isDevelopment) console.info(`Set initial password link: ${urlWithoutHash}`);
		const emailEnrollAccountTemplate = await Assets.getTextAsync(emailEnrollAccount);
		SSR.compileTemplate('emailEnrollAccount', emailEnrollAccountTemplate);
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
	async html(_user: Meteor.User, url: string) {
		const urlWithoutHash = url.replace('#/', '');
		if (Meteor.isDevelopment) console.info(`Verify email link: ${urlWithoutHash}`);
		const emailVerifyEmailTemplate = await Assets.getTextAsync(emailVerifyEmail);
		SSR.compileTemplate('emailVerifyEmail', emailVerifyEmailTemplate);
		return SSR.render('emailVerifyEmail', {
			productSrc,
			urlWithoutHash
		});
	}
};

//Activate the service of Mails.
if (Meteor.isDevelopment) {
	const mailpitMailUrl = getMailpitMailUrl(mailpitConfig);
	const settingsMailUrl = Meteor.settings.private?.MAIL_URL;

	if (mailpitMailUrl) {
		process.env.MAIL_URL = mailpitMailUrl;
		applyRootUrlFromSettings();
		console.info(`[Scaffold] - Mailpit configured at ${mailpitConfig?.HOST}:${mailpitConfig?.PORT}`);
	} else if (settingsMailUrl) {
		process.env.MAIL_URL = settingsMailUrl;
		applyRootUrlFromSettings();
	} else {
		console.warn('[Scaffold] - Email settings are not configured. Emails will not be sent. ');
	}
}
