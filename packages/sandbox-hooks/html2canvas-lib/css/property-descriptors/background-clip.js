import { PropertyDescriptorParsingType } from '../IPropertyDescriptor';
import { isIdentToken } from '../syntax/parser';
export var BACKGROUND_CLIP;
(function (BACKGROUND_CLIP) {
    BACKGROUND_CLIP[BACKGROUND_CLIP["BORDER_BOX"] = 0] = "BORDER_BOX";
    BACKGROUND_CLIP[BACKGROUND_CLIP["PADDING_BOX"] = 1] = "PADDING_BOX";
    BACKGROUND_CLIP[BACKGROUND_CLIP["CONTENT_BOX"] = 2] = "CONTENT_BOX";
})(BACKGROUND_CLIP || (BACKGROUND_CLIP = {}));
export const backgroundClip = {
    name: 'background-clip',
    initialValue: 'border-box',
    prefix: false,
    type: PropertyDescriptorParsingType.LIST,
    parse: (tokens) => {
        return tokens.map(token => {
            if (isIdentToken(token)) {
                switch (token.value) {
                    case 'padding-box':
                        return BACKGROUND_CLIP.PADDING_BOX;
                    case 'content-box':
                        return BACKGROUND_CLIP.CONTENT_BOX;
                }
            }
            return BACKGROUND_CLIP.BORDER_BOX;
        });
    }
};
