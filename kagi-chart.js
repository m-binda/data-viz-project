class KagiChart {
	/**
	 * This class gets base data for the construction of a list only with
	 * values that matter for a Kagi chart. From this data, this class
	 * calls for the KagiCompany class and stores the resulting objects.
	 *
	 * @class
	 */
	constructor() {
		// Initiate array to store objects with values for Kagi.
		this.kagiChart = [];
	}

	makeKagiChart = function (data) {
		// Gets data and calls for KagiCompany class to store its objects.
		for (let i = 1; i < data.columns.length; i++) {
			let company = String(data.columns[i]);
			let kagiCompany = new KagiCompany(company);
			kagiCompany.makeKagi(data);
			this.kagiChart.push(kagiCompany);
		}
	};

	getCompanyNames = function () {
		// Return the names of the companies stored.
		let companyNames = [];
		for (const company of this.kagiChart) {
			companyNames.push(company.companyName);
		}
		return companyNames;
	};

	drawCompanies = function (companyName, layout, widthProportion, mapFunction) {
		// Draws the graph of the Kagi chart according to the company called.
		for (const company of this.kagiChart) {
			if (companyName === company.companyName) {
				company.draw(layout, widthProportion, mapFunction);
			}
		}
	};

	getLength = function (companyName) {
		// Get the length of a specific company.
		for (const company of this.kagiChart) {
			if (companyName === company.companyName) {
				return company.length;
			}
		}
	};

	getMaxStockValue = function (companyName) {
		// Get the max stock value of a specific company.
		for (const company of this.kagiChart) {
			if (companyName === company.companyName) {
				return company.getMaxValue();
			}
		}
	};

	getMinStockValue = function (companyName) {
		// Get the min stock value of a specific company.
		for (const company of this.kagiChart) {
			if (companyName === company.companyName) {
				return company.getMinValue();
			}
		}
	};

	getDates = function (companyName) {
		// Get the dates selected by the Kagi criteria.
		for (const company of this.kagiChart) {
			if (companyName === company.companyName) {
				return company.getCompanyDates();
			}
		}
	};
}
