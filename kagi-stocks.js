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

        // Number of axis tick labels to draw
        numYTickLabels: 8,
    };

    // Property to represent whether data has been loaded.
    this.loaded = false;

    // Preload the data. This function is called automatically by the
    // gallery when a visualisation is added.
    this.preload = function () {
        let self = this;
        loadTable(
            './data/kagi-stock/HistoricalData.csv', 'csv', 'header',
            // Callback function to set the value
            // this.loaded to true.
            (table) => {
                this.kagiChart = new KagiChart(table);
                self.loaded = true;
            });
    };

    this.setup = function () {
        if (!this.loaded) {
            console.log('Data not yet loaded');
            return;
        };

        textSize(15);

        // Create a select DOM element.
        this.select = createSelect();
        this.select.position(width / 1.4, height);

        // Fill the options with all company names.
        let companies = this.kagiChart.getCompanies();

        // First entry is empty.
        for (let i = 1; i < companies.length; i++) {
            this.select.option(companies[i]);
        };
    }

    // Removes select element
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

        this.kagiValues = this.kagiChart.makeKagi(companyName);

        // Since the Kagi chart does not care about proportional dates
        // in the x axis but only with changing trends, any value in the 
        // series must be equidistant in the graph.
        let widthProportion =
            (this.layout.rightMargin - this.layout.leftMargin) /
            this.kagiValues.length;

        // Draw the title above the plot
        this.drawTitle();

        // Draw X axis ticks
        drawXAxisTickFullDate(this.layout, widthProportion, this.kagiValues)

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

        this.kagiChart.draw(this.kagiValues, this.layout, widthProportion, this.mapStockToHeight.bind(this));

    }


    // Draws the title.
    this.drawTitle = function () {
        fill(0);
        noStroke();
        textAlign('center', 'center');

        text(this.title,
            (this.layout.plotWidth() / 2) + this.layout.leftMargin,
            this.layout.topMargin - (this.layout.marginSize / 2));
    };

    this.mapStockToHeight = function (value) {
        return map(value,
            this.minStockValue,
            this.maxStockValue,
            this.layout.bottomMargin,
            this.layout.topMargin);
    }
}