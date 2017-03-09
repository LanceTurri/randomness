var RandomGenerator = function() {
    var self = this;

    self.mode = ko.observable('size');
    self.groupSize = ko.observable();
    self.groupNumber = ko.observable();
    self.peopleNames = ko.observable('');
    self.peopleArray = ko.observableArray([]);

    self.isRandomizationEnabled = ko.pureComputed(function () {
        if ((self.mode() === 'size' && self.groupSize() > 0) || (self.mode() === 'group' && self.groupNumber() > 0)) {
            return true;
        }

        return false;
    });

    self.groupSizeDisplay = ko.pureComputed(function () {
        if (self.groupSize()) {
            return self.groupSize();
        }

        return 'N/A';
    });

    self.groupNumberDisplay = ko.pureComputed(function () {
        if (self.groupNumber()) {
            return self.groupNumber();
        }

        return 'N/A';
    });

    self.randomizePeople = function() {
        // First we split the string from the textArea into an array
        var splitArray = self.peopleNames().replace(/\r?\n|\r/, '').replace(/[^/w/s]gi/, '').split(',');

        // Now we randomize the array to assist with the grouping later
        var currentIndex = splitArray.length - 1;
        var randomIndex = null;
        var temporaryIndex = null;

        // Let's randomize this array!
        while (currentIndex !== 0) {
            // Get a random number
            randomIndex = Math.floor(Math.random() * currentIndex);

            // Store temporary value from the current index
            temporaryIndex = splitArray[currentIndex];

            // Set the current index with the random index number
            splitArray[currentIndex] = splitArray[randomIndex];

            // Set the temporary index to the random index that was just used
            splitArray[randomIndex] = temporaryIndex;

            // Decrement index
            currentIndex -= 1;
        }

        if(self.mode() === 'size') {
            sizeRandomization(splitArray);
        } else if(self.mode() === 'group') {
            groupRandomization(splitArray);
        }
    }

    function sizeRandomization(splitArray) {
        // 12 people 3 group size = 4 arrays
        var arrayCount = Math.ceil(splitArray.length / self.groupSize());

        // First let's build our array of arrays
        var tempArray = new Array(arrayCount);

        for (var i = 0; i < arrayCount; i++) {
            tempArray[i] = []; // Empty Array
        }

        // Now let's populate all of those arrays!
        var index = 0;
        var inrayception = 0;

        while (index < arrayCount) {
            for (var j = 0; j < self.groupSize(); j++) {
                var currentArrayEntry = splitArray[inrayception]

                if( currentArrayEntry) {
                    tempArray[index][j] = splitArray[inrayception];
                    inrayception++;
                } else {
                    break;
                }
            };
            index++;
        };

        self.peopleArray(tempArray);
    }

    function groupRandomization(splitArray) {
        // 12 people 3 group size = 4 arrays
        var arrayCount = self.groupNumber();
        var arraryNumbers = Math.ceil(splitArray.length / self.groupNumber());

        // First let's build our array of arrays
        var tempArray = new Array(arrayCount);

        for (var i = 0; i < arrayCount; i++) {
            tempArray[i] = []; // Empty Array
        }

        // Now let's populate all of those arrays!
        var index = 0;
        var index2 = 0;


        // 12 people with 3 groups needed.
        for (var i = 0; i < splitArray.length; i++) {
            var currentArrayEntry = splitArray[index2]

            if(currentArrayEntry) {
                tempArray[i % (arrayCount)][index] = splitArray[index2];
                index2++;
            } else {
                break;
            }

            if(i % (arrayCount) === 0) {
                index++;
            }

        };

        self.peopleArray(tempArray);
    }
}

$(function() {
    ko.applyBindings(RandomGenerator());
});


