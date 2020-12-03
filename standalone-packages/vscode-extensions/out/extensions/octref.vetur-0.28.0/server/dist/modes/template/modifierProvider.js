"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getModifierProvider = void 0;
function genModifier(label, documentation) {
    return { label, documentation };
}
const eventModifiers = [
    genModifier('stop', 'The event propagation will be stopped.'),
    genModifier('prevent', 'The event will no longer perform default action.'),
    genModifier('capture', 'Use capture mode when adding the event listener.'),
    genModifier('self', 'Only trigger handler if `event.target` is the element itself.'),
    genModifier('once', 'The event will be triggered at most once.'),
    genModifier('passive', "Indicates that the event listener will never call `preventDefault`. Same as `addEventListener`'s `passive` option."),
    genModifier('native', 'There may be times when you want to listen directly to a native event on the root element of a component. In these cases, you can use the `.native` modifier.')
];
const keyModifiers = [
    genModifier('enter', 'Captures the <Enter> key with keycode 13.'),
    genModifier('tab', 'Captures the <Tab> key with keycode 9.'),
    genModifier('delete', 'captures both <Delete> and <Backspace> keys.'),
    genModifier('esc', 'Captures the <Escape> key with keycode 27.'),
    genModifier('space', 'Captures the <Space> key with keycode 32.'),
    genModifier('up', 'Captures the <ArrowUp> key with keycode 38.'),
    genModifier('down', 'Captures the <ArrowDown> key with keycode 40.'),
    genModifier('left', 'Captures the <ArrowLeft> key with keycode 37.'),
    genModifier('right', 'Captures the <ArrowRight> key with keycode 39.')
];
const mouseModifiers = [
    genModifier('left', 'Triggers mouse event when "left" mouse button is clicked.'),
    genModifier('right', 'Triggers mouse event when "right" mouse button is clicked.'),
    genModifier('middle', 'Triggers mouse event when "middle" mouse button is clicked.')
];
const systemModifiers = [
    genModifier('ctrl', 'Triggers mouse or keyboard event when <Control> is pressed.'),
    genModifier('alt', 'Triggers mouse or keyboard event when <Alt> is pressed.'),
    genModifier('shift', 'Triggers mouse or keyboard event when <Shift> is pressed.'),
    genModifier('meta', 'Triggers mouse or keyboard event when <Meta> is pressed.'),
    genModifier('exact', 'The `.exact` modifier allows control of the exact combination of system modifiers needed to trigger an event.')
];
const propsModifiers = [genModifier('sync')];
const vModelModifiers = [
    genModifier('lazy', 'By default, `v-model` syncs the input with the data after each input event. You can add the `lazy` modifier to instead sync after change events'),
    genModifier('number', 'If you want user input to be automatically typecast as a number, you can add the `number` modifier to your `v-model` managed inputs.'),
    genModifier('trim', 'If you want whitespace from user input to be trimmed automatically, you can add the `trim` modifier to your `v-model`-managed inputs.')
];
function getModifierProvider() {
    return {
        eventModifiers: {
            items: eventModifiers,
            priority: 1
        },
        keyModifiers: {
            items: keyModifiers,
            priority: 2
        },
        mouseModifiers: {
            items: mouseModifiers,
            priority: 2
        },
        systemModifiers: {
            items: systemModifiers,
            priority: 3
        },
        propsModifiers: {
            items: propsModifiers,
            priority: 1
        },
        vModelModifiers: {
            items: vModelModifiers,
            priority: 1
        }
    };
}
exports.getModifierProvider = getModifierProvider;
//# sourceMappingURL=modifierProvider.js.map