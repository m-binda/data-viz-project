function KagiChart() {

    // Initiate variables for the series and min and max values for the
    // stock price and the date range.
    // this.series = [];
    // this.minStockValue = 99999;
    // this.maxStockValue = 0;

    this.dateRange = {
        min: 365,
        max: 0,
    };

    this.getSeries = function (data) {

    };

    this.makeKagi = function (series) {
        // Populates the kagiValues with dates and prices that
        // break the current trend according to the currently established 
        // percentage.

        // Initiate the array for the values that matter to the Kagi chart
        let kagiValues = [];

        // Initiate the value for the minimum percentage change to alter
        // the line trend in the Kagi chart
        let priceVar = 1.01;
        let kNextPos = 0;


        // Adds the first and second value to calculate the trend later
        // Adds the first value
        kagiValues.push(series[0]);

        // Adds second value based on priceVar
        for (let i = 0; i < series.length; i++) {
            let l = kagiValues.length
            if (
                series[i][2] > (kagiValues[l - 1][2] * priceVar) ||
                series[i][2] < (kagiValues[l - 1][2] * (2 - priceVar))
            ) {
                kagiValues.push(series[i]);
                kNextPos = i + 1; // Adjust position for next loop
                break
            }
        }

        // Adds subsequent values according to changes in trend.
        // Compares each time to the previous two values
        for (let i = kNextPos; i < series.length; i++) {

            let l = kagiValues.length;

            // If the current trend is negative
            if (kagiValues[l - 2][2] < kagiValues[l - 1][2]) {
                // Replaces the current minimum value
                if (kagiValues[l - 1][2] < series[i][2]) {
                    kagiValues[l - 1] = series[i];
                }
                // Adds new value if trend changes
                else if (kagiValues[l - 1][2] * (2 - priceVar) > series[i][2]) {
                    kagiValues.push(series[i]);
                }
            }
            // If the current trend is positive
            else {
                // Replaces the current maximum value
                if (kagiValues[l - 1][2] > series[i][2]) {
                    kagiValues[l - 1] = series[i];
                }
                // Adds new value if trend changes
                else if (kagiValues[l - 1][2] * priceVar < series[i][2]) {
                    kagiValues.push(series[i]);
                }
            }
        }

        return kagiValues;
    };


    this.draw = function (_kagiValues, layout, widthProportion, minStockValue, maxStockValue) {
        // Initiate variable to check the current trend
        let trend;

        strokeWeight(4);

        // Draws the line for the first two values.
        // Negative trend
        if (_kagiValues[1][2] < _kagiValues[0][2]) {
            stroke("red");
            trend = false;
        }
        // Positive trend
        else if (_kagiValues[1][2] > _kagiValues[0][2]) {
            stroke("green");
            trend = true;
        }

        // Draws the lines connecting the first two values
        // Vertical line
        line(layout.leftMargin,
            this.mapStockToHeight(_kagiValues[0][2], minStockValue, maxStockValue, layout),
            layout.leftMargin,
            this.mapStockToHeight(_kagiValues[1][2], minStockValue, maxStockValue, layout));
        // Horizontal line
        line(layout.leftMargin,
            this.mapStockToHeight(_kagiValues[1][2], minStockValue, maxStockValue, layout),
            layout.leftMargin + (widthProportion),
            this.mapStockToHeight(_kagiValues[1][2], minStockValue, maxStockValue, layout));

        // Logic to draw subsequent lines
        for (let i = 2; i < _kagiValues.length; i++) {

            // Variables for the x axis of the current and the next dates
            let currentX = layout.leftMargin + (widthProportion * (i - 1));
            let nextX = layout.leftMargin + (widthProportion * i);

            // Maps the values of the current and previous stocks values
            let currentMapVal = this.mapStockToHeight(_kagiValues[i][2], minStockValue, maxStockValue, layout);
            let previousMapVal = this.mapStockToHeight(_kagiValues[i - 1][2], minStockValue, maxStockValue, layout);
            let refMapVal = this.mapStockToHeight(_kagiValues[i - 2][2], minStockValue, maxStockValue, layout);

            // Iniate variables for the current and previous stock values
            let currentVal = _kagiValues[i][2];
            let previousVal = _kagiValues[i - 1][2];
            let refVal = _kagiValues[i - 2][2];

            // Checks if this is a peak
            if (currentVal > previousVal) {

                // Check if current value is larger than the previous two
                if (currentVal > refVal) {
                    stroke("green");
                    // Does not draw the horizontal line for the last value
                    if (i != _kagiValues.length - 1) {
                        line(nextX, currentMapVal,
                            currentX, currentMapVal);
                    }

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
                        // Does not draw the horizontal line for the last value
                        if (i != _kagiValues.length - 1) {
                            line(nextX, currentMapVal,
                                currentX, currentMapVal);
                        }
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
                        // Does not draw the horizontal line for the last value
                        if (i != _kagiValues.length - 1) {
                            line(nextX, currentMapVal,
                                currentX, currentMapVal);
                        }
                        line(currentX, previousMapVal,
                            currentX, currentMapVal);
                    } else {
                        stroke("red");
                        // Does not draw the horizontal line for the last value
                        if (i != _kagiValues.length - 1) {
                            line(nextX, currentMapVal,
                                currentX, currentMapVal);
                        }
                        line(currentX, previousMapVal,
                            currentX, currentMapVal);
                    }
                }
                // Check if current value is smaller than the previous two
                else {
                    stroke("red")
                    // Does not draw the horizontal line for the last value
                    if (i != _kagiValues.length - 1) {
                        line(nextX, currentMapVal,
                            currentX, currentMapVal);
                    }
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


    this.mapStockToHeight = function (value, minStockValue, maxStockValue, layout) {
        return map(value,
            minStockValue,
            maxStockValue,
            layout.bottomMargin,
            layout.topMargin);
    }
}