class WordCloud {
	/**
	 * Description. WordCloud is class used to store words and their
	 * coordinates for resizing and collision detection for word clouds.
	 *
	 * @class
	 */
	constructor(_name) {
		// Initiate variables for name and initial coordinates
		this.name = _name;
		this.quantity = 1;
		this.size = 0;
		this.pos = createVector(0, 0);
		this.w = 0;
		this.h = 0;
		this.wordColor = [random(0, 255), random(0, 255), random(0, 255)];

		// Check if the word is on the screen
		this.isOn = false;

		// Initiate variables for collision checks
		this.x1 = 0;
		this.x2 = 0;
		this.y1 = 0;
		this.y2 = 0;

		// Variable for changes in position when collision occurs
		this.dir = createVector(0, 0);
	}

	draw = function (_font) {
		// Draws the word on the scren
		push();
		noStroke();
		textFont(_font);
		fill(this.wordColor);
		textAlign(CENTER, CENTER);
		textSize(this.size);
		text(this.name, this.pos.x, this.pos.y);

		// Rect for collision tests
		// noFill();
		// stroke(0);
		// strokeWeight(2);
		// rect(this.x1, this.y1, this.w, this.h);

		pop();
	};

	updateSize = function (minQty, maxQty, minText, maxText) {
		// Updates the size according to the number of times the word appears.
		this.size = map(this.quantity, minQty, maxQty, minText, maxText);
	};

	updateBounds = function (_font) {
		// Update x, y coordinates

		let bounds = _font.textBounds(this.name, this.pos.x, this.pos.y, this.size);

		/* Variable to correct error in textBounds function.
		 * After multiples tests, I verified that this function does not
		 * return proper values, especially for smaller text sizes.
		 * */
		let bdErr = 5;

		this.w = bounds.w;
		this.h = bounds.h + 2 * bdErr;

		this.x1 = bounds.x;
		this.x2 = this.x1 + this.w;
		this.y1 = bounds.y + bdErr;
		this.y2 = this.y1 + this.h;
	};

	updatePos = function (_wordCloud, titleHeight) {
		// Updates position on collision

		let v = p5.Vector.random2D();

		// Resets the direction vector
		this.dir.set(0, 0);

		// Update position based on other words
		for (var i = 0; i < _wordCloud.length; i++) {
			if (_wordCloud[i].name != this.name) {
				if (
					this.x1 < _wordCloud[i].x2 &&
					this.x2 > _wordCloud[i].x1 &&
					this.y1 < _wordCloud[i].y2 &&
					this.y2 > _wordCloud[i].y1
				) {
					this.dir.add(v);
				}
			}
		}

		this.dir.normalize();
		this.dir.mult(40);
		this.pos.add(this.dir);

		// Resets first word of the list always to the center.
		_wordCloud[0].pos.set(0, 0);

		// If the words is out of the screen, resets position.
		if (
			this.x1 < -width / 2 ||
			this.x2 > width / 2 ||
			this.y1 < -height / 2 + titleHeight + 20 ||
			this.y2 > height / 2 - titleHeight
		) {
			this.pos.set(0, 0);
		}
	};

	resetPosition = function () {
		this.pos.set(0, 0);
	};
}
