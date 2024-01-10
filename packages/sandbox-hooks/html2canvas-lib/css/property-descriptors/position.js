import { PropertyDescriptorParsingType } from '../IPropertyDescriptor';
export var POSITION;
(function (POSITION) {
    POSITION[POSITION["STATIC"] = 0] = "STATIC";
    POSITION[POSITION["RELATIVE"] = 1] = "RELATIVE";
    POSITION[POSITION["ABSOLUTE"] = 2] = "ABSOLUTE";
    POSITION[POSITION["FIXED"] = 3] = "FIXED";
    POSITION[POSITION["STICKY"] = 4] = "STICKY";
})(POSITION || (POSITION = {}));
export const position = {
    name: 'position',
    initialValue: 'static',
    prefix: false,
    type: PropertyDescriptorParsingType.IDENT_VALUE,
    parse: (position) => {
        switch (position) {
            case 'relative':
                return POSITION.RELATIVE;
            case 'absolute':
                return POSITION.ABSOLUTE;
            case 'fixed':
                return POSITION.FIXED;
            case 'sticky':
                return POSITION.STICKY;
        }
        return POSITION.STATIC;
    }
};
