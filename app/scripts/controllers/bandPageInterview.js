// Defined below is a data structure called venueSchedules.
// It consists of a list of venues (performance sites).
// Each venue has a list of shows. A show occurs on a date and
// contains of a list of bands performing at different times.
//
// Your job is to fill in the following function:

//loop thru venueSched array
//find each bandName
//put name into a hashtable mapping to a bandSchedule

function venueSchedulesToBandSchedules(venueSchedules) {
    // TODO: convert to bandSchedules
    var bandSchedules = {}; // {}
    for (var i = 0; i < venueSchedules.length; i++) {
        var venueName = venueSchedules[i].venueName; //string
        var shows = venueSchedules[i].shows; //array
        //now look at a show's sets to find a bandName and dates
        for (var show = 0; show < shows.length; show++) {
            var showDate = shows[show].date;
            var sets = shows[show].sets;//array of times and bands as obj
            for (var s = 0; s < sets.length; s++) {
                var band = sets[s].bandName;
                var showTime = sets[s].time;
                if (!bandSchedules.hasOwnProperty(band)) {
                    //have all you need to make 1 elem of bandSchedule
                    var bandSched = {
                        "bandName": band,
                        "shows": [{
                            "datetime": showDate + "T" + showTime,
                            "venueName": venueName
                        }]
                    };
                    bandSchedules[band] = bandSched;
                } else { //if hashtable DOES have the key
                    //then just add to the shows array
                    bandSchedules[band]["shows"].push({
                        "datetime": showDate + "T" + showTime,
                        "venueName": venueName
                    });
                }
            }
        }
    }
    //convert hashtable into an array
    var results = [];
    for(var key in bandSchedules){
        results.push(bandSchedules[key]);
    }
    return results;
}

// This function needs to convert the venueSchedules data structure
// into a bandSchedules data structure. The output will be a list of
// bands, with each band having a list of shows containing the
// venue and datetime of their performance.
//
// In other words, the output should look like this:
/*

 [
 {
 "bandName": "Ratatat",
 "shows": [
 {
 "datetime": "2015-01-02T21:00",
 "venueName": "The Independent"
 },
 {
 "datetime": "2015-01-17T23:00",
 "venueName": "The Warfield"
 }
 ]
 },
 {
 "bandName": "MGMT",
 "shows": [
 {
 "datetime": "2015-01-02T22:00",
 "venueName": "The Independent"
 },
 {
 "datetime": "2015-01-10T23:00",
 "venueName": "The Fillmore"
 },
 {
 "datetime": "2015-01-23T22:00",
 "venueName": "The Warfield"
 }
 ]
 },
 ... etc ...

 */
// Here is the input:

var venueSchedules = [{
    venueName: 'The Independent',
    shows: [{
        date: '2015-01-02',
        sets: [{
            time: '21:00',
            bandName: 'Ratatat'
        }, {
            time: '22:00',
            bandName: 'MGMT'
        }, {
            time: '23:00',
            bandName: 'Vampire Weekend'
        }]
    }, {
        date: '2015-01-03',
        sets: [{
            time: '22:00',
            bandName: 'Foster the People'
        }, {
            time: '23:00',
            bandName: 'Miike Snow'
        }]
    }]
}, {
    venueName: 'The Fillmore',
    shows: [{
        date: '2015-01-10',
        sets: [{
            time: '22:00',
            bandName: 'Yeasayer'
        }, {
            time: '23:00',
            bandName: 'MGMT'
        }]
    }, {
        date: '2015-01-16',
        sets: [{
            time: '21:00',
            bandName: 'Vampire Weekend'
        }, {
            time: '22:00',
            bandName: 'The Shins'
        }, {
            time: '23:00',
            bandName: 'Arcade Fire'
        }]
    }]
}, {
    venueName: 'The Warfield',
    shows: [{
        date: '2015-01-17',
        sets: [{
            time: '22:00',
            bandName: 'Miike Snow'
        }, {
            time: '23:00',
            bandName: 'Ratatat'
        }]
    }, {
        date: '2015-01-23',
        sets: [{
            time: '21:00',
            bandName: 'Arcade Fire'
        }, {
            time: '22:00',
            bandName: 'MGMT'
        }, {
            time: '23:00',
            bandName: 'The Shins'
        }]
    }, {
        date: '2015-01-24',
        sets: [{
            time: '22:00',
            bandName: 'Foster the People'
        }, {
            time: '23:00',
            bandName: 'The Shins'
        }]
    }]
}];

var bandSchedules = venueSchedulesToBandSchedules(venueSchedules);
var prettyBandSchedules = JSON.stringify(bandSchedules, null, 2);
console.log(prettyBandSchedules);



