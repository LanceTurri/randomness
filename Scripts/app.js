var randomGeneratorViewModel = (function () {
    function randomGeneratorViewModel() {
        var _this = this;
        this.mode = ko.observable('size');
        this.mode.subscribe(function () {
            _this.groupSize('');
            _this.groupNumber('');
        });
        this.groupSize = ko.observable('');
        this.groupNumber = ko.observable('');
        this.peopleNames = ko.observable('');
        this.peopleArray = ko.observableArray([]);
        this.randomGroupNames = [
            'Amazingness',
            'Dream Crushers',
            'Rainbow Warriors',
            'Kitten Cats',
            'Blue Fishes',
            'Raptors',
            'Monsters',
            'Agents',
            'Adventures',
            'Wolf Pack',
            'Rolling Hills',
            'Sneak Peaks',
            'Sly Mountains',
            'Groovy Grasshoppers',
            'Blushing Bamboo',
            'Farfetched Feathers'
        ];
        this.isRandomizationEnabled = ko.pureComputed(function () {
            if ((_this.mode() === 'size' && parseInt(_this.groupSize()) > 0) || (_this.mode() === 'group' && parseInt(_this.groupNumber()) > 0)) {
                return true;
            }
            return false;
        });
        this.groupSizeDisplay = ko.pureComputed(function () {
            if (_this.groupSize()) {
                return _this.groupSize();
            }
            return 'N/A';
        });
        this.groupNumberDisplay = ko.pureComputed(function () {
            if (_this.groupNumber()) {
                return _this.groupNumber();
            }
            return 'N/A';
        });
    }
    randomGeneratorViewModel.prototype.randomizePeople = function () {
        // First we split the string from the textArea into an array
        var splitArray = this.peopleNames().replace(/\r?\n|\r/g, '').replace(/[^/w/s]gi/, '').replace(',,', ',').split(',');
        // Now we randomize the array to assist with the grouping later
        var currentIndex = splitArray.length - 1;
        var randomIndex = null;
        var temporaryArrayString = null;
        // Let's randomize this array!
        while (currentIndex !== 0) {
            // Get a random number
            randomIndex = Math.floor(Math.random() * currentIndex);
            // Store temporary value from the current index
            temporaryArrayString = splitArray[currentIndex];
            // Set the current index with the random index number
            splitArray[currentIndex] = splitArray[randomIndex];
            // Set the temporary index to the random index that was just used
            splitArray[randomIndex] = temporaryArrayString;
            // Decrement index
            currentIndex -= 1;
        }
        if (this.mode() === 'size') {
            this.sizeRandomization(splitArray);
        }
        else if (this.mode() === 'group') {
            this.groupRandomization(splitArray);
        }
    };
    randomGeneratorViewModel.prototype.sizeRandomization = function (splitArray) {
        // 12 people 3 group size = 4 arrays
        var arrayCount = Math.ceil(splitArray.length / parseInt(this.groupSize()));
        // First let's build our array of arrays
        var tempArray = new Array(arrayCount);
        for (var i = 0; i < arrayCount; i++) {
            tempArray[i] = []; // Empty Array
        }
        // Now let's populate all of those arrays!
        var index = 0;
        var inrayception = 0;
        while (index < arrayCount) {
            for (var j = 0; j < parseInt(this.groupSize()); j++) {
                var currentArrayEntry = splitArray[inrayception];
                if (currentArrayEntry) {
                    tempArray[index][j] = splitArray[inrayception];
                    inrayception++;
                }
                else {
                    break;
                }
            }
            ;
            index++;
        }
        ;
        var formattedArray = this._formatGroupListing(tempArray);
        this.peopleArray(formattedArray);
    };
    randomGeneratorViewModel.prototype.groupRandomization = function (splitArray) {
        // 12 people 3 group size = 4 arrays
        var numberOfArrays = parseInt(this.groupNumber());
        var numberInEachArray = Math.ceil(splitArray.length / parseInt(this.groupNumber()));
        // First let's build our array of arrays
        var tempArray = [];
        for (var i = 0; i < numberOfArrays; i++) {
            tempArray[i] = []; // Empty Array
        }
        // Now let's populate all of those arrays!
        var tempArrayIndex = 0;
        var splitArrayIndex = 0;
        // 12 people with 3 groups needed.
        for (var i = 0; i < splitArray.length; i++) {
            var currentArrayEntry = splitArray[splitArrayIndex];
            if (currentArrayEntry) {
                tempArray[(i % numberOfArrays)][tempArrayIndex] = splitArray[splitArrayIndex];
                splitArrayIndex++;
            }
            else {
                break;
            }
            // If we have put an item into each of the arrays, increment to start over from the beginning.
            if (i > 0 && i % (numberOfArrays) === 0) {
                tempArrayIndex++;
            }
        }
        ;
        var formattedArray = this._formatGroupListing(tempArray);
        this.peopleArray(formattedArray);
    };
    randomGeneratorViewModel.prototype.getRandomGroupName = function () {
        // Once the team lead checkbox is implmented, make sure to check the state here.
        var randomTeamName = this.randomGroupNames[Math.floor(Math.random() * this.randomGroupNames.length)];
        return "Group " + randomTeamName;
    };
    randomGeneratorViewModel.prototype._formatGroupListing = function (nestedArray) {
        var formattedArray = null;
        formattedArray = nestedArray.map(function (itemArray) {
            var formattedList = {
                itemStringified: itemArray.join(', '),
                numberOfItems: itemArray.length
            };
            return formattedList;
        });
        return formattedArray;
    };
    return randomGeneratorViewModel;
}());
$(function () {
    ko.applyBindings(new randomGeneratorViewModel());
});
