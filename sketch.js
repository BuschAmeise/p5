function setup() {
  createCanvas(400, 400);
  y = width/2;
  velY=0;
  posY=0;
}

function physics(y) {
  accY = random(-1,1);
  velY += accY;
  posY = y+velY;
  return (posY)
}

function bounce(y) {
  if (y > width) {
    y = width/2
  }
}

function draw() {
  background(220);
  ellipse(200, physics(y), 50, 50);
}
