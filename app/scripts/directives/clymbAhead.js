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

 /*
    added by Kyle: dictionary service for creating a dictionary trie datastructure
 */
clymbAhead.directive('clymbAhead', function ($http, $compile, DictionarySrvc) {
    'use strict';
    return {
        restrict: 'E',
        //replace: true,
        /*ADDED BY KYLE:
            made template file for the searching
        */
        templateUrl: "views/searchTemplate.html",
        scope: {
            hint: '@',
            amount: '@',
            size:'@'
        },
        link: function (scope, element, attrs) {
            if (!attrs.hint) //helper hint
                scope.hint = 'Change me with the "hint" attribute';
            if (!attrs.amount) scope.amount = 5;
            if(!attrs.size) scope.size = '25px';
            scope.htmlStack = [];//stack to hold the second half of the HTML for the tree
            $http.get('data/dictionary.JSON')
                .success(function (data, status, headers, config) {
                    scope.dictionary = data.dictionary;

                    /*
                        ADDED BY Kyle dictionarytrie datastructure
                    */
                    scope.dictionary2 = DictionarySrvc.createDictionary(data.dictionary);
                    /*
                        END ADDED BY Kyle
                    */
                }).
                error(function (data, status, headers, config) {
                    console.log(status);
                });

            //this is where we start!
            scope.$watch('input', function (value) {
                //TODO:trying to remove the whole thing after each input change - not yet working
                if (value) {
                    //calculate all possible next letters based on letters before the last typed character
                    //or based on scope.input
                    var results = findPossibilities(scope.input);
                    console.log(results); 
                    /*
                        EDITED BY Kyle
                            changed scope.output to a new function that generates table html
                    */
                    scope.output = generateOutputHtml(scope.input, scope.dictionary2);
                    var elem = angular.element(scope.output);
                    var compiled = $compile(elem);
                    scope.compiled = compiled;
                    /*ADDED By Kyle
                        Instead of appending to the element, it now rewrites a div with class
                        .clymb-ahead-table so that there is only 1 single line for input text
                    */
                    angular.element(".clymb-ahead-table").html(compiled(scope));
                }
                else scope.output = "";
            });

            /**
             * PROBABLY NEEDS TO BE RECURSIVE AS WELL
             * generate the output HTML to display onscreen
             * @param results
             */
            var getOutputHTML = function(results) {
                scope.output = scope.input;
                //var width = 100/results.length + "%";
                //var html = '<div style="width:100%; font-size:{{size}};text-align: center">' +
                //        '<div class="node">'+scope.output +'</div>';

                //TODO: call a recursive function here to get HTML inside above and below html vars
                //TODO: maybe better yet, give each node an "html" attribute as you create it



                return getTreeHTML(scope.output);

                //return html;
            };

            var getTreeHTML = function(output) {
                //I think it should be a tree, but pretty tired so maybe not. I'm gonna try.
                //OR maybe tables within tables!
                /*
                Might need 2 conjoined recursive functions,
                one to make the tables and one to make the nodes
                */

                var nodeHTML = '<table class="treeTable"><tr><td><div class="node">'+scope.input+'</div>';
                var nodeEND = '</td></tr></table>';


                return nodeHTML + nodeEND;
            };

            /**
             * Recursive function
             * creates an array of possible next letters, with those letter's next letters, etc...
             * @param input - user input
             * @returns {} somewhat of a tree like object
             */
            var findPossibilities = function (input) {
                var words2Finish = [];
                var inputChar = {words2Finish:[]};// input char has an array of possible endings
                var len = input.length;
                //loop through entire dictionary and find matches from beginning to end of input
                for (var i = 0; i < scope.dictionary.length; i++) { //TODO find a way to make more efficient
                    var word = scope.dictionary[i].toLowerCase();
                    if (word.substr(0, len) === input.toLowerCase()) inputChar.words2Finish.push(word)
                }
                if (inputChar.words2Finish.length < 2) {//if 1 or less words2finish
                    inputChar.nextLevel = [words2Finish[0]];//the next level has the rest of the string instead of a char
                    inputChar.begHTML = ''+ //and the HTML will just be a table with 1 row containing that string
                    '<table class="treeTable"> ' +
                        '<tr> ' +
                            '<td>' +
                                '<div class="node">'+inputChar.nextLevel+'</div>' +
                            '</td> ' +
                        '</tr> ' +
                    '</table>';
                }
                else {
                    inputChar.value = input.substr(len - 1, len);
                    inputChar.nextLevel = scoreNextLetters(input.length, inputChar.words2Finish);

                    /*
                    If a node has 2 or more kids
                        gen a table with 1 row for it's header node and another for its kids
                        a second row for its kids
                            # <td>'s == number of kids
                     */

                    inputChar.begHTML = ''+
                    '<div class="node">'+inputChar.letter+'</div>'+
                    '<table class="treeTable">'+
                        '<tr>'+
                            '<td>';

                    for (var i = 0; i < inputChar.nextLevel.length; i++) { //for each next possible char, get IT'S next possible char
                        var next = inputChar.nextLevel[i];
                        next.html = ''+
                        '<div class="node">'+inputChar.value+'</div>'+
                        '<table class="treeTable">'+
                            '<tr>'+
                                '<td>';
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
            /**MIGHT NEED LATER?
             * gets the top {{amount}} of characters based on scoring alg
             * @param amount
             * @param scores
             */
            var getNextChars = function (amount, scores) {
                var nextChars = [];
                var topChars = scores.slice(0, scope.amount);
                for (var i = 0; i < topChars.length; i++) nextChars.push(topChars[i].letter);
            };

/*
    ADDED BY Kyle
*/
            /*
                Generate HTML and based on the input. Creates table with the first row
                as the input and looks through the dictionary tire to see if the word is 
                there.
            */
            var generateOutputHtml = function(input, dictionary){
                if(input.length>0){
                    var currentTrie = dictionary[input.charAt(0).toLowerCase()];
                    for(var i=1; i<input.length && currentTrie!=null; i++){
                        currentTrie = currentTrie[input.charAt(i)];
                    }
                    var html = 
                            htmlTableOpen +
                                htmlTdOpen +
                                    htmlNodeGenerator(input) +
                                    generateTableHtml(currentTrie)+
                                htmlTdClose+
                            htmlTableClose;
                    return html;
                }
            }
            /*
                Recursively goes through the trie to find possible words based
                on the input. Uses a depth first search
            */
            var generateTableHtml = function(node){
                if(node==null || node.remainder.length==0){
                    return "";
                }
                if(node.remainder.length==1){
                    var t = htmlTableOpen + 
                                htmlTdOpen + 
                                    htmlNodeGenerator(node.remainder[0]) + 
                                htmlTdClose + 
                            htmlTableClose;
                    return t;
                }
                var generatedTable = htmlTableOpen;
                for(var key in node){
                    if(key !=="remainder"){
                       var generatedTd = 
                            htmlTdOpen + 
                                htmlNodeGenerator(key) +
                                generateTableHtml(node[key]) +
                            htmlTdClose;
                       generatedTable+=generatedTd;
                    }
                }

                generatedTable +=htmlTableClose;
                return generatedTable;
            };

            /*
                Constants/helpers used to generate table html in generator functions;
            */
            var htmlTableOpen = '<table class="treeTable"> <tr> ';
            var htmlTableClose = '</tr> </table>'; 
            var htmlTdOpen = '<td>';
            var htmlTdClose = '</td>';
            var htmlNodeGenerator = function(val){
               return '<div class="node">'+ val +'</div>'
            }
/*
    END ADDED BY Kyle
*/
        }
    };
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
