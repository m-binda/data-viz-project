function AppleStock() {

    // Name for the visualisation to appear in the menu bar.
    this.name = 'Apple Stock in 2021';

    // Each visualisation must have a unique ID with no special
    // characters.
    this.id = 'apple-stock-2021';

    // Property to represent whether data has been loaded.
    this.loaded = false;

    // Title to display above the plot.
    this.title = 'Apple Stock in 2021';

    // Names for each axis.
    this.xAxisLabel = 'Months of 2021';
    this.yAxisLabel = 'USD';

    let marginSize = 35;

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

        plotHeight: function () {
            return this.bottomMargin - this.topMargin;
        },

        // Boolean to enable/disable background grid.
        grid: true,

        // Number of axis tick labels to draw so that they are not drawn on
        // top of one another.
        numXTickLabels: 12,
        numYTickLabels: 10,
    };

    // Property to represent whether data has been loaded.
    this.loaded = false;

    // Preload the data. This function is called automatically by the
    // gallery when a visualisation is added.
    this.preload = function () {
        let self = this;
        this.data = loadTable(
            './data/apple-stock/ApplestockHistoricalData - clean.csv', 'csv', 'header',
            // Callback function to set the value
            // this.loaded to true.
            function (table) {
                self.loaded = true;
            });

    };

    this.setup = function () {
        // Font defaults.
        textSize(16);

        // Set min and max months: assumes data is sorted by date.
        this.startMonth = this.data.getNum(0, 'month');
        this.endMonth = this.data.getNum(this.data.getRowCount() - 1, 'month');

        // Find min and max stock values for mapping to canvas height.
        this.minStockValue = (round(min(this.data.getColumn('low')) / 10) * 10);

        this.maxStockValue = (round(max(this.data.getColumn('high')) / 10) * 10);

        // Get an object with all data
        this.series = [];


        for (let i = 0; i < this.data.getRowCount(); i++) {

            let row = this.data.getRow(i)["arr"];
            this.series.push(row);
        }

        console.log(this.series);
        console.log(this.series[0][0]);
    };

    this.destroy = function () {
    };

    this.draw = function () {
        if (!this.loaded) {
            console.log('Data not yet loaded');
            return;
        }

        // Draw the title above the plot.
        this.drawTitle();

        // Draw all y-axis labels.
        drawYAxisTickLabels(this.minStockValue,
            this.maxStockValue,
            this.layout,
            this.mapStockValueToHeight.bind(this),
            0);

        // Draw x and y axis.
        drawAxis(this.layout);

        // Draw x and y axis labels.
        drawAxisLabels(this.xAxisLabel,
            this.yAxisLabel,
            this.layout);


        // Plot the line of the graph
        for (let i = 0; i < this.series.length; i++) {

            // Set key stock values for each month
            let close_value = this.series[i][1];
            let open_value = this.series[i][2];
            let high_value = this.series[i][3];
            let lowest_value = this.series[i][4];

            // Map y position of each month
            let current_month = this.mapMonthToWidth(this.series[i][0]);

            drawXAxisTickLabel(this.series[i][0], this.layout, this.mapMonthToWidth.bind(this));

            close_value = this.mapStockValueToHeight(close_value);
            open_value = this.mapStockValueToHeight(open_value);
            high_value = this.mapStockValueToHeight(high_value);
            lowest_value = this.mapStockValueToHeight(lowest_value);

            strokeWeight(2);
            if (open_value > close_value) {
                stroke(255, 0, 0);
            }
            else {
                stroke(0, 0, 255);
            }

            // Draw the line for the total variation of the day
            line(current_month, high_value, current_month, lowest_value);

            // Draw the line for the initial value of the stock on the day
            line(current_month - 5, open_value, current_month, open_value);

            // Draw the line for the final value of the stock on the day
            line(current_month, close_value, current_month + 5, close_value);


        }
    };

    this.drawTitle = function () {
        fill(0);
        noStroke();
        textAlign('center', 'center');

        text(this.title,
            (this.layout.plotWidth() / 2) + this.layout.leftMargin,
            this.layout.topMargin - (this.layout.marginSize / 2));
    };

    this.mapMonthToWidth = function (value) {
        return map(value,
            this.startMonth,
            this.endMonth,
            this.layout.leftMargin,   // Draw left-to-right from margin.
            this.layout.rightMargin);
    };

    this.mapStockValueToHeight = function (value) {
        return map(value,
            this.minStockValue,
            this.maxStockValue,
            this.layout.bottomMargin, // Smaller pay gap at bottom.
            this.layout.topMargin);   // Bigger pay gap at top.
    };
}