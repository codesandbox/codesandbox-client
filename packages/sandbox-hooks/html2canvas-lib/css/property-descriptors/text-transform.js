import { PropertyDescriptorParsingType } from '../IPropertyDescriptor';
export var TEXT_TRANSFORM;
(function (TEXT_TRANSFORM) {
    TEXT_TRANSFORM[TEXT_TRANSFORM["NONE"] = 0] = "NONE";
    TEXT_TRANSFORM[TEXT_TRANSFORM["LOWERCASE"] = 1] = "LOWERCASE";
    TEXT_TRANSFORM[TEXT_TRANSFORM["UPPERCASE"] = 2] = "UPPERCASE";
    TEXT_TRANSFORM[TEXT_TRANSFORM["CAPITALIZE"] = 3] = "CAPITALIZE";
})(TEXT_TRANSFORM || (TEXT_TRANSFORM = {}));
export const textTransform = {
    name: 'text-transform',
    initialValue: 'none',
    prefix: false,
    type: PropertyDescriptorParsingType.IDENT_VALUE,
    parse: (textTransform) => {
        switch (textTransform) {
            case 'uppercase':
                return TEXT_TRANSFORM.UPPERCASE;
            case 'lowercase':
                return TEXT_TRANSFORM.LOWERCASE;
            case 'capitalize':
                return TEXT_TRANSFORM.CAPITALIZE;
        }
        return TEXT_TRANSFORM.NONE;
    }
};
