/**
 * Created by jamie on 2/11/15.
 */

clymbAhead.factory('DictionarySrvc', function () {
	//creates a trie data structure based on input dictionary
   	var createDictionary = function(dictionary){
		var trie = {};
		    for(var i=0; i<dictionary.length; i++){
		        var currentWord = dictionary[i].toLowerCase();
		        var currentObj = trie[currentWord.charAt(0)];
		        if(!currentObj){
		            trie[currentWord.charAt(0)] = {remainder:[]};
		            currentObj = trie[currentWord.charAt(0)];
		        }
		        currentObj.remainder.push(currentWord.substr(1,currentWord.length));
		        for(var j=1; j<currentWord.length; j++){
		            var currentLetter = currentWord.charAt(j);
		            if(!currentObj[currentLetter]){
		                currentObj[currentLetter]={remainder:[]};
		            }
		            currentObj=currentObj[currentLetter];
		            currentObj.remainder.push(currentWord.substr(j+1, currentWord.length));
		            
		        }
		    }
		return trie;
	};
    return {createDictionary: createDictionary}
});