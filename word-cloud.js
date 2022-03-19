function WordCloud() {

    // Name for the visualisation to appear in the menu bar.
    this.name = 'Word Cloud - Othello';

    // Each visualisation must have a unique ID with no special
    // characters.
    this.id = 'word-cloud';

    // Property to represent whether data has been loaded.
    this.loaded = false;

    // Preload the data. This function is called automatically by the
    // gallery when a visualisation is added.
    this.preload = function () {
        let self = this;

        // How many words for the word cloud
        let numberWords = 50;

        // Loads the book and creates an array with all the words
        loadStrings('./data/word-cloud/othello.txt', (book) => {
            this.book = join(book, " ");
            this.book = splitTokens(this.book, [
                " ", ".", ",", "!", "?", "-", ";", ":", "(", ")",
                "\n", "\t"
            ]);
            // Initialize array to store words and their quantinties
            this.wordCloud = [];

            for (let i = 0; i < this.book.length; i++) {
                if ((this.wordCloud.find(x => x.name === this.book[i])) === undefined) {
                    this.wordCloud.push({
                        name: this.book[i],
                        quantity: 1
                    })
                } else {
                    this.wordCloud.find(x => x.name === this.book[i]).quantity += 1;
                }
            };
            this.wordCloud.sort((a, b) => b.quantity - a.quantity);
            this.wordCloud = this.wordCloud.slice(0, numberWords);
            self.loaded = true;
        })
    };

    this.setup = function () {
        if (!this.loaded) {
            console.log('Data not yet loaded');
            return;
        }

        // Initiate min and max text size
        this.minTextSize = 20;
        this.maxTextSize = 200;

        console.log(this.wordCloud);

        this.wordColors = [];

        for (let i = 0; i < this.wordCloud.length; i++) {
            this.wordColors.push([
                random(0, 255), random(0, 255), random(0, 255)
            ]);
        }

        console.log(width);
    };



    this.draw = function () {
        if (!this.loaded) {
            console.log('Data not yet loaded');
            return;
        }

        let maxSize = this.wordCloud[0].quantity
        let minSize = this.wordCloud[this.wordCloud.length - 1].quantity

        noStroke();

        for (let i = 0; i < this.wordCloud.length; i++) {
            let name = this.wordCloud[i].name
            let qty = this.wordCloud[i].quantity

            fill(this.wordColors[i]);
            textAlign(CENTER, CENTER);
            textSize(this.mapQtyToSize(qty, minSize, maxSize));
            text(name, width / 2, height / 2);
        }

    };

    this.mapQtyToSize = function (quantity, min, max) {
        return map(
            quantity,
            min, max,
            this.minTextSize,
            this.maxTextSize
        );
    };
}