function WordCloudViz() {

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
        let numberWords = 30;

        // Minimum length
        let wordLength = 3;

        // Load font
        this.wordFont = loadFont('assets/Roboto-Regular.ttf');

        // Loads the book and creates an array with all the words
        loadStrings('./data/word-cloud/othello.txt', (book) => {
            this.book = join(book, " ");
            this.book = splitTokens(this.book, [
                " ", ".", ",", "!", "?", "-", ";", ":", "(", ")",
                "\n", "\t", "this", "that"
            ]);
            // Initialize array to store words and their quantinties
            this.wordCloud = [];
            for (let i = 0; i < this.book.length; i++) {
                if (this.book[i].length > wordLength) {
                    if ((this.wordCloud.find(x => x.name === this.book[i].toUpperCase())) === undefined) {
                        let word = new WordCloud(
                            this.book[i].toUpperCase()
                        );
                        this.wordCloud.push(word)
                    } else {
                        this.wordCloud.find(x => x.name === this.book[i].toUpperCase()).quantity += 1;
                    }
                }
            };

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
        this.minText = 20;
        this.maxText = 100;

        // Get min and max quantity
        this.maxQty = this.wordCloud[0].quantity
        this.minQty = this.wordCloud[this.wordCloud.length - 1].quantity

    };



    this.draw = function () {
        if (!this.loaded) {
            console.log('Data not yet loaded');
            return;
        }

        for (let i = 0; i < this.wordCloud.length; i++) {
            this.wordCloud[i].updateSize(
                this.minQty, this.maxQty, this.minText, this.maxText);
            this.wordCloud[i].updateBounds(this.wordFont)

            push();
            translate(width / 2, height / 2);
            this.wordCloud[i].draw(this.wordFont);
            this.wordCloud[i].updatePos(this.wordCloud);
            pop();
        }

    };
}