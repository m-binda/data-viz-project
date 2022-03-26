class KagiCompany {
	/**
	 * KagiCompany is a class that gets data from the stock value of a certain
	 * period for a certain company and mainly calculates the values that matter
	 * for a Kagi chart.
	 *
	 * @class
	 */

	// Initiate private variables.
	#companyName;
	#kagiValues;
	constructor(companyName) {
		this.#companyName = companyName;
		this.#kagiValues = [];
	}

	// Returns the name of the company.
	get companyName() {
		return this.#companyName;
	}

	// Return how many dates were stored in the object.
	get length() {
		return this.#kagiValues.length;
	}

	getSeries(data) {
		// Initiate variables for the series.
		let series = [];

		// Populates the series array with all information in the data
		for (let i = 0; i < data.getRowCount(); i++) {
			let dateString = data.getColumn(0)[i];
			let close = float(data.getColumn(this.#companyName)[i]);
			series[i] = [dateString, close];
		}
		return series;
	}

	getMaxValue = function () {
		// Gets the maximum value that the stock achieved that period.
		let maxStockValue = 0;
		for (let i = 0; i < this.#kagiValues.length; i++) {
			let close = this.#kagiValues[i][1];
			maxStockValue = max(maxStockValue, close);
		}
		return Math.ceil(maxStockValue / 10) * 10;
	};

	getMinValue = function () {
		// Gets the minimum value that the stock achieved that period.
		let minStockValue = 9999999999;
		for (let i = 0; i < this.#kagiValues.length; i++) {
			let close = this.#kagiValues[i][1];
			minStockValue = min(minStockValue, close);
		}
		return Math.floor(minStockValue / 10) * 10;
	};

	getCompanyDates = function () {
		// Return the dates selected by the criteria of the Kagi chart.
		let dates = [];
		for (let i = 0; i < this.#kagiValues.length; i++) {
			dates.push(this.#kagiValues[i][0]);
		}
		return dates;
	};

	makeKagi = function (data) {
		/*
		 * Description. Populates this.#kagiValues with dates and prices that
		 * break the current trend according to the chosen percentage.
		 */

		let series = this.getSeries(data);

		// Initiate the value for the minimum percentage change to alter
		// the line trend in the Kagi chart
		let priceVar = 1.01;
		let kNextPos = 0;

		// Adds the first and second value to calculate the trend later

		// Adds the first value of the series to the Kagi selection.
		this.#kagiValues.push(series[0]);

		// Adds second value based on priceVar.
		for (let i = 0; i < series.length; i++) {
			let l = this.#kagiValues.length;
			if (
				series[i][1] > this.#kagiValues[l - 1][1] * priceVar ||
				series[i][1] < this.#kagiValues[l - 1][1] * (2 - priceVar)
			) {
				this.#kagiValues.push(series[i]);
				kNextPos = i + 1; // Adjust position for next loop
				break;
			}
		}

		/* Adds subsequent values according to changes in trend.
		 * Compares each time to the previous two values in the Kagi series.
		 */
		for (let i = kNextPos; i < series.length; i++) {
			let l = this.#kagiValues.length;

			// If the current trend is negative
			if (this.#kagiValues[l - 2][1] < this.#kagiValues[l - 1][1]) {
				// Replaces the current minimum value
				if (this.#kagiValues[l - 1][1] < series[i][1]) {
					this.#kagiValues[l - 1] = series[i];
				}
				// Adds new value if trend changes
				else if (this.#kagiValues[l - 1][1] * (2 - priceVar) > series[i][1]) {
					this.#kagiValues.push(series[i]);
				}
			}
			// If the current trend is positive
			else {
				// Replaces the current maximum value
				if (this.#kagiValues[l - 1][1] > series[i][1]) {
					this.#kagiValues[l - 1] = series[i];
				}
				// Adds new value if trend changes
				else if (this.#kagiValues[l - 1][1] * priceVar < series[i][1]) {
					this.#kagiValues.push(series[i]);
				}
			}
		}
	};

	draw = function (layout, widthProportion, mapFunction) {
		/* Draws the Kagi chart. It changes the color of the chart according
		 * to changes in trend and modifies the trend if needed.
		 *Map function must be passed with .bind(this).
		 */

		strokeWeight(4);

		// Draws the line for the first two values.
		// Initiate boolean variable to track the current trend
		let trend = this.#kagiValues[1][1] < this.#kagiValues[0][1] ? false : true;

		// Sets the color of the first two lines according to the initial trend.
		trend ? stroke("green") : stroke("red");

		// Draws the lines connecting the first two values
		// Vertical line
		line(
			layout.leftMargin,
			mapFunction(this.#kagiValues[0][1]),
			layout.leftMargin,
			mapFunction(this.#kagiValues[1][1])
		);
		// Horizontal line
		line(
			layout.leftMargin,
			mapFunction(this.#kagiValues[1][1]),
			layout.leftMargin + widthProportion,
			mapFunction(this.#kagiValues[1][1])
		);

		// Logic to draw subsequent lines
		for (let i = 2; i < this.#kagiValues.length; i++) {
			// Variables for the x axis of the current and the next dates
			let currentX = layout.leftMargin + widthProportion * (i - 1);
			let nextX = layout.leftMargin + widthProportion * i;

			// Maps the values of the current and previous stocks values
			let currentMapVal = mapFunction(this.#kagiValues[i][1]);
			let previousMapVal = mapFunction(this.#kagiValues[i - 1][1]);
			let refMapVal = mapFunction(this.#kagiValues[i - 2][1]);

			// Iniate variables for the current and previous stock values
			let currentVal = this.#kagiValues[i][1];
			let previousVal = this.#kagiValues[i - 1][1];
			let refVal = this.#kagiValues[i - 2][1];

			// Checks if this is a peak
			if (currentVal > previousVal) {
				// Check if current value is larger than the previous two
				if (currentVal > refVal) {
					stroke("green");
					// Does not draw the horizontal line for the last value
					if (i != this.#kagiValues.length - 1) {
						line(nextX, currentMapVal, currentX, currentMapVal);
					}

					// If current trend already positive, maintain.
					if (trend) {
						stroke("green");
						line(currentX, previousMapVal, currentX, refMapVal);
						line(currentX, refMapVal, currentX, currentMapVal);
					}

					// If current trend negative, trend inverts.
					else {
						stroke("red");
						line(currentX, previousMapVal, currentX, refMapVal);
						stroke("green");
						line(currentX, refMapVal, currentX, currentMapVal);
						trend = !trend;
					}
				}

				// If current value only larger than previous, maintains trend.
				else {
					if (trend) {
						stroke("green");
						// Does not draw the horizontal line for the last value
						if (i != this.#kagiValues.length - 1) {
							line(nextX, currentMapVal, currentX, currentMapVal);
						}
						line(currentX, previousMapVal, currentX, currentMapVal);
					} else {
						stroke("red");
						line(nextX, currentMapVal, currentX, currentMapVal);
						line(currentX, previousMapVal, currentX, currentMapVal);
					}
				}
			}
			// Checks if this is a valley
			else {
				// If current value smaller only than the previous one,
				// maintains trend
				if (currentVal > refVal) {
					if (trend) {
						stroke("green");
						// Does not draw the horizontal line for the last value
						if (i != this.#kagiValues.length - 1) {
							line(nextX, currentMapVal, currentX, currentMapVal);
						}
						line(currentX, previousMapVal, currentX, currentMapVal);
					} else {
						stroke("red");
						// Does not draw the horizontal line for the last value
						if (i != this.#kagiValues.length - 1) {
							line(nextX, currentMapVal, currentX, currentMapVal);
						}
						line(currentX, previousMapVal, currentX, currentMapVal);
					}
				}
				// Check if current value is smaller than the previous two
				else {
					stroke("red");
					// Does not draw the horizontal line for the last value
					if (i != this.#kagiValues.length - 1) {
						line(nextX, currentMapVal, currentX, currentMapVal);
					}
					// If current trend positive, inverts trend
					if (trend) {
						stroke("green");
						line(currentX, previousMapVal, currentX, refMapVal);
						stroke("red");
						line(currentX, refMapVal, currentX, currentMapVal);
						trend = !trend;
					}
					// If current trend already negative, maintain
					else {
						stroke("red");
						line(currentX, previousMapVal, currentX, refMapVal);
						line(currentX, refMapVal, currentX, currentMapVal);
					}
				}
			}
		}
	};
}
