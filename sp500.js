function SP500() {

    // Name for the visualisation to appear in the menu bar.
    this.name = 'SP 500 during COVID';

    // Each visualisation must have a unique ID with no special
    // characters.
    this.id = 'sp500-timeseries';

    // Title to display above the plot.
    this.title = 'SP 500 during COVID';

    // Names for each axis.
    this.xAxisLabel = 'Months of 2020';
    this.yAxisLabel = 'Stock value (average per company)';

    this.colors = [];

    var marginSize = 35;

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
        numXTickLabels: 10,
        numYTickLabels: 8,
    };

    // Property to represent whether data has been loaded.
    this.loaded = false;

    // Preload the data. This function is called automatically by the
    // gallery when a visualisation is added.
    this.preload = function () {
        var self = this;

        // Preloads the stock value data
        this.stock_data = loadTable(
            './data/sp500/sp500_stocks_clean.csv', 'csv', 'header',
            // Callback function to set the value
            // this.loaded to true.
            function (table) {
                self.loaded = true;
            });

        // Preloads the company data
        this.company_data = loadTable(
            './data/sp500/sp500_companies.csv', 'csv', 'header',
            // Callback function to set the value
            // this.loaded to true.
            function (table) {
                self.loaded = true;
            });

        this.data = loadTable(
            './data/food/household-nutrients-0117.csv', 'csv', 'header',
            // Callback function to set the value
            // this.loaded to true.
            function (table) {
                self.loaded = true;
            });


    };

    this.setup = function () {
        // Font defaults.
        textSize(16);

        // Get min and max months:
        this.endMonth = 12;
        this.startMonth = 1;
        this.minY = 999;
        this.maxY = 0;
        this.series = {};

        // Keep stock value per sector per date
        this.sector_value = {};

        // Number of companies per sector for average
        this.sector_quantity = {};

        // Get stock values for each sector per day
        for (let i = 0; i < this.stock_data.getRowCount(); i++) {

            let stock_row = this.stock_data.getRow(i);

            for (let j = 0; j < this.company_data.getRowCount(); j++) {
                let company_row = this.company_data.getRow(j);

                if (stock_row.getString(1) == company_row.getString(1)) {

                    // Add sector
                    if (this.sector_value[company_row.getString(4)] == undefined) {
                        this.sector_value[company_row.getString(4)] = {};
                        this.colors.push(color(random(0, 255), random(0, 255), random(0, 255)));

                        // Get number of companies per sector
                        this.sector_quantity[company_row.getString(4)] = 1 / 12;
                    }
                    else {
                        this.sector_quantity[company_row.getString(4)] += (1 / 12);
                    }

                    // Add stock value per sector per date
                    let check_num = this.sector_value[company_row.getString(4)][stock_row.getString(0)];

                    if (check_num == undefined) {
                        this.sector_value[company_row.getString(4)][stock_row.getString(0)] = 0;
                    }

                    isNaN(check_num += parseFloat(stock_row.getString(2))) ? 0 : (this.sector_value[company_row.getString(4)][stock_row.getString(0)] += stock_row.getNum(2));
                }

            }
        }

        // Average stock value per number of companies in sector
        for (const sector in this.sector_quantity) {
            this.sector_quantity[sector] = Math.round(this.sector_quantity[sector]);
        }

        for (const sector in this.sector_value) {
            for (const date in this.sector_value[sector]) {
                this.sector_value[sector][date] /= this.sector_quantity[sector];
                this.minY = min(this.minY, this.sector_value[sector][date]);
                this.maxY = max(this.maxY, this.sector_value[sector][date]);
            }

        }


        // Convert objects in object into array in object
        for (const sector in this.sector_value) {

            this.series[sector] = []

            for (const date in this.sector_value[sector]) {
                this.series[sector].push(this.sector_value[sector][date]);
            }

        }

        console.log(this.sector_value);
        console.log(this.series);

        //loop over all the rows
        for (var i = 0; i < this.data.getRowCount(); i++) {
            var row = this.data.getRow(i);

            //if the series isn't there already add a new array
            if (this.series[row.getString(0)] == undefined) {
                this.series[row.getString(0)] = [];
                this.colors.push(color(random(0, 255), random(0, 255), random(0, 255)));
            }

            for (var j = 1; j < this.data.getColumnCount(); j++) {
                // this.minY = min(this.minY, row.getNum(j));
                // this.maxY = max(this.maxY, row.getNum(j));
                // we are assuming that the data is in chronological order
                this.series[row.getString(0)].push(row.getNum(j));
            }

        }
        console.log(this.series);
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
        drawYAxisTickLabels(this.minY,
            this.maxY,
            this.layout,
            this.mapYToHeight.bind(this),
            0);

        // Draw x and y axis.
        drawAxis(this.layout);

        // Draw x and y axis labels.
        drawAxisLabels(this.xAxisLabel,
            this.yAxisLabel,
            this.layout);

        // Plot all pay gaps between startMonth and endMonth using the width
        // of the canvas minus margins.

        var numMonths = this.endMonth - this.startMonth + 1;

        for (var i = 0; i < numMonths; i++) {
            // The number of x-axis labels to skip so that only
            // numXTickLabels are drawn.
            // var xLabelSkip = ceil(numMonths / this.layout.numXTickLabels);

            y = this.startMonth + i;
            drawXAxisTickLabel(y, this.layout,
                this.mapMonthToWidth.bind(this));
            // Draw the tick label marking the start of the previous month.
            // if (i % xLabelSkip == 0) {

            // }
        }



        let legend = Object.keys(this.series);

        for (var j = 0; j < legend.length; j++) {


            var previous = null;
            // Loop over all rows and draw a line from the previous value to
            // the current.
            for (var i = 0; i < this.series[legend[j]].length; i++) {


                // Create an object to store data for the current month.
                var current = {
                    // Convert strings to numbers.
                    'month': this.startMonth + i,
                    'percentage': this.series[legend[j]][i]
                };

                if (previous != null) {
                    // Draw line segment connecting previous month to current
                    // month pay gap.
                    stroke(this.colors[j]);
                    line(this.mapMonthToWidth(previous.month),
                        this.mapYToHeight(previous.percentage),
                        this.mapMonthToWidth(current.month),
                        this.mapYToHeight(current.percentage));


                }
                else {
                    push();
                    textAlign(LEFT);
                    noStroke();
                    text(legend[j], 100, this.mapYToHeight(current.percentage) - 20)
                    pop();
                }

                // Assign current month to previous month so that it is available
                // during the next iteration of this loop to give us the start
                // position of the next line segment.
                previous = current;
            }
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

    this.mapYToHeight = function (value) {
        return map(value,
            this.minY,
            this.maxY,
            this.layout.bottomMargin, // Smaller pay gap at bottom.
            this.layout.topMargin);   // Bigger pay gap at top.
    };
}
