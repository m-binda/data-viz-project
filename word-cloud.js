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
        var self = this;
        this.data = loadTable(
            './data/tech-diversity/race-2018.csv', 'csv', 'header',
            // Callback function to set the value
            // this.loaded to true.
            function (table) {
                self.loaded = true;
            });
    };

    this.setup = function () {
        if (!this.loaded) {
            console.log('Data not yet loaded');
            return;
        }


    };



    this.draw = function () {
        if (!this.loaded) {
            console.log('Data not yet loaded');
            return;
        }




    };
}