import { PropertyDescriptorParsingType } from '../IPropertyDescriptor';
export var VISIBILITY;
(function (VISIBILITY) {
    VISIBILITY[VISIBILITY["VISIBLE"] = 0] = "VISIBLE";
    VISIBILITY[VISIBILITY["HIDDEN"] = 1] = "HIDDEN";
    VISIBILITY[VISIBILITY["COLLAPSE"] = 2] = "COLLAPSE";
})(VISIBILITY || (VISIBILITY = {}));
export const visibility = {
    name: 'visible',
    initialValue: 'none',
    prefix: false,
    type: PropertyDescriptorParsingType.IDENT_VALUE,
    parse: (visibility) => {
        switch (visibility) {
            case 'hidden':
                return VISIBILITY.HIDDEN;
            case 'collapse':
                return VISIBILITY.COLLAPSE;
            case 'visible':
            default:
                return VISIBILITY.VISIBLE;
        }
    }
};
