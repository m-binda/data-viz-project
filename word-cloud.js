function WordCloud(_name) {

    this.name = _name;
    this.quantity = 1;
    this.size = 0;
    this.pos = createVector(0, 0);
    this.dir = createVector(0, 0);
    this.x1 = 0;
    this.x2 = 0;
    this.y1 = 0
    this.y2 = 0;
    this.wordColor = [random(0, 255), random(0, 255), random(0, 255)];

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
        pop();
    }


    this.updateSize = function (minQty, maxQty, minText, maxText, _font) {
        let self = this;

        this.size = map(
            this.quantity,
            minQty, maxQty,
            minText,
            maxText
        );

        let bounds = _font.textBounds(self.name, self.pos.x, self.pos.y, self.size);

        self.x1 = bounds.x;
        self.x2 = self.x1 + bounds.w;
        self.y1 = bounds.y;
        self.y2 = self.y1 + bounds.h;
    }

    this.updatePos = function (_wordCloud) {

        let self = this;

        self.dir.set(0, 0);

        for (var i = 0; i < _wordCloud.length; i++) {
            if (_wordCloud[i].name != self.name) {

                let otherX1 = _wordCloud[i].x1;
                let otherX2 = _wordCloud[i].x2;
                let otherY1 = _wordCloud[i].y1;
                let otherY2 = _wordCloud[i].y2;

                if (
                    self.x1 < otherX2 + 20 &&
                    self.x2 + 20 > otherX1 &&
                    self.y1 < otherY2 + 20 &&
                    self.y2 + 20 > otherY1
                ) {
                    this.dir.add(p5.Vector.random2D());
                }


                // var v = p5.Vector.sub(this.pos, _bubbles[i].pos);
                // var d = v.mag();



                // if (d < this.size / 2 + _bubbles[i].size / 2) {
                //     if (d > 0) {

                //         this.direction.add(v)
                //     } else {
                //         this.direction.add(p5.Vector.random2D());

                //     }
                // }

            }
        }

        _wordCloud[0].pos = createVector(0, 0);
        self.dir.normalize();
        self.dir.mult(20);
        self.pos.add(self.dir);
    }


}