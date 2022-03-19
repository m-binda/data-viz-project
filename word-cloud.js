function WordCloud() {

    // Name for the visualisation to appear in the menu bar.
    this.name = 'Word Cloud - Memórias Póstumas de Brás Cubas';

    // Each visualisation must have a unique ID with no special
    // characters.
    this.id = 'word-cloud';

    // Property to represent whether data has been loaded.
    this.loaded = false;

    // Preload the data. This function is called automatically by the
    // gallery when a visualisation is added.
    this.preload = function () {
        let self = this;

        // this.data = loadTable(
        //     './data/tech-diversity/race-2018.csv', 'csv', 'header',
        //     // Callback function to set the value
        //     // this.loaded to true.
        //     function (table) {
        //         self.loaded = true;
        //     });

        loadStrings('./data/word-cloud/othello.txt', (book) => {
            this.book = join(book, " ");
            this.book = splitTokens(this.book, [
                " ", ".", ",", "!", "?", "-", ";", ":", "(", ")",
                "\n", "\t"
            ]);
            self.loaded = true;
        })

    };

    this.setup = function () {
        if (!this.loaded) {
            console.log('Data not yet loaded');
            return;
        }

        this.wordCloud = {};

        for (let i = 0; i < this.book.length; i++) {

            if (!(this.book[i] in this.wordCloud)) {
                this.wordCloud[this.book[i]] = {};
                this.wordCloud[this.book[i]] = 1;
            } else {
                this.wordCloud[this.book[i]]++;
            }

        }

        console.log(this.wordCloud);

    };



    this.draw = function () {
        if (!this.loaded) {
            console.log('Data not yet loaded');
            return;
        }



    };
}