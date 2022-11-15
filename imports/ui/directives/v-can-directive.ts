import {DirectiveBinding, VNode} from 'vue';
import {Meteor} from 'meteor/meteor';


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
    vNode.el = comment
    vNode.appContext = null
    vNode.scopeId = null
    if (vNode.dirs) {
        vNode.dirs = null
    }

    if (vNode.component) {
        // @ts-ignore
        vNode.component.el = comment
    }

    if (el.parentNode) {
        el.parentNode.replaceChild(comment, el)
    }
}

export const VCan = function (el: HTMLElement, binding: DirectiveBinding, vNode: VNode) {
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
}
