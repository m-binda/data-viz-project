function WordCloud(_name) {

    this.name = _name;
    this.quantity = 1;
    this.size = 0;
    this.pos = createVector(0, 0);
    this.w = 0;
    this.h = 0;
    this.wordColor = [random(0, 255), random(0, 255), random(0, 255)];

    // Initiate variables for collision checks
    this.x1 = 0;
    this.x2 = 0;
    this.y1 = 0
    this.y2 = 0;

    // Variable for changes in position when collision occurs
    this.dir = createVector(0, 0);

    this.draw = function (_font) {

        let self = this;

        push();
        noStroke();
        textFont(_font);
        fill(self.wordColor);
        textAlign(CENTER, CENTER);
        textSize(self.size);
        text(self.name, self.pos.x, self.pos.y);

        // Rect for collision coordinates test
        // noFill();
        // stroke(0);
        // strokeWeight(2);
        // rect(self.x1, self.y1, self.w, self.h);

        pop();
    }

    this.updateSize = function (minQty, maxQty, minText, maxText) {
        let self = this;

        self.size = map(
            self.quantity,
            minQty, maxQty,
            minText,
            maxText
        );
    }

    this.updateBounds = function (_font) {

        let self = this;
        let bounds = _font.textBounds(self.name, self.pos.x, self.pos.y, self.size);

        // Variable to correct error in textBounds function.
        // After multiples tests, I verified that this function does not
        // return proper values, especially for smaller text sizes.
        let bdErr = 5;

        self.w = bounds.w;
        self.h = bounds.h + 2 * bdErr;

        self.x1 = bounds.x;
        self.x2 = self.x1 + self.w;
        self.y1 = bounds.y - bdErr;
        self.y2 = self.y1 + self.h;
    }

    this.updatePos = function (_wordCloud, titleHeight) {

        let self = this;
        let v = p5.Vector.random2D();

        self.dir.set(0, 0);

        for (var i = 0; i < _wordCloud.length; i++) {
            if (_wordCloud[i].name != self.name) {


                if (
                    self.x1 < _wordCloud[i].x2 &&
                    self.x2 > _wordCloud[i].x1 &&
                    self.y1 < _wordCloud[i].y2 &&
                    self.y2 > _wordCloud[i].y1
                ) {

                    self.dir.add(v);
                }
            }
        }

        self.dir.normalize();
        self.dir.mult(40);
        self.pos.add(self.dir);
        _wordCloud[0].pos.set(0, 0);

        if (self.x1 < -width / 2 ||
            self.x2 > width / 2 ||
            self.y1 < -height / 2 + titleHeight ||
            self.y2 > height / 2
        ) {
            self.pos.set(0, 0);
        }
    }
}