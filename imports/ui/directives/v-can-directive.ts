import { DirectiveBinding, VNode } from 'vue';
import { Meteor } from 'meteor/meteor';

export const VCan = function(el: HTMLElement, binding: DirectiveBinding, vNode: VNode) {
	const behaviour = binding.modifiers.disable ? 'disable' : 'hide';
	// @ts-ignore
	const hasPermission = Roles.userIsInRole(Meteor.userId(), `${ binding.value }-${ binding.arg }`,
		Meteor.user()?.profile.profile);
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
