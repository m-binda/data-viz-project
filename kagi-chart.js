function KagiChart() {

    this.kagiChart = [];

    this.makeKagiChart = function (data) {

        let self = this;

        for (let i = 1; i < data.columns.length; i++) {
            let company = String(data.columns[i]);
            let kagiCompany = new KagiCompany(company);
            kagiCompany.makeKagi(data);
            self.kagiChart.push(kagiCompany);
        }
    };

    this.getCompanyNames = function () {

        let self = this;
        let companyNames = [];

        for (let i = 0; i < self.kagiChart.length; i++) {
            let companyName = self.kagiChart[i].getName();
            companyNames.push(companyName);
        }
        return companyNames;
    };

    this.drawCompanies = function (companyName, layout, widthProportion, mapFunction) {

        let self = this;
        for (let i = 0; i < self.kagiChart.length; i++) {
            if (companyName === self.kagiChart[i].getName()) {
                self.kagiChart[i].draw(layout, widthProportion, mapFunction);
            }
        };
    };

    this.getLength = function (companyName) {
        let self = this;
        for (let i = 0; i < self.kagiChart.length; i++) {
            if (companyName === self.kagiChart[i].getName()) {
                return self.kagiChart[i].getKagiLength();
            };
        };
    };

    this.getMaxStockValue = function (companyName) {
        let self = this;
        for (let i = 0; i < self.kagiChart.length; i++) {
            if (companyName === self.kagiChart[i].getName()) {
                return self.kagiChart[i].getMaxValue();
            };
        };
    };

    this.getMinStockValue = function (companyName) {
        let self = this;
        for (let i = 0; i < self.kagiChart.length; i++) {
            if (companyName === self.kagiChart[i].getName()) {
                return self.kagiChart[i].getMinValue();
            };
        };
    };

    this.getDates = function (companyName) {
        let self = this;
        for (let i = 0; i < self.kagiChart.length; i++) {
            if (companyName === self.kagiChart[i].getName()) {
                return self.kagiChart[i].getCompanyDates();
            };
        };
    };
}