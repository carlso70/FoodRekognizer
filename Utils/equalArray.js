export default function equalArray(res1, res2) {
    /* If either object is undefined or null return false */
    if (!res1 || !res2) return false

    /* If the two objects are not the same type, return false */
    let type1 = Object.prototype.toString.call(res1);
    let type2 = Object.prototype.toString.call(res2)
    if (type1 !== type2) return false;

    /* If items are not an object or array, return false */
    if (['[object Array]', '[object Object]'].indexOf(type1) < 0) return false;

    /* Compare the length of the length of the two items */
    var res1Len = type1 === '[object Array]' ? res1.length : Object.keys(res1).length;
    var res2Len = type1 === '[object Array]' ? res2.length : Object.keys(res2).length;
    if (res1Len !== res2Len) return false;

    /* Compare the properties of the result */

    /* Compare two items */
    let compare = function (item1, item2) {
        /* Get the object type */
        var itemType = Object.prototype.toString.call(item1);

        /* If an object or array, compare recursively */
        if (['[object Array]', '[object Object]'].indexOf(itemType) >= 0) {
            if (!isEqual(item1, item2)) return false;
        } else {
            /* Otherwise, do a simple comparison */

            /* If the two items are not the same type, return false */
            if (itemType !== Object.prototype.toString.call(item2)) return false;

            /* 
             * Else if it's a function, convert to a string and compare
             * Otherwise, just compare 
             */
            if (itemType === '[object Function]') {
                if (item1.toString() !== item2.toString()) return false;
            } else {
                if (item1 !== item2) return false;
            }
        }
    };

    /* Compare properties */
    if (type === '[object Array]') {
        for (var i = 0; i < valueLen; i++) {
            if (compare(value[i], other[i]) === false) return false;
        }
    } else {
        for (var key in value) {
            if (value.hasOwnProperty(key)) {
                if (compare(value[key], other[key]) === false) return false;
            }
        }
    }
    return true
}