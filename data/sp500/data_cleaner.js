stock_data = loadTable(
    './data/sp500/sp500_stocks_clean.csv', 'csv', 'header',
    // Callback function to set the value
    // loaded to true.
);

// Preloads the company data
company_data = loadTable(
    './data/sp500/sp500_companies.csv', 'csv', 'header',
    // Callback function to set the value
    // loaded to true.
);

endYear = 2016;
startYear = 2001;
minY = 999;
maxY = 0;
series = {};
company_sector = {};
stock_price = {};
sector_value = {};

// Get company ticker and sector
for (let i = 0; i < company_data.getRowCount(); i++) {

    let company_row = company_data.getRow(i);

    // Get company ticker and sector
    if (company_sector[company_row.getString(1)] == undefined) {
        company_sector[company_row.getString(1)] = [];
        company_sector[company_row.getString(1)] = company_row.getString(4);
    }

    // Add sector key to sector_value object
    if (sector_value[company_row.getString(4)] == undefined) {
        sector_value[company_row.getString(4)] = {};
    }
}
// console.log(company_sector);

// Get stock prices per date for each company
for (let i = 0; i < stock_data.getRowCount(); i++) {
    let stock_row = stock_data.getRow(i);

    if (stock_price[stock_row.getString(1)] == undefined) {
        stock_price[stock_row.getString(1)] = {};
    }

    for (const ticker in stock_price) {
        if (Object.hasOwnProperty.call(stock_price, ticker) &&
            stock_price[ticker][stock_row.getString(0)] == undefined) {

            stock_price[ticker][stock_row.getString(0)] = parseFloat(stock_row.getString(2));
        }

    }

    // Add dates to the sector_value object
    for (const sector in sector_value) {
        if (Object.hasOwnProperty.call(sector_value, sector) &&
            sector_value[sector][stock_row.getString(0)] == undefined) {
            sector_value[sector][stock_row.getString(0)] = 0;
        }
    }
}

// Make an object with average ticket price per sector per date
// What do I need to do?
// Get an object with sector as main key and, within each sector, get 
// the average stock value for each date
// First, get sector keys




for (const ticker in stock_price) {

    for (const company in company_sector) {

        if (ticker == company) {

            for (const sector in sector_value) {

                console.log('e');

            }

        }
    }


}



console.log(sector_value);
console.log(company_sector);
console.log(stock_price);
