interface randomGeneratorViewModel {
    mode: KnockoutObservable<string>,
    groupSize: KnockoutObservable<string>,
    groupNumber: KnockoutObservable<string>,
    peopleNames: KnockoutObservable<string>,
    peopleArray: KnockoutObservableArray<object>,
    isRandomizationEnabled: KnockoutComputed<boolean>,
    groupSizeDisplay: KnockoutComputed<string>,
    groupNumberDisplay: KnockoutComputed<string>,
    groupNameDisplay: KnockoutComputed<string>,
    randomGroupNames: string[]
}

class randomGeneratorViewModel {
    constructor() {
        this.mode = ko.observable('size');
        this.mode.subscribe(() => {
            this.groupSize('');
            this.groupNumber('');
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
        
        this.isRandomizationEnabled = ko.pureComputed( () => {
            if ((this.mode() === 'size' && parseInt(this.groupSize()) > 0) || (this.mode() === 'group' && parseInt(this.groupNumber()) > 0)) {
                return true;
            }

            return false;
        });

        this.groupSizeDisplay = ko.pureComputed( () => {
            if (this.groupSize()) {
                return this.groupSize();
            }

            return 'N/A';
        });

        this.groupNumberDisplay = ko.pureComputed( () => {
            if (this.groupNumber()) {
                return this.groupNumber();
            }

            return 'N/A';
        });
    }

    randomizePeople() {
        // First we split the string from the textArea into an array
        let splitArray: string[] = this.peopleNames().replace(/\r?\n|\r/g, '').replace(/[^/w/s]gi/, '').replace(',,', ',').split(',');

        // Now we randomize the array to assist with the grouping later
        let currentIndex: number = splitArray.length - 1;
        let randomIndex:number = null;
        let temporaryArrayString: string = null;

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

        if(this.mode() === 'size') {
            this.sizeRandomization(splitArray);
        } else if(this.mode() === 'group') {
            this.groupRandomization(splitArray);
        }
    }
    

    sizeRandomization(splitArray: string[]): void {
        // 12 people 3 group size = 4 arrays
        let arrayCount = Math.ceil(splitArray.length / parseInt(this.groupSize()));

        // First let's build our array of arrays
        let tempArray = new Array(arrayCount);

        for (let i = 0; i < arrayCount; i++) {
            tempArray[i] = []; // Empty Array
        }

        // Now let's populate all of those arrays!
        let index = 0;
        let inrayception = 0;

        while (index < arrayCount) {
            for (let j = 0; j < parseInt(this.groupSize()); j++) {
                let currentArrayEntry = splitArray[inrayception]

                if( currentArrayEntry) {
                    tempArray[index][j] = splitArray[inrayception];
                    inrayception++;
                } else {
                    break;
                }
            };
            index++;
        };

        let formattedArray = this._formatGroupListing(tempArray)
        this.peopleArray(formattedArray);
    }

    groupRandomization(splitArray: string[]): void {
        // 12 people 3 group size = 4 arrays
        let numberOfArrays: number = parseInt(this.groupNumber());
        let numberInEachArray: number = Math.ceil(splitArray.length / parseInt(this.groupNumber()));

        // First let's build our array of arrays
        let tempArray: string[][] = [];

        for (let i = 0; i < numberOfArrays; i++) {
            tempArray[i] = []; // Empty Array
        }

        // Now let's populate all of those arrays!
        let tempArrayIndex: number = 0;
        let splitArrayIndex: number = 0;


        // 12 people with 3 groups needed.
        for (let i = 0; i < splitArray.length; i++) {
            let currentArrayEntry = splitArray[splitArrayIndex]

            if (currentArrayEntry) {
                tempArray[(i % numberOfArrays)][tempArrayIndex] = splitArray[splitArrayIndex];
                splitArrayIndex++;
            } else {
                break;
            }

            // If we have put an item into each of the arrays, increment to start over from the beginning.
            if (i > 0 && i % (numberOfArrays) === 0) {
                tempArrayIndex++;
            }

        };

        let formattedArray = this._formatGroupListing(tempArray)
        this.peopleArray(formattedArray);
    }

    getRandomGroupName() {
        // Once the team lead checkbox is implmented, make sure to check the state here.
        let randomTeamName = this.randomGroupNames[Math.floor(Math.random() * this.randomGroupNames.length)];

        return `Group ${randomTeamName}`;
    }

    _formatGroupListing(nestedArray: string[][]) {
        let formattedArray: object[] = null;
        
        formattedArray = nestedArray.map( (itemArray) => {
            let formattedList = {
                itemStringified: itemArray.join(', '),
                numberOfItems: itemArray.length
            }

            return formattedList;
        });

        return formattedArray;
    }
}

$(function() {
    ko.applyBindings(new randomGeneratorViewModel());
});
