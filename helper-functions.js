// --------------------------------------------------------------------
// Data processing helper functions.
// --------------------------------------------------------------------
function sum(data) {
  var total = 0;

  // Ensure that data contains numbers and not strings.
  data = stringsToNumbers(data);

  for (let i = 0; i < data.length; i++) {
    total = total + data[i];
  }

  return total;
}

function mean(data) {
  var total = sum(data);

  return total / data.length;
}

function sliceRowNumbers(row, start = 0, end) {
  var rowData = [];

  if (!end) {
    // Parse all values until the end of the row.
    end = row.arr.length;
  }

  for (i = start; i < end; i++) {
    rowData.push(row.getNum(i));
  }

  return rowData;
}

function stringsToNumbers(array) {
  return array.map(Number);
}

// --------------------------------------------------------------------
// Plotting helper functions
// --------------------------------------------------------------------

function drawAxis(layout, colour = 0) {
  stroke(color(colour));

  // x-axis
  line(layout.leftMargin,
    layout.bottomMargin,
    layout.rightMargin,
    layout.bottomMargin);

  // y-axis
  line(layout.leftMargin,
    layout.topMargin,
    layout.leftMargin,
    layout.bottomMargin);
}

function drawAxisLabels(xLabel, yLabel, layout) {
  fill(0);
  noStroke();
  textAlign('center', 'center');

  // Draw x-axis label.
  text(xLabel,
    (layout.plotWidth() / 2) + layout.leftMargin,
    layout.bottomMargin + (layout.marginSize * 1.5));

  // Draw y-axis label.
  push();
  translate(layout.leftMargin - (layout.marginSize * 1.5),
    layout.bottomMargin / 2);
  rotate(-PI / 2);
  text(yLabel, 0, 0);
  pop();
}

function drawYAxisTickLabels(min, max, layout, mapFunction,
  decimalPlaces) {
  // Map function must be passed with .bind(this).
  var range = max - min;
  var yTickStep = range / layout.numYTickLabels;
  strokeWeight(1)
  fill(0);
  noStroke();
  textAlign('right', 'center');

  // Draw all axis tick labels and grid lines.
  for (i = 0; i <= layout.numYTickLabels; i++) {
    var value = min + (i * yTickStep);
    var y = mapFunction(value);

    // Add tick label.
    text(value.toFixed(decimalPlaces),
      layout.leftMargin - layout.pad,
      y);

    if (layout.grid) {
      // Add grid line.
      stroke(200);
      line(layout.leftMargin, y, layout.rightMargin, y);
    }
  }
}

function drawXAxisTickNumber(value, layout, mapFunction) {
  // Map function must be passed with .bind(this).
  var x = mapFunction(value);

  fill(0);
  noStroke();
  textAlign('center', 'center');

  // Add tick label.
  text(value,
    x,
    layout.bottomMargin + layout.marginSize / 2);

  if (layout.grid) {
    // Add grid line.
    stroke(220);
    strokeWeight(1)
    line(x,
      layout.topMargin,
      x,
      layout.bottomMargin);
  }

}

function drawXAxisTickFullDate(layout, widthProportion, values) {

  for (let i = 0; i < values.length; i++) {
    let x = layout.leftMargin + (widthProportion * (i - 1));
    let y = layout.bottomMargin + ((layout.marginSize * 1.3) * (i % 4 / 3));
    let xGrid = layout.leftMargin + (widthProportion * i);

    fill(0);
    noStroke();
    textAlign('center', 'center');


    // Add tick label, skipping one every three.
    if (i % 2 !== 0) {
      // Writes the text and rotates it
      push();
      translate(x, y);
      rotate(HALF_PI - 1.3);
      text(values[i], 0, 0);
      pop();

      // Draws the line connecting the date to the graph
      stroke(155);
      strokeWeight(0.5);
      line(x, y - 10, x, layout.bottomMargin)
    }


    if (layout.grid) {
      // Add grid line.
      stroke(220);
      strokeWeight(1)
      line(xGrid,
        layout.topMargin,
        xGrid,
        layout.bottomMargin);
    }
  }
}