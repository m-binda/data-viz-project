function WordCloudViz() {

    // Name for the visualisation to appear in the menu bar.
    this.name = 'Word Cloud - Othello';

    // Each visualisation must have a unique ID with no special
    // characters.
    this.id = 'word-cloud';

    // Property to represent whether data has been loaded.
    this.loaded = false;

    // Title to display above the word cloud.
    this.title = 'Othello - Shakespeare - Word Cloud';

    // Preload the data. This function is called automatically by the
    // gallery when a visualisation is added.
    this.preload = function () {
        let self = this;



        // Minimum length
        let wordLength = 3;

        // Load font
        this.wordFont = loadFont('assets/PTMono-Regular.ttf');

        // Loads the book and creates an array with all the words
        loadStrings('./data/word-cloud/othello.txt', (book) => {
            this.book = join(book, " ");
            this.book = splitTokens(this.book, [
                " ", ".", ",", "!", "?", "-", ";", ":", "(", ")",
                "\n", "\t", "this", "that", "[_"
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
        this.maxText = 50;

        // Get min and max quantity
        this.maxQty = this.wordCloud[0].quantity
        this.minQty = this.wordCloud[this.wordCloud.length - 1].quantity

        // Create a select DOM element and its title.
        this.select = createSelect();
        this.select.position(width / 1.3, height);

        // Fill the options with all quantities.
        let cloudQty = [10, 20, 30, 40, 50, 60];
        for (let i = 0; i < cloudQty.length; i++) {
            this.select.option(cloudQty[i]);
        }

    };

    // Removes select element
    this.destroy = function () {
        this.select.remove();
    };

    this.draw = function () {
        if (!this.loaded) {
            console.log('Data not yet loaded');
            return;
        }


        // How many words for the word cloud
        let numberWords = this.select.value();
        fill(0);
        noStroke();
        textSize(16);
        textAlign(CENTER, CENTER);
        text("How many words in the cloud?", width / 2, height - 20);

        // Draws the words and updates their size and position.
        for (let i = 0; i < this.wordCloud.length; i++) {
            this.wordCloud[i].updateSize(
                this.minQty, this.maxQty,
                this.minText, this.maxText
            );
        };

        for (let i = 0; i < numberWords; i++) {
            push();
            translate(width / 2, height / 2);
            this.wordCloud[i].updateBounds(this.wordFont);
            this.wordCloud[i].draw(this.wordFont);
            this.wordCloud[i].updatePos(this.wordCloud, this.titleHeight);
            pop();
        }

        // Draw the title above the plot.
        this.drawTitle();

    };

    // Draws the title.
    this.drawTitle = function () {

        this.titleHeight = 30;
        fill(0);
        noStroke();
        textSize(30);
        textAlign(CENTER, CENTER);
        text(this.title, width / 2, this.titleHeight);
    };
}