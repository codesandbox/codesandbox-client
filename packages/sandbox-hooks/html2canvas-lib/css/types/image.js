import { TokenType } from '../syntax/tokenizer';
import { linearGradient } from './functions/linear-gradient';
import { prefixLinearGradient } from './functions/-prefix-linear-gradient';
import { CacheStorage } from '../../core/cache-storage';
import { webkitGradient } from './functions/-webkit-gradient';
import { radialGradient } from './functions/radial-gradient';
import { prefixRadialGradient } from './functions/-prefix-radial-gradient';
export var CSSImageType;
(function (CSSImageType) {
    CSSImageType[CSSImageType["URL"] = 0] = "URL";
    CSSImageType[CSSImageType["LINEAR_GRADIENT"] = 1] = "LINEAR_GRADIENT";
    CSSImageType[CSSImageType["RADIAL_GRADIENT"] = 2] = "RADIAL_GRADIENT";
})(CSSImageType || (CSSImageType = {}));
export const isLinearGradient = (background) => {
    return background.type === CSSImageType.LINEAR_GRADIENT;
};
export const isRadialGradient = (background) => {
    return background.type === CSSImageType.RADIAL_GRADIENT;
};
export var CSSRadialShape;
(function (CSSRadialShape) {
    CSSRadialShape[CSSRadialShape["CIRCLE"] = 0] = "CIRCLE";
    CSSRadialShape[CSSRadialShape["ELLIPSE"] = 1] = "ELLIPSE";
})(CSSRadialShape || (CSSRadialShape = {}));
export var CSSRadialExtent;
(function (CSSRadialExtent) {
    CSSRadialExtent[CSSRadialExtent["CLOSEST_SIDE"] = 0] = "CLOSEST_SIDE";
    CSSRadialExtent[CSSRadialExtent["FARTHEST_SIDE"] = 1] = "FARTHEST_SIDE";
    CSSRadialExtent[CSSRadialExtent["CLOSEST_CORNER"] = 2] = "CLOSEST_CORNER";
    CSSRadialExtent[CSSRadialExtent["FARTHEST_CORNER"] = 3] = "FARTHEST_CORNER";
})(CSSRadialExtent || (CSSRadialExtent = {}));
export const image = {
    name: 'image',
    parse: (value) => {
        if (value.type === TokenType.URL_TOKEN) {
            const image = { url: value.value, type: CSSImageType.URL };
            CacheStorage.getInstance().addImage(value.value);
            return image;
        }
        if (value.type === TokenType.FUNCTION) {
            const imageFunction = SUPPORTED_IMAGE_FUNCTIONS[value.name];
            if (typeof imageFunction === 'undefined') {
                throw new Error(`Attempting to parse an unsupported image function "${value.name}"`);
            }
            return imageFunction(value.values);
        }
        throw new Error(`Unsupported image type`);
    }
};
export function isSupportedImage(value) {
    return value.type !== TokenType.FUNCTION || SUPPORTED_IMAGE_FUNCTIONS[value.name];
}
const SUPPORTED_IMAGE_FUNCTIONS = {
    'linear-gradient': linearGradient,
    '-moz-linear-gradient': prefixLinearGradient,
    '-ms-linear-gradient': prefixLinearGradient,
    '-o-linear-gradient': prefixLinearGradient,
    '-webkit-linear-gradient': prefixLinearGradient,
    'radial-gradient': radialGradient,
    '-moz-radial-gradient': prefixRadialGradient,
    '-ms-radial-gradient': prefixRadialGradient,
    '-o-radial-gradient': prefixRadialGradient,
    '-webkit-radial-gradient': prefixRadialGradient,
    '-webkit-gradient': webkitGradient
};
