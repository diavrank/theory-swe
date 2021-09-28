import { Subscription } from 'meteor/meteor';
// @ts-ignore
import { PublishMiddleware } from 'meteor/peerlibrary:middleware';
// @ts-ignore
import { Roles } from 'meteor/alanning:roles';

export class PermissionMiddleware extends PublishMiddleware {
	private readonly permissions: string[];

	constructor(permissions: string[]) {
		super();
		this.permissions = permissions;
	}

	added(publish: Subscription) {
		if (publish.userId) {
			return super.added(...arguments);
		}
		return publish.ready();
	}

	changed(publish: Subscription) {
		if (this.checkPermission(publish.userId)) {
			return super.changed(...arguments);
		}
		return publish.ready();
	}

	removed(publish: Subscription) {
		if (this.checkPermission(publish.userId)) {
			return super.removed(...arguments);
		}
		return publish.ready();
	}

	onReady(publish: Subscription) {
		if (this.checkPermission(publish.userId)) {
			return super.onReady(...arguments);
		}
		return publish.ready();
	}

	onStop(publish: Subscription) {
		if (publish.userId) {
			return super.onStop(...arguments);
		}
		return publish.ready();
	}

	onError(publish: Subscription) {
		if (publish.userId) {
			return super.onError(...arguments);
		}
		return publish.ready();
	}

	checkPermission(idUser: string | null) {
		if (idUser) {
			const group = Roles.getScopesForUser(idUser)[0];
			return Roles.userIsInRole(idUser, this.permissions, group);
		}
		return false;
	}
}