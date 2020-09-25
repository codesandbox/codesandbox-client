

    /**
     * Converts number into currency format
     */
    var currencyFormatter = {

        create : function($nDecimalDigits, $decimalSeparator, $thousandsSeparator){

            var format = function (val, nDecimalDigits, decimalSeparator, thousandsSeparator) {
                //defaults will be bound inside the closure, only way to replace
                //them is by creating a new instance (avoids undesired side-effect)
                nDecimalDigits = nDecimalDigits == null? $nDecimalDigits : nDecimalDigits;
                decimalSeparator = decimalSeparator == null? $decimalSeparator : decimalSeparator;
                thousandsSeparator = thousandsSeparator == null? $thousandsSeparator : thousandsSeparator;

                //can't use enforce precision since it returns a number and we are
                //doing a RegExp over the string
                var fixed = val.toFixed(nDecimalDigits),
                    //separate begin [$1], middle [$2] and decimal digits [$4]
                    parts = new RegExp('^(-?\\d{1,3})((?:\\d{3})+)(\\.(\\d{'+ nDecimalDigits +'}))?$').exec( fixed );

                if(parts){ //val >= 1000 || val <= -1000
                    return parts[1] + parts[2].replace(/\d{3}/g, thousandsSeparator + '$&') + (parts[4] ? decimalSeparator + parts[4] : '');
                }else{
                    return fixed.replace('.', decimalSeparator);
                }
            };

            //inception
            format.create = currencyFormatter.create;

            return format;
        }
    };

    module.exports = currencyFormatter.create(2, '.', ',');


