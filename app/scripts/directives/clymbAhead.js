/**
 * Created by jamie on 2/11/15.
 */

/**
 * Take user input
 *      find all matching words from length 0 -> input.length ( findPossibilities() )
 *      for each potential word2finish, get the next letter
 *          for each next letter, calculate each potential word2finish from
 *          length 0 -> input.length + # of chars added.
 */
clymbAhead.directive('clymbAhead', function ($http) {
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
            if (!attrs.amount) scope.amount = 5;

            $http.get('data/dictionary.JSON')
                .success(function (data, status, headers, config) {
                    scope.dictionary = data.dictionary;
                }).
                error(function (data, status, headers, config) {
                    console.log(status);
                });

            //this is where we start!
            scope.$watch('input', function (value) {
                if (value) {
                    //calculate all possible next letters based on letters before the last typed character
                    //or based on scope.input
                    var results = findPossibilities(scope.input, scope.dictionary);
                    //var letters = scoreNextLetters(scope.input.length, results);
                    //var nextChars = getNextChars(scope.amount, letters);
                    console.log(results);
                    //console.log(letters);
                    //find last typed char?
                    //maybe can have 2 trees? one going up and one going down if user is in the middle of text
                }
            });


            /**
             * gets all possible words2finish
             * @param input - user input
             * @returns {Array} all possible words2finish
             */
            var findPossibilities = function (input) {
                var words2Finish = [];
                var inputChar = {};
                var len = input.length;
                for (var i = 0; i < scope.dictionary.length; i++) {
                    var word = scope.dictionary[i].toLowerCase();
                    if (word.substr(0, len) === input.toLowerCase()) words2Finish.push(word)
                }
                inputChar.words2Finish = words2Finish;// input char has an array of possible endings
                //return results;
                //return scoreNextLetters(scope.input.length, results);
                if (words2Finish.length < 2) inputChar.nextLevel = [words2Finish[0]];
                else {
                    inputChar.nextLevel = scoreNextLetters(input.length, words2Finish);
                    for (var i = 0; i < inputChar.nextLevel.length; i++) { //for each next possible char, get IT'S next possible char
                        var next = inputChar.nextLevel[i];
                        var possibleInput = input + next.letter;
                        if(!next.nextLevel)
                            next.nextLevel = [];
                        var possibilities = findPossibilities(possibleInput);

                        next.nextLevel = next.nextLevel.concat(possibilities.nextLevel);

                    }
                }
                return inputChar;
            };
            /**
             * gets the top {{amount}} of characters based on scoring alg
             * @param amount
             * @param scores
             */
            var getNextChars = function (amount, scores) {
                var nextChars = [];
                var topChars = scores.slice(0, scope.amount);
                for (var i = 0; i < topChars.length; i++) nextChars.push(topChars[i].letter);
            };
            /**
             * Look at all possible words2finish and collect all of the letters after 'len' distance from 0
             * This needs a scoring procedure...
             * @returns {Array} sorted array (DESCENDING)
             */
            var scoreNextLetters = function (len, results) {
                var nextLetters = {};//make a hashtable out of all of the next letters possible
                for (var i = 0; i < results.length; i++) { //init hashtable
                    var c = results[i].charAt(len);
                    if (nextLetters.hasOwnProperty(c)) {
                        nextLetters[c]["count"]++;
                        nextLetters[c]["words"].push(results[i]);
                        nextLetters[c]["position"] = len + 1;
                    }
                    else
                        nextLetters[c] = {"count": 1, "words": [results[i]], "position": len + 1};
                }
                //TODO put recursive call into each letter object-creation for what letters, IT'S next letters will be?
                var sorted = [];//now sort and take the top {{amount}}
                for (var letter in nextLetters)
                    sorted.push({
                        "letter": letter,
                        "words": nextLetters[letter]["words"],
                        "score": nextLetters[letter]["count"],
                        "position": nextLetters[letter]["position"]
                    });
                sorted.sort(scoreComparator).reverse();
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

/**
 * take the user inputs last letter
 * get all possible next letters and words associated with them
 * if the # of possible words to complete == 1, show the entire string
 * if the # of possible words to complete == 0, you're at the end of a possible word with this char
 *      These situations may occur even if there is a longer word to complete
 *          In this case, color the node differently?
 *          i.e. "call" and "calling" => "call" is a complete word even though there is a longer possible word to fin
 *
 *  Take user input
 *      find all matching words from length 0 -> input.length
 *      for each potential word2finish, get the next letter
 *          for each next letter, calculate each potential word2finish from
 *          length 0 -> input.length + # of chars added.
 */
