import Vue, { VNode } from 'vue';
import { Meteor } from 'meteor/meteor';
import { DirectiveBinding } from 'vue/types/options';

/**
 * Create comment node
 * @param el
 * @param vNode
 */
function commentNode(el: HTMLElement, vNode: VNode) {
    const comment = document.createComment(' ')

    Object.defineProperty(comment, 'setAttribute', {
        value: () => undefined
    })

    vNode.text = ' '
    vNode.elm = comment
    vNode.isComment = true
    vNode.context = undefined
    vNode.tag = undefined
    if (vNode.data) {
        vNode.data.directives = undefined
    }

    if (vNode.componentInstance) {
        // @ts-ignore
        vNode.componentInstance['$el'] = comment
    }

    if (el.parentNode) {
        el.parentNode.replaceChild(comment, el)
    }
}

Vue.directive('can', function (el: HTMLElement, binding: DirectiveBinding, vNode: VNode) {
    const behaviour = binding.modifiers.disable ? 'disable' : 'hide';
    // @ts-ignore
    const hasPermission = Roles.userIsInRole(Meteor.userId(), `${binding.value}-${binding.arg}`,
        Meteor.user()?.profile.profile);
    if (!hasPermission) {
        if (behaviour === 'hide') {
            commentNode(el, vNode)
        } else if (behaviour === 'disable') {
            // @ts-ignore
            el.disabled = true
        }
    }
});
