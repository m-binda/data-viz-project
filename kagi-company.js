function KagiCompany() {

    // Initiate the array for the values that matter to the Kagi chart
    this.kagiValues = [];

    this.getKagiValues = function (companyData) {

        self = this;

        // Populates the kagiValues with dates and prices that
        // break the current trend according to the currently established 
        // percentage.

        // Initiate the value for the minimum percentage change to alter
        // the line trend in the Kagi chart
        let priceVar = 1.01;
        let kNextPos = 0;

        // Adds the first and second value to calculate the trend later
        // Adds the first value
        self.kagiValues.push(companyData[0]);

        // Adds second value based on priceVar
        for (let i = 0; i < companyData.length; i++) {
            let l = self.kagiValues.length
            if (
                companyData[i][1] > (self.kagiValues[l - 1][1] * priceVar) ||
                companyData[i][1] < (self.kagiValues[l - 1][1] * (2 - priceVar))
            ) {
                self.kagiValues.push(companyData[i]);
                kNextPos = i + 1; // Adjust position for next loop
                break
            }
        }

        // Adds subsequent values according to changes in trend.
        // Compares each time to the previous two values
        for (let i = kNextPos; i < companyData.length; i++) {

            let l = self.kagiValues.length;

            // If the current trend is negative
            if (self.kagiValues[l - 2][1] < self.kagiValues[l - 1][1]) {
                // Replaces the current minimum value
                if (self.kagiValues[l - 1][1] < companyData[i][1]) {
                    self.kagiValues[l - 1] = companyData[i];
                }
                // Adds new value if trend changes
                else if (self.kagiValues[l - 1][1] * (2 - priceVar) > companyData[i][1]) {
                    self.kagiValues.push(companyData[i]);
                }
            }
            // If the current trend is positive
            else {
                // Replaces the current maximum value
                if (self.kagiValues[l - 1][1] > companyData[i][1]) {
                    self.kagiValues[l - 1] = companyData[i];
                }
                // Adds new value if trend changes
                else if (self.kagiValues[l - 1][1] * priceVar < companyData[i][1]) {
                    self.kagiValues.push(companyData[i]);
                }
            }
        }
    };
}