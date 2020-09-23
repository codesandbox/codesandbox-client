var lpad = require('../string/lpad');

    /**
     * Add padding zeros if n.length < minLength.
     */
    function pad(n, minLength){
        return lpad(''+ n, minLength, '0');
    }

    module.exports = pad;


