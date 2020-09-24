define(['../string/lpad'], function(lpad){

    /**
     * Add padding zeros if n.length < minLength.
     */
    function pad(n, minLength){
        return lpad(''+ n, minLength, '0');
    }

    return pad;

});
