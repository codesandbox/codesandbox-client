var toString = require('../lang/toString');
    /**
     * Add space between camelCase text.
     */
    function unCamelCase(str){
        str = toString(str);
        str = str.replace(/([a-z\xE0-\xFF])([A-Z\xC0\xDF])/g, '$1 $2')
        str = str.toLowerCase(); //add space between camelCase text
        return str;
    }
    module.exports = unCamelCase;

