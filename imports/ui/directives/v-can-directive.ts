import { DirectiveBinding, VNode } from 'vue';
import { Meteor } from 'meteor/meteor';
import {UserType} from "../../api/Users/user.entity";

export const VCan = async function(el: HTMLElement, binding: DirectiveBinding, vNode: VNode) {
	const behaviour = binding.modifiers.disable ? 'disable' : 'hide';
	const currentUser=<UserType>await Meteor.userAsync();
	const currentUserProfile = currentUser?.profile.profile;
	// @ts-ignore
	const hasPermission = await Roles.userIsInRoleAsync(Meteor.userId(), `${ binding.value }-${ binding.arg }`,
		currentUserProfile);
	if (!hasPermission) {
		if (behaviour === 'hide') {
			// @ts-ignore
			vNode.el.hidden = true;
		} else if (behaviour === 'disable') {
			// @ts-ignore
			el.disabled = true;
		}
	}
};
