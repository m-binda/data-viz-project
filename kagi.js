function Kagi() {
    // Name for the visualisation to appear in the menu bar.
    this.name = 'Amazon Stock';

    // Each visualisation must have a unique ID with no special
    // characters.
    this.id = 'amazon-kagi';

    // Title to display above the plot.
    this.title = 'Amazon stock analysis with Kagi chart';

    // Private variables
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

        // Boolean to enable/disable background grid.
        grid: true,

        // Number of axis tick labels to draw so that they are not drawn on
        // top of one another.
        numXTickLabels: 20,
        numYTickLabels: 8,
    };

    // Property to represent whether data has been loaded.
    this.loaded = false;

    // Preload the data. This function is called automatically by the
    // gallery when a visualisation is added.
    this.preload = function () {
        var self = this;
        this.data = loadTable(
            './data/amazon-stock/AmazonHistoricalData.csv', 'csv', 'header',
            // Callback function to set the value
            // this.loaded to true.
            function (table) {
                self.loaded = true;
            });

    };

    // Initiate variables for the series and min and max values for the
    // stock price and the date range.
    this.series = [];
    this.minStockValue = 99999;
    this.maxStockValue = 0;

    this.dateRange = {
        min: 365,
        max: 0,
    };

    this.setup = function () {

        textSize(16);

        // Populates the series array with all information in the data file
        // and sets min and max values for date and stock prices
        for (let i = 0; i < this.data.getRowCount(); i++) {
            let row = this.data.getRow(i);
            let dayInYear = int(row["arr"][0]);
            let dateString = row["arr"][1];
            let close = float(row["arr"][2]);

            this.series[i] = [dayInYear, dateString, close];

            this.maxStockValue = max(this.maxStockValue, close);
            this.minStockValue = min(this.minStockValue, close);

            this.dateRange.min = min(this.dateRange.min, dayInYear);
            this.dateRange.max = max(this.dateRange.max, dayInYear);
        }

        // Populates the kagiValues with dates and prices that
        // break the current trend according to the currently established 
        // percentage.

        // Initiate the array for the values that matter to the Kagi chart
        this.kagiValues = [];

        // Initiate the value for the minimum percentage change to alter
        // the line trend in the Kagi chart
        this.priceVar = 1.01;

        // Adds the first and second value to calculate the trend later
        // Adds the first value
        this.kagiValues.push(this.series[0]);

        // Adds second value based on priceVar
        for (let i = 0; i < this.series.length; i++) {
            let l = this.kagiValues.length
            if (
                this.series[i][2] > (this.kagiValues[l - 1][2] * this.priceVar) ||
                this.series[i][2] < (this.kagiValues[l - 1][2] * (2 - this.priceVar))
            ) {
                this.kagiValues.push(this.series[i]);
                this.kNextPos = i + 1; // Adjust position for next loop
                break
            }
        }

        // Adds subsequent values according to changes in trend.
        // Compares each time to the previous two values
        for (let i = this.kNextPos; i < this.series.length; i++) {

            let l = this.kagiValues.length;

            // If the current trend is negative
            if (this.kagiValues[l - 2][2] < this.kagiValues[l - 1][2]) {
                // Replaces the current minimum value
                if (this.kagiValues[l - 1][2] < this.series[i][2]) {
                    this.kagiValues[l - 1] = this.series[i];
                }
                // Adds new value if trend changes
                else if (this.kagiValues[l - 1][2] * (2 - this.priceVar) > this.series[i][2]) {
                    this.kagiValues.push(this.series[i]);
                }
            }
            // If the current trend is positive
            else {
                // Replaces the current maximum value
                if (this.kagiValues[l - 1][2] > this.series[i][2]) {
                    this.kagiValues[l - 1] = this.series[i];
                }
                // Adds new value if trend changes
                else if (this.kagiValues[l - 1][2] * this.priceVar < this.series[i][2]) {
                    this.kagiValues.push(this.series[i]);
                }
            }
        }

        console.log(this.kagiValues);

        // Since the Kagi chart does not care about proportional dates
        // in the x axis but only with changing trends, any value in the 
        // series must be equidistant in the graph.
        this.widthProportion = (this.layout.rightMargin - this.layout.leftMargin) /
            this.kagiValues.length;
    }

    this.draw = function () {

        if (!this.loaded) {
            console.log('Data not yet loaded');
            return;
        }

        // Draw the title above the plot
        this.drawTitle();

        // Currently drawing x ticks on top of each other.
        // Cannot be skipped because the way the Kagi chart is calculated, so I 
        // must find another solution.
        this.drawXAxisTickLabelTemp();

        // Adds y ticks
        drawYAxisTickLabels(this.minStockValue, this.maxStockValue,
            this.layout, this.mapStockToHeight.bind(this));

        // Initiate variable to check the current trend
        let trend;

        strokeWeight(4);

        // Draws the line for the first two values.
        // Negative trend
        if (this.kagiValues[1][2] < this.kagiValues[0][2]) {
            stroke("red");
            trend = false;
        }
        // Positive trend
        else if (this.kagiValues[1][2] > this.kagiValues[0][2]) {
            stroke("green");
            trend = true;
        }

        // Draws the lines connecting the first two values
        // Vertical line
        line(this.layout.leftMargin,
            this.mapStockToHeight(this.kagiValues[0][2]),
            this.layout.leftMargin,
            this.mapStockToHeight(this.kagiValues[1][2]));
        // Horizontal line
        line(this.layout.leftMargin,
            this.mapStockToHeight(this.kagiValues[1][2]),
            this.layout.leftMargin + (this.widthProportion),
            this.mapStockToHeight(this.kagiValues[1][2]));

        // Logic to draw subsequent lines
        for (let i = 2; i < this.kagiValues.length; i++) {

            // Variables for the x axis of the current and the next dates
            let currentX = this.layout.leftMargin + (this.widthProportion * (i - 1));
            let nextX = this.layout.leftMargin + (this.widthProportion * i);

            // Maps the values of the current and previous stocks values
            let currentMapVal = this.mapStockToHeight(this.kagiValues[i][2]);
            let previousMapVal = this.mapStockToHeight(this.kagiValues[i - 1][2]);
            let refMapVal = this.mapStockToHeight(this.kagiValues[i - 2][2]);

            // Iniate variables for the current and previous stock values
            let currentVal = this.kagiValues[i][2];
            let previousVal = this.kagiValues[i - 1][2];
            let refVal = this.kagiValues[i - 2][2];

            // Checks if this is a peak
            if (currentVal > previousVal) {

                // Check if current value is larger than the previous two
                if (currentVal > refVal) {
                    stroke("green")
                    line(nextX, currentMapVal,
                        currentX, currentMapVal);

                    // If current trend already positive, maintain
                    if (trend) {
                        stroke("green");
                        line(currentX, previousMapVal,
                            currentX, refMapVal);
                        line(currentX, refMapVal,
                            currentX, currentMapVal);
                    }

                    // If current trend negative, inverts trend
                    else {
                        stroke("red");
                        line(currentX, previousMapVal,
                            currentX, refMapVal);
                        stroke("green");
                        line(currentX, refMapVal,
                            currentX, currentMapVal);
                        trend = !trend;
                    }
                }
                // If current value only larger than previous, maintains trend
                else {
                    if (trend) {
                        stroke("green");
                        line(nextX, currentMapVal,
                            currentX, currentMapVal);
                        line(currentX, previousMapVal,
                            currentX, currentMapVal);
                    } else {
                        stroke("red")
                        line(nextX, currentMapVal,
                            currentX, currentMapVal);
                        line(currentX, previousMapVal,
                            currentX, currentMapVal);
                    }
                }
            }
            // Checks if this is a valley
            else {

                // If current value only smaller than previous, maintains trend
                if (currentVal > refVal) {
                    if (trend) {
                        stroke("green");
                        line(nextX, currentMapVal,
                            currentX, currentMapVal);
                        line(currentX, previousMapVal,
                            currentX, currentMapVal);
                    } else {
                        stroke("red");
                        line(nextX, currentMapVal,
                            currentX, currentMapVal);
                        line(currentX, previousMapVal,
                            currentX, currentMapVal);
                    }
                }
                // Check if current value is smaller than the previous two
                else {
                    stroke("red")
                    line(nextX, currentMapVal,
                        currentX, currentMapVal);
                    // If current trend positive, inverts trend
                    if (trend) {
                        stroke("green");
                        line(currentX, previousMapVal,
                            currentX, refMapVal);
                        stroke("red");
                        line(currentX, refMapVal,
                            currentX, currentMapVal);
                        trend = !trend;
                    }
                    // If current trend already negative, maintain
                    else {
                        stroke("red");
                        line(currentX, previousMapVal,
                            currentX, refMapVal);
                        line(currentX, refMapVal,
                            currentX, currentMapVal);
                    }
                }
            }
        }
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

    // Maps value from one range to another. It has the same issue as the one 
    // above.
    this.mapXToWidthTemp = function (value) {
        return map(value,
            this.dateRange.min,
            this.dateRange.max,
            this.layout.leftMargin, // Draw left-to-right from margin.
            this.layout.rightMargin);
    }


    // This function is similar to the one in helper-functions.js
    // but it writes the full date based on the day of the year.
    // I plan to adapt the main function later and unify them.
    this.drawXAxisTickLabelTemp = function () {
        // Map function must be passed with .bind(this).
        // var x = this.mapXToWidthTemp(value);

        let textAdjust = -5;
        for (let i = 0; i < this.kagiValues.length; i++) {
            let x = this.layout.leftMargin + (this.widthProportion * i);
            let textX = this.layout.leftMargin + (this.widthProportion * (i - 1));

            fill(0);
            noStroke();
            textAlign('center', 'center');

            // rotate(180);

            // Add tick label, skipping one every three.
            if (i % 3 !== 0) {
                text(this.kagiValues[i][1],
                    textX + textAdjust,
                    this.layout.bottomMargin + (this.layout.marginSize / 1.5) * (i % 3));
                stroke(155);
                line(x,
                    this.layout.bottomMargin + (this.layout.marginSize / 1.5) * (i % 3) - 10, x, this.layout.bottomMargin)
                textAdjust *= -1;
            }


            if (this.layout.grid) {
                // Add grid line.
                stroke(220);
                strokeWeight(1)
                line(x,
                    this.layout.topMargin,
                    x,
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