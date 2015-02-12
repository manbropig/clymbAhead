/**
 * Created by jamie on 2/11/15.
 */

clymbAhead.factory('alphabetSrvc', function () {
    var a = 97;
    var charArray = {};
    for (var i = 0; i < 26; i++)
        charArray[String.fromCharCode(a + i)] = String.fromCharCode(a + i);
    return {alphabet: charArray}
});