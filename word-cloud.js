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

        // Minimum length
        let wordLength = 3;

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
                if (this.book[i].length > wordLength) {
                    if ((this.wordCloud.find(x => x.name === this.book[i].toUpperCase())) === undefined) {
                        this.wordCloud.push({
                            name: this.book[i].toUpperCase(),
                            quantity: 1
                        })
                    } else {
                        this.wordCloud.find(x => x.name === this.book[i].toUpperCase()).quantity += 1;
                    }
                }
            };

            this.monoFont;
            this.monoFont = loadFont('assets/PTMono-Regular.ttf');

            this.wordCloud.sort((a, b) => b.quantity - a.quantity);
            this.wordCloud = this.wordCloud.slice(0, numberWords);
            self.loaded = true;
        });

    };

    this.setup = function () {
        if (!this.loaded) {
            console.log('Data not yet loaded');
            return;
        }

        // Initiate min and max text size
        this.minTextSize = 40;
        this.maxTextSize = 150;

        this.wordColors = [];

        for (let i = 0; i < this.wordCloud.length; i++) {
            this.wordColors.push([
                random(0, 255), random(0, 255), random(0, 255)
            ]);
        }

    };



    this.draw = function () {
        if (!this.loaded) {
            console.log('Data not yet loaded');
            return;
        }

        let maxSize = this.wordCloud[0].quantity
        let minSize = this.wordCloud[this.wordCloud.length - 1].quantity

        noStroke();
        textFont(this.monoFont);
        let textLimits = [];



        for (let i = 0; i < this.wordCloud.length; i++) {
            let name = this.wordCloud[i].name
            let qty = this.wordCloud[i].quantity
            let size = this.mapQtyToSize(qty, minSize, maxSize)

            push();
            translate(width / 2, height / 2);
            fill(this.wordColors[i]);
            textAlign(CENTER, CENTER);
            textSize(size);
            text(name, 0, 0);

            textLimits.push(this.monoFont.textBounds(name, 0, 0, size))

            fill(100, 100, 100, 100);
            rect(textLimits[i].x, textLimits[i].y, textLimits[i].w, textLimits[i].h);
            pop();
        }

        // console.log(textLimits);

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