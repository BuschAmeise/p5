function setup() {
  createCanvas(400, 400);
  y = width/2;
  velY=0;
  posY=0;
  background(220);
}

function physics(y) {
  accY = 1;
  velY += accY;
  posY = y+velY;
  return (posY)
}

function mouseClicked(){
  y -= 50;
}

function draw() {
  //background(220);
  noStroke()
  ellipse(200, physics(y), 50, 50);
    fill(physics(y),100,50)
  
}
