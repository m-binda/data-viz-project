function Box(x, y, width, height, category) {

    var x = x;
    var y = y;
    var height;
    var width;

    this.category = category; // If this is not made public, there'll
    // be a bug in the code later on
    this.mouseOver = function (mouseX, mouseY) {
        // Is the mouse over this box
        if (mouseX > x && mouseX < x + width &&
            mouseY > y && mouseY < y + height) {
            return this.category.name;
        }
        return false;
    }

    this.draw = function () {
        fill(category.colour);
        rect(x, y, width, height);
    }
}