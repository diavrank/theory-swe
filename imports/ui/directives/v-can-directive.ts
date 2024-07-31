import { DirectiveBinding, VNode } from 'vue';
import { Meteor } from 'meteor/meteor';

export const VCan = async function(el: HTMLElement, binding: DirectiveBinding, vNode: VNode) {
	const behaviour = binding.modifiers.disable ? 'disable' : 'hide';
	const currentUser=await Meteor.userAsync()?.profile.profile;
	// @ts-ignore
	const hasPermission = await Roles.userIsInRoleAsync(Meteor.userId(), `${ binding.value }-${ binding.arg }`,
		currentUser);
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
