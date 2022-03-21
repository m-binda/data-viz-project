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

        // Load font
        let wordFont = loadFont('assets/PTMono-Regular.ttf');

        // Initiate array for words to exclude from the cloud.
        let wordsToExclude = ['this', 'that']

        // Loads the book and creates an array with all the words
        loadStrings('./data/word-cloud/othello.txt', (book) => {
            this.wordCloud = new CloudList(book, wordFont);
            this.wordCloud.makeCloud();
            this.wordCloud.excludeWords(wordsToExclude);
            self.loaded = true;
        });

    };

    this.setup = function () {
        if (!this.loaded) {
            console.log('Data not yet loaded');
            return;
        }

        // Create a select DOM element and its title.
        this.select = createSelect();
        this.select.position(width / 1.3, height);

        // Fill the options with all quantities.
        let cloudQty = [20, 30, 40, 50];
        for (let i = 0; i < cloudQty.length; i++) {
            this.select.option(cloudQty[i]);
        }

        // Resets position every time user clicks on Word Cloud - Othello
        this.wordCloud.resetPosition();
    };

    // Removes select element.
    this.destroy = function () {
        this.select.remove();
    };

    this.draw = function () {
        if (!this.loaded) {
            console.log('Data not yet loaded');
            return;
        }

        // Define title height
        let titleHeight = 30;

        // Text for the user.
        let numberWords = this.select.value();
        fill(0);
        noStroke();
        textSize(16);
        textAlign(CENTER, CENTER);
        text("How many words in the cloud?", width / 2, height - titleHeight + 10);

        // Gets size for each word.
        this.wordCloud.updateSizes();

        // Draws the words and updates their size and position.
        this.wordCloud.drawWordCloud(titleHeight, numberWords);

        // Draw the title above the plot.
        this.drawTitleSub(titleHeight);

        // Display quantity when hovering over the words.
        this.wordCloud.displayQty(mouseX, mouseY);

    };

    // Draws the title.
    this.drawTitleSub = function (titleHeight) {

        let subtitle =
            "Hover over the words to know how many times they appear";

        fill(0);
        noStroke();
        textSize(30);
        textAlign(CENTER, CENTER);
        text(this.title, width / 2, titleHeight);

        // Subtitle
        textSize(16);
        text(subtitle, width / 2, titleHeight + 20);
    };
}