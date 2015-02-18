/**
 * Created by jamie on 2/11/15.
 */

clymbAhead.directive('clymbAhead', function ($http, alphabetSrvc) {
    'use strict';
    return {
        restrict: 'E',
        template: '<input type="text" ng-model="input"  class="form-control" placeholder="{{hint}}"/>',
        scope: {
            hint: '@',
            amount: '@'
        },
        link: function (scope, element, attrs) {
            if (!attrs.hint) //helper hint
                scope.hint = 'Change me with the "hint" attribute';
            if(!attrs.amount) scope.amount = 5;

            var alphabet = alphabetSrvc.alphabet;//hashtable for alphabet

            //this is where we start!
            scope.$watch('input', function (value) {
                if (value) {
                    //calculate all possible next letters based on letters before the last typed character
                    //or based on scope.input
                    var length = scope.input.length;
                    $http.get('data/dictionary.JSON')
                        .success(function (data, status, headers, config) {
                            // this callback will be called asynchronously
                            // when the response is available
                            var results = findPossibilities(scope.input, data.dictionary);
                            var letters = scoreNextLetters(scope.input.length, results);

                            var nextChars = getNextChars(scope.amount, letters);


                            console.log(results);
                            console.log(letters);

                        }).
                        error(function (data, status, headers, config) {
                            // called asynchronously if an error occurs
                            // or server returns response with an error status.
                            console.log(status);
                        });
                    console.log(length);

                    //find last typed char?
                    //maybe can have 2 trees? one going up and one going down if user is in the middle of text
                }
            });

            var findPossibilities = function (input, dictionary) {
                var results = [];
                var len = input.length;
                for (var i = 0; i < dictionary.length; i++) {
                    var word = dictionary[i].toLowerCase();
                    if (word.substr(0, len) == input.toLowerCase()) results.push(word)
                }
                return results;
            };
            /**
             * gets the top {{amount}} of characters based on scoring alg
             * @param amount
             * @param scores
             */
            var getNextChars = function(amount, scores) {
                var nextChars = [];
                var topChars = scores.slice(0, scope.amount);
                for (var i = 0; i < topChars.length; i++) nextChars.push(topChars[i].letter);
            };
            /**
             * Look at results and collect all of the letters after 'len' distance from 0
             * This needs a scoring procedure...
             * @returns {Array} sorted array (DESCENDING)
             */
            var scoreNextLetters = function (len, results) {
                //instead of whole alphabet, just make a hashtable out of all of the next letters possible
                //on the fly
                var nextLetters = {};
                //var scores = {};
                for (var i = 0; i < results.length; i++) { //init hashtable
                    var c = results[i].charAt(len);
                    if (nextLetters.hasOwnProperty(c)){
                        nextLetters[c]["count"]++;
                        nextLetters[c]["words"].push(results[i]);
                    }
                    else
                        nextLetters[c] = {"count": 1, "words": [results[i]]};
                }

                //now sort and take the top {{amount}}
                var sorted = [];
                for (var key in nextLetters)
                    sorted.push({"letter": key, "words": nextLetters[key]["words"],"score": nextLetters[key]["count"]});

                sorted.sort(scoreComparator).reverse();//TODO make a comparator
                return sorted;

            };
            /** comparator for 2 letterObjs */
            var scoreComparator = function (a, b) {
                return a.score - b.score;
            };

            //Constructor of a Node object
            function ClimbNode(character, parentStr, words2Fin, endings) {
                this.character = character;
                this.parentStr = parentStr;
                this.words2Fin = words2Fin;
                this.endings = endings;

                /**
                 * Calculates an array of words that it can finish based on the user input and itself.
                 * You kind of just have to implement typeahead for userinput + this ClimbNode's character.
                 * Sort the array by highest score, then sort THOSE top {{#?}} by alphabetical order.
                 * Then call calcWords2Fin() with: "return this.calcWords2Fin();"
                 */
                this.calcWords2Fin = function (sorted) {
                    var nextChars = [];
                    //take the sorted array and get the first character out of the top 10 elements
                    for (var i = 0; i < sorted.length; i++) {
                        var nextChar = sorted[i].substr(0, 1);
                        nextChars.push((nextChar ? nextChar : ""));

                    }
                    return {
                        words2Fin: sorted,
                        nextChars: nextChars
                    }
                };

                /**
                 * After you calcWords2Fin,
                 * determine which letters to chose as child nodes
                 */
                this.calcChildren = function () {

                };
            };

            /**
             * Simply words with scores, used for endings to match up against when being selected
             * @constructor
             */
            function Words2Fin() {
                this.score = 0;
                this.word = "";//the actual word
            };
        }
    };

    /*
     dude says I'm going to go get groceries and comes back with 3 days worth of Panda Express
     */
});
//& execute a function in the parent scope as opposed to the isolate scope
//= receive an object

