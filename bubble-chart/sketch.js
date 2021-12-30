var data;
var bubbles = [];
var maxAmt;
var years = [];
var yearButtons = [];

function preload() 
{
	data = loadTable("foodData.csv", "csv", "header");
}

function setup()
{
	createCanvas(1000, 1000);

    var rows = data.getRows();
    var numColumns = data.getColumnCount();
    
    for(var i = 5; i < numColumns; i++)
    {
        var y = data.columns[i];
        years.push(y);
        b = createButton(y,y);
        b.parent('years')
        b.mousePressed(function()
        {
           changeYear(this.elt.value);
        })
        yearButtons.push(b);
        
        
    }
    
    
    maxAmt = 0;
    
    for(var i = 0; i < rows.length; i++)
    {
        if(rows[i].get(0) != "")
        {
            var b = new Bubble(rows[i].get(0));
            
            for(var j = 5; j < numColumns; j++)
            {
                if(rows[i].get(j) != "")
                {
                    var n = rows[i].getNum(j);
                    if(n > maxAmt)
                    {
                        maxAmt = n; //keep a tally of the highest value
                    }
                    b.data.push(n);
                }
                else
                {
                     b.data.push(0);
                }
                
            }
            
            bubbles.push(b);
        }
        
    }
    
    for(var i = 0; i < bubbles.length; i++)
    {
        bubbles[i].setData(0);
    }
    
}

function changeYear(year)
{
    var y = years.indexOf(year);
    
    for(var i = 0; i < bubbles.length; i++)
    {
        bubbles[i].setData(y);
    }
}


function draw() 
{
    background(100);
    
    translate(width/2, height/2);
    for(var i = 0; i < bubbles.length; i++)
    {
        bubbles[i].update(bubbles);
        bubbles[i].draw();
    }
}

function Bubble(_name)
{
    this.size = 20;
    this.target_size = 20;
    this.pos = createVector(0,0);
    this.direction = createVector(0,0);
    this.name = _name;
    this.color = color(random(0,255), random(0,255), random(0,255));
    this.data = [];
    
    this.draw = function()
    {
        push();
        textAlign(CENTER);
        noStroke();
        fill(this.color);
        ellipse(this.pos.x, this.pos.y, this.size);
        fill(0);
        text(this.name,this.pos.x,this.pos.y);
        pop();
    }
    
    this.update = function(_bubbles)
    {
        this.direction.set(0,0);
        
        for(var i = 0; i < _bubbles.length; i++)
        {
            if(_bubbles[i].name != this.name)
            {
                var v = p5.Vector.sub(this.pos,_bubbles[i].pos); 
                var d = v.mag();

                if(d < this.size/2 + _bubbles[i].size/2)
                {
                    if(d > 0)
                    {
                        
                        this.direction.add(v)
                    }
                    else
                    {
                        this.direction.add(p5.Vector.random2D());    
                         
                    }
                }
            }
        }
        
        this.direction.normalize();
        this.direction.mult(2);
        this.pos.add(this.direction);
        
        if(this.size < this.target_size)
        {
            this.size += 1;
        }
        else if(this.size > this.target_size)
        {
            this.size -= 1;
        }
       
    }
    
    this.setData = function(i)
    {
        this.target_size = map(this.data[i], 0, maxAmt, 20, 250);
    }
    
    
}