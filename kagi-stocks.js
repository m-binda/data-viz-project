function KagiStocks() {
    // Name for the visualisation to appear in the menu bar.
    this.name = 'Stocks in Kagi Chart';

    // Each visualisation must have a unique ID with no special
    // characters.
    this.id = 'kagi-charts';

    // Title to display above the plot.
    this.title = 'Stocks in Kagi Chart - 2021';

    // Private variables
    let marginSize = 50;

    // Layout object to store all common plot layout parameters and
    // methods.
    this.layout = {
        marginSize: marginSize,

        // Locations of margin positions. Left and bottom have double margin
        // size due to axis and tick labels.
        leftMargin: marginSize * 2,
        rightMargin: width - marginSize,
        topMargin: marginSize,
        bottomMargin: height - marginSize * 2,
        pad: 5,

        plotWidth: function () {
            return this.rightMargin - this.leftMargin;
        },

        // Boolean to enable/disable background grid.
        grid: true,

        // Number of axis tick labels to draw so that they are not drawn on
        // top of one another.
        numXTickLabels: 10,
        numYTickLabels: 8,
    };

    // Property to represent whether data has been loaded.
    this.loaded = false;

    // Preload the data. This function is called automatically by the
    // gallery when a visualisation is added.
    this.preload = function () {
        let self = this;
        this.data = loadTable(
            './data/kagi-stock/HistoricalData.csv', 'csv', 'header',
            // Callback function to set the value
            // this.loaded to true.
            function (table) {
                self.loaded = true;
            });
    };

    this.kagiChart = new KagiChart();


    this.setup = function () {
        if (!this.loaded) {
            console.log('Data not yet loaded');
            return;
        }

        // Create a select DOM element.
        this.select = createSelect();
        this.select.position(width / 1.4, height);

        // Fill the options with all company names.
        let companies = this.data.columns;

        // First entry is empty.
        for (let i = 1; i < companies.length; i++) {
            this.select.option(companies[i]);
        }

        this.kagiValues = this.kagiChart.makeKagi(this.data);

        // Since the Kagi chart does not care about proportional dates
        // in the x axis but only with changing trends, any value in the 
        // series must be equidistant in the graph.
        this.widthProportion = (this.layout.rightMargin - this.layout.leftMargin) /
            this.kagiValues.length;

    }

    this.destroy = function () {
        this.select.remove();
    };

    this.draw = function () {

        if (!this.loaded) {
            console.log('Data not yet loaded');
            return;
        }

        // Get the value of the company we're interested in from the
        // select item.
        let companyName = this.select.value();

        this.kagiValues = this.kagiChart.makeKagi(this.data, companyName);

        // Since the Kagi chart does not care about proportional dates
        // in the x axis but only with changing trends, any value in the 
        // series must be equidistant in the graph.
        this.widthProportion = (this.layout.rightMargin - this.layout.leftMargin) /
            this.kagiValues.length;

        // Draw the title above the plot
        this.drawTitle();

        // Currently drawing x ticks on top of each other.
        // Cannot be skipped because the way the Kagi chart is calculated, so I 
        // must find another solution.
        this.drawXAxisTickLabelStock();


        // Calculate min and max stock values
        this.minStockValue = 99999;
        this.maxStockValue = 0;
        for (let i = 0; i < this.kagiValues.length; i++) {
            let close = this.kagiValues[i][1];
            this.maxStockValue = max(this.maxStockValue, close);
            this.minStockValue = min(this.minStockValue, close);
        }

        this.maxStockValue = (Math.ceil(this.maxStockValue / 10)) * 10
        this.minStockValue = (Math.floor(this.minStockValue / 10)) * 10

        // Adds y ticks
        drawYAxisTickLabels(this.minStockValue, this.maxStockValue,
            this.layout, this.mapStockToHeight.bind(this));

        this.kagiChart.draw(this.kagiValues, this.layout, this.widthProportion, this.mapStockToHeight.bind(this));

    }


    // Draws the title. Since it is used by all files, I will later implement
    // it as a helper function or in gallery
    this.drawTitle = function () {
        fill(0);
        noStroke();
        textAlign('center', 'center');

        text(this.title,
            (this.layout.plotWidth() / 2) + this.layout.leftMargin,
            this.layout.topMargin - (this.layout.marginSize / 2));
    };

    // This function is similar to the one in helper-functions.js
    // but it writes the full date based on the day of the year.
    // I plan to adapt the main function later and unify them.
    this.drawXAxisTickLabelStock = function () {
        // Map function must be passed with .bind(this).
        // var x = this.mapXToWidthTemp(value);

        for (let i = 0; i < this.kagiValues.length; i++) {
            let x = this.layout.leftMargin + (this.widthProportion * (i - 1));
            let y = this.layout.bottomMargin + ((this.layout.marginSize * 1.3) * (i % 4 / 3));
            let xGrid = this.layout.leftMargin + (this.widthProportion * i);

            fill(0);
            noStroke();
            textAlign('center', 'center');
            textSize(15);

            // Add tick label, skipping one every three.
            if (i % 2 !== 0) {
                // Writes the text and rotates it
                push();
                translate(x, y);
                rotate(HALF_PI - 1.3);
                text(this.kagiValues[i][0], 0, 0);
                pop();

                // Draws the line connecting the date to the graph
                stroke(155);
                strokeWeight(0.5);
                line(x, y - 10, x, this.layout.bottomMargin)
            }


            if (this.layout.grid) {
                // Add grid line.
                stroke(220);
                strokeWeight(1)
                line(xGrid,
                    this.layout.topMargin,
                    xGrid,
                    this.layout.bottomMargin);
            }
        }
    }

    this.mapStockToHeight = function (value) {
        return map(value,
            this.minStockValue,
            this.maxStockValue,
            this.layout.bottomMargin,
            this.layout.topMargin);
    }
}