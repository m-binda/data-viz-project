var data;
var waffles = [];
var waffle;

function preload() {
	data = loadTable("finalData.csv", "csv", "header");
}

function setup() {
	createCanvas(1000, 1000);

	var days = ["Monday", "Tuesday", "Wednesday",
		"Thursday", "Friday", "Saturday", "Sunday"
	];

	var values = ['Take-away', 'Cooked from fresh', 'Ready meal', 'Ate out',
		'Skipped meal', 'Left overs'
	]

	// waffle = new Waffle(30, 30, 300, 300, 10, 10, data,
	// 	"Monday", values);

	for (let i = 0; i < days.length; i++) {
		if (i < 4) {
			waffles.push(new Waffle(20 + (i * 220), 20, 200, 200, 10, 10, data,
				days[i], values));
		}
		else {
			waffles.push(new Waffle(120 + ((i - 4) * 220), 240, 200, 200, 10, 10, data, days[i], values));
		}
	}


}

function draw() {
	background(255);
	for (let i = 0; i < waffles.length; i++) {
		waffles[i].draw();
	}
	for (let i = 0; i < waffles.length; i++) {
		waffles[i].checkMouse(mouseX, mouseY);
	}
}