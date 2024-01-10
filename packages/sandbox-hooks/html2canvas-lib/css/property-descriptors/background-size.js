import { PropertyDescriptorParsingType } from '../IPropertyDescriptor';
import { isIdentToken, parseFunctionArgs } from '../syntax/parser';
import { isLengthPercentage } from '../types/length-percentage';
export var BACKGROUND_SIZE;
(function (BACKGROUND_SIZE) {
    BACKGROUND_SIZE["AUTO"] = "auto";
    BACKGROUND_SIZE["CONTAIN"] = "contain";
    BACKGROUND_SIZE["COVER"] = "cover";
})(BACKGROUND_SIZE || (BACKGROUND_SIZE = {}));
export const backgroundSize = {
    name: 'background-size',
    initialValue: '0',
    prefix: false,
    type: PropertyDescriptorParsingType.LIST,
    parse: (tokens) => {
        return parseFunctionArgs(tokens).map(values => values.filter(isBackgroundSizeInfoToken));
    }
};
const isBackgroundSizeInfoToken = (value) => isIdentToken(value) || isLengthPercentage(value);
