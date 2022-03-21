function CloudList(book, wordFont) {

    this.book = book;
    this.wordFont = wordFont;

    // Initiate array to store the word objects
    this.wordCloud = [];

    this.makeCloud = function () {

        let self = this;
        let words = join(self.book);

        // Minimum word length
        let wordLength = 3;

        // Characters to split the string
        let tokensSplit = [' ', ',', '.', '_', '’', '?',
            '!', ':', ';', '-'
        ]
        words = splitTokens(words, tokensSplit);
        for (let i = 0; i < words.length; i++) {
            if (words[i].length > wordLength) {
                if ((self.wordCloud.find(x => x.name === words[i].toUpperCase())) === undefined) {
                    let word = new WordCloud(
                        words[i].toUpperCase()
                    );
                    self.wordCloud.push(word)
                } else {
                    self.wordCloud.find(x => x.name === words[i].toUpperCase()).quantity += 1;
                }
            }
        };
        self.wordCloud.sort((a, b) => b.quantity - a.quantity);
    };

    this.excludeWords = function (wordsToExclude) {
        let self = this;
        for (let i = 0; i < self.wordCloud.length; i++) {
            for (let j = 0; j < wordsToExclude.length; j++) {
                if (
                    self.wordCloud[i].name == wordsToExclude[j].toUpperCase()
                ) {
                    self.wordCloud.splice(i, 1);;
                }
            }
        }
    };

    this.resetPosition = function () {
        let self = this;
        for (let i = 0; i < self.wordCloud.length; i++) {
            self.wordCloud[i].pos.set(0, 0);
        }
    }

    this.updateSizes = function (minText = 20, maxText = 50) {
        let self = this;
        let minQty = self.wordCloud[self.wordCloud.length - 1].quantity;
        let maxQty = self.wordCloud[0].quantity;

        for (let i = 0; i < self.wordCloud.length; i++) {
            self.wordCloud[i].updateSize(
                minQty, maxQty, minText, maxText
            );
        };
    };

    this.drawWordCloud = function (titleHeight, numberWords) {
        let self = this;
        for (let i = 0; i < numberWords; i++) {
            self.wordCloud[i].isOn = true;
            if (self.wordCloud[i].isOn) {
                push();
                translate(width / 2, height / 2);
                self.wordCloud[i].updateBounds(self.wordFont);
                self.wordCloud[i].draw(self.wordFont);
                self.wordCloud[i].updatePos(self.wordCloud, titleHeight + 10);
                pop();
            }
        }

        for (let i = numberWords; i < self.wordCloud.length; i++) {
            self.wordCloud[i].isOn = false;
        }
    };

    this.displayQty = function (mouseX, mouseY) {
        let self = this;

        for (let i = 0; i < self.wordCloud.length; i++) {

            let x1 = self.wordCloud[i].x1 + width / 2;
            let x2 = self.wordCloud[i].x2 + width / 2;
            let y1 = self.wordCloud[i].y1 + height / 2;
            let y2 = self.wordCloud[i].y2 + height / 2;

            if (self.wordCloud[i].isOn) {
                if (
                    mouseX > x1 &&
                    mouseX < x2 &&
                    mouseY > y1 &&
                    mouseY < y2
                ) {
                    push();
                    let qty = self.wordCloud[i].quantity;
                    fill(150, 150, 150, 100);
                    textSize(20);
                    textAlign(LEFT, TOP);
                    if (qty.toString().length > 2) {
                        rect(mouseX, mouseY, 175, -30);
                    } else {
                        rect(mouseX, mouseY, 168, -30);
                    }
                    fill(0);
                    text("appears " + qty + " times", mouseX + 5, mouseY - 25);
                    pop();
                }
            }
        }
    }
}