import { PropertyDescriptorParsingType } from '../IPropertyDescriptor';
export var WORD_BREAK;
(function (WORD_BREAK) {
    WORD_BREAK["NORMAL"] = "normal";
    WORD_BREAK["BREAK_ALL"] = "break-all";
    WORD_BREAK["KEEP_ALL"] = "keep-all";
})(WORD_BREAK || (WORD_BREAK = {}));
export const wordBreak = {
    name: 'word-break',
    initialValue: 'normal',
    prefix: false,
    type: PropertyDescriptorParsingType.IDENT_VALUE,
    parse: (wordBreak) => {
        switch (wordBreak) {
            case 'break-all':
                return WORD_BREAK.BREAK_ALL;
            case 'keep-all':
                return WORD_BREAK.KEEP_ALL;
            case 'normal':
            default:
                return WORD_BREAK.NORMAL;
        }
    }
};
