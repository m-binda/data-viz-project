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

    // ??? It seems this is not needed
    // Initiate variable to be used in the Kagi chart
    // this.kagiValues = [];

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

        // Initiate the value for the minimum percentage variation to alter
        // the line trend in the Kagi chart
        this.priceVar = 1.01;

        // Initiate the array for the drawing of the Kagi chart
        this.kagiValues = [];

        // Adds the first and second value to calculate the trend later
        // Adds the first value
        this.kagiValues.push(this.series[0]);

        // Adds second value based on the minimun variation
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
        for (let i = this.kNextPos; i < this.series.length; i++) {

            let l = this.kagiValues.length;

            // If the current trend is downwards
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
            // If the current trend is upwards
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

        // // Add last value.
        // let l = this.kagiValues.length;
        // let sLen = this.series.length;
        // if (this.kagiValues[l - 2][2] < this.kagiValues[l - 1][2]) {
        //     if (this.kagiValues[l - 1][2] < this.series[sLen - 1][2]) {
        //         this.kagiValues[l - 1] = this.series[sLen - 1];
        //     } else if (this.kagiValues[l - 1][2] > this.series[sLen - 1][2] * this.priceVar) {
        //         this.kagiValues.push(this.series[sLen - 1]);
        //     }
        // } else {
        //     if (this.kagiValues[l - 1][2] > this.series[sLen - 1][2]) {
        //         this.kagiValues[l - 1] = this.series[sLen - 1];
        //     } else if (this.kagiValues[l - 1][2] < this.series[sLen - 1][2] * this.priceVar) {
        //         this.kagiValues.push(this.series[sLen - 1]);
        //     }
        // }

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


        // Logic to draw the graph
        let rMin = this.kagiValues[0][2];
        let rMax = this.kagiValues[0][2];
        let changeMin = 0;
        let changeMax = 0;

        let trendColor = "";

        strokeWeight(4);

        // Draws the line for the first two values.
        if (this.kagiValues[1][2] < rMin) {
            trendColor = "red";
            stroke(trendColor);
            changeMin++;
            changeMax = 0;
            rMin = this.kagiValues[1][2];

        } else if (this.kagiValues[1][2] > rMax) {
            trendColor = "green";
            stroke(trendColor);
            changeMax++;
            changeMin = 0;
            rMax = this.kagiValues[1][2];
        }

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

        // Draw the subsequent lines
        for (let i = 1; i < this.kagiValues.length - 1; i++) {
            let currentX = this.layout.leftMargin + (this.widthProportion * i);
            let nextX = this.layout.leftMargin + (this.widthProportion * (i + 1));

            let currentValue = this.mapStockToHeight(this.kagiValues[i][2]);
            let nextValue = this.mapStockToHeight(this.kagiValues[i + 1][2]);

            if (this.kagiValues[i + 1][2] < rMin) {
                stroke(255, 0, 0);
                changeMin++;
                changeMax = 0;
            } else if (this.kagiValues[i + 1][2] > rMax) {
                stroke(0, 155, 44);
                changeMax++;
                changeMin = 0;
            }

            // Draws the main lines connecting the values
            line(currentX, currentValue,
                currentX, nextValue);

            line(currentX, nextValue,
                nextX, nextValue);


            // Changes the current valid valley or peak
            if (this.kagiValues[i][2] > this.kagiValues[i - 1][2]) {
                rMin = this.kagiValues[i - 1][2];
                rMax = this.kagiValues[i][2];
            } else {
                rMin = this.kagiValues[i][2];
                rMax = this.kagiValues[i - 1][2];
            }

            // Logic to change the line in the correct point of the Kagi chart
            // Currently not working well.
            if (changeMin === 1) {
                stroke(0, 155, 44);
                line(currentX, currentValue,
                    currentX, this.mapStockToHeight(rMin));
                stroke(255, 0, 0);
                line(currentX, this.mapStockToHeight(rMin),
                    currentX, nextValue);
            } else if (changeMax === 1) {
                stroke(255, 0, 0);
                line(currentX, currentValue,
                    currentX, this.mapStockToHeight(rMax));
                stroke(0, 155, 44);
                line(currentX, this.mapStockToHeight(rMax),
                    currentX, nextValue);
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

            fill(0);
            noStroke();
            textAlign('center', 'center');

            // rotate(180);

            // Add tick label, skipping one every three.
            if (i % 3 !== 0) {
                text(this.kagiValues[i][1],
                    x + textAdjust,
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