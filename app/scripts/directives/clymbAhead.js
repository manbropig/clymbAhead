/**
 * Created by jamie on 2/11/15.
 */

angular.module('clymbAhead').directive('clymbAhead', function () {
    'use strict';
    return {
        restrict: 'E',
        template: '<input type="text"  class="form-control" placeholder="{{hint}}"/>',
        scope: {
            hint: '@'
        },
        link: function (scope, element, attrs) {
            if (!attrs.hint) //helper hint
                scope.hint = 'Change me with the "hint" attribute';



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
});
//& execute a function in the parent scope as opposed to the isolate scope
//= receive an object

