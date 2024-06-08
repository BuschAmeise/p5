let sharks = [];
let numbersOfSharks = 20;
let food = [];
let numberoffood = 40;
var debug

function setup() {
  createCanvas(1080, 720);
  
  for (let i = 0; i < numbersOfSharks; i++) {
    sharks[i] = new predator();
  }

  
  for (let i = numberoffood - 1; i >= 0; i--) {
    let x = random(width);
    let y = random(height);
    food.push(createVector(x, y));
  }
  
  debug = createCheckbox();
  
}

function draw() {
  background(100,150,225);
  
  // if(frameCount % 30 == 0){
  // 	print(sharks.length);
  // }
  for (let i = sharks.length - 1; i >= 0; i--) {
    sharks[i].eat(food);
    sharks[i].update();
    sharks[i].applyForce();
    sharks[i].show();
    
    if (sharks.length > 0 && sharks[i].reproduce() != null) {
      var newShark = new predator(sharks[i].childdna);
      sharks.push(newShark);
    }
    
    if (sharks[i].dead()){
      food.push(createVector(sharks[i].pos.x, sharks[i].pos.y));
      sharks.splice(i,1);
    }

  }
  
//create food
  if (random(1) < 0.05) {
    let x = random(width);
    let y = random(height);
    food.push(createVector(x, y));
  }
  
  for (var i = 0; i < food.length; i++) {
    push()
    stroke(20,20,25)
    fill(255,225,150);
    ellipse(food[i].x, food[i].y, 8,8)
    pop()
  }
}



class predator {
  
    constructor(genes) {
      this.pos = createVector(random(0,width), random(0,height));
      this.vel = createVector(random(-0.5, 0.5),random(-0.5, 0.5));
      this.acc = createVector(0,0);
      
      this.maxSpeed = 5;
      this.maxSteer = 0.2;
      this.perception = 100;
      this.health = 1;
      this.mouthRadius = 1;
      
      this.dna = [];
      this.childdna = [];
      //this.size = 1.5;
      
      if (genes != null) {
        for (let i = 0; i < genes.length; i++) {
          this.dna[i] = genes[i];
        }
        this.perception *= genes[0];
        this.maxSteer *= genes[1];
      } else {
          this.dna[0] = random(0.1,1); //perception
          this.dna[1] = random(0.1,1); // steeringForece
          this.dna[2] = random(1, 2); //size
          this.dna[3] = this.dna[2] * 10; // mouthRadius
        
          this.perception = this.perception * this.dna[0];
          this.maxSteer = this.maxSteer * this.dna[1];
      }
      

    }


  eat(ListOfFood) {
    let smallestFoodDistance = Infinity;
    let IndexOfClosestsFood = null; 
    for (let i = ListOfFood.length-1; i >=0; i--) {
      let actualDistanceToFood = dist(this.pos.x, this.pos.y, ListOfFood[i].x, ListOfFood[i].y);
      if (actualDistanceToFood < smallestFoodDistance && actualDistanceToFood < this.perception) {
        smallestFoodDistance = actualDistanceToFood;
        IndexOfClosestsFood = i;
      }
    }
    
    if (smallestFoodDistance < this.dna[3]) {
      ListOfFood.splice(IndexOfClosestsFood,1);
      if (this.health < 1) {
        this.health += 0.2;
      }
    } else if( IndexOfClosestsFood != null){
       this.seek(food[IndexOfClosestsFood]);
    }
  }
  
  
  seek(food) {
    this.desiredVelocity = p5.Vector.sub(food,this.pos);
    this.desiredVelocity.setMag(this.maxSpeed);
    this.steeringForce = this.desiredVelocity.sub(this.vel);
    this.steeringForce.limit(this.maxSteer);
    this.applyForce(this.steeringForce);
    
    
    // if (debug.checked()) {
    //       push()
    // strokeWeight(2)
    // stroke(200,255,150);
    // line(this.pos.x, this.pos.y, this.pos.x + this.vel.x * 30, this.pos.y + this.vel.y * 30);
    // line(this.pos.x, this.pos.y, this.pos.x + this.desiredVelocity.x * 40, this.pos.y + this.desiredVelocity.y * 40);
    // line(this.pos.x, this.pos.y, this.pos.x + this.steeringForce.x * (100/this.maxSteer), this.pos.y + this.steeringForce.y * (100/this.maxSteer));
    // pop();
    // }

  }
    
  
  update() {    
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
    
    this.health -= 0.004;
    
    // boundaries function 
    // var someOtherPosition = createVector(random(0,width), random(0, height));
    var someOtherPosition = createVector(width/2, height/2);
    var d = 25;
    if (this.pos.x < d) {
      this.seek(someOtherPosition);
    }
   if (this.pos.x > width-d) {
      this.seek(someOtherPosition);
    }    
    if (this.pos.y < d) {
      this.seek(someOtherPosition);
    }
    if (this.pos.y > height-d) {
      this.seek(someOtherPosition);
    }
  }
  
  dead() {
    return (this.health < 0);
  }
  
  reproduce() {
    var chance = 0.002;
    if (random(1) < chance) {
      this.childdna = this.dna;
      //print(this.dna);
      var genemix = random(1);
      if (genemix < 0.25) {
        this.childdna[0] *= 0.9;
        this.childdna[1] *= 1.1;
        this.childdna[2] *= random(0.9, 1);
      } else if (genemix > 0.25 && genemix < 0.5){
        this.childdna[0] *= 1.1;
        this.childdna[1] *= 0.9;
        this.childdna[2] *= random(1, 1.1);
      } else {
        this.childdna[0] *= 1;
        this.childdna[1] *= 1;
        this.childdna[2] *= 1;
      }
    return (1);
    } else {
      return (null);
    }
  }
  
  applyForce(force) {
    this.acc.add(force);
  }
  
  
  show() {
    
    if (debug.checked()) {
      push()
        noFill()
        strokeWeight(2);
        stroke(0,0,255,120)
        circle(this.pos.x, this.pos.y, this.perception*2)
      pop()
      
      push()
        noFill()
        strokeWeight(2);
        stroke(0,255,0,120)
        circle(this.pos.x, this.pos.y, this.health * 100);
      pop()
      
      push()
        noFill()
        strokeWeight(2);
        stroke(255,0,0,120);
        circle(this.pos.x, this.pos.y, this.dna[1] * 100);
      pop()
        push()
        noFill()
        strokeWeight(2);
        stroke(255,255,255,120)
        circle(this.pos.x, this.pos.y, this.dna[3]);
      pop()
    }
    
    // Shark-Shape
    var s = this.dna[2]; // for drawing bigger and smaller
    push()
    fill(map(this.health, 0, 1, 255, 0),100,100);
    translate(this.pos.x, this.pos.y)
    rotate(this.vel.heading()+PI);
    beginShape()
    vertex(-2*s,0 );
    vertex(0*s,2*s );
    vertex(4*s, 3*s);
    vertex(6*s, 6*s);
    vertex(6*s, 3*s);
    vertex(14*s, 1*s);
    vertex(16.5*s,4*s);
    vertex(16*s, 0);
    vertex(16.5*s, -4*s);
    vertex(14*s, -1*s );
    vertex(6*s, -3*s);
    vertex(6*s, -6*s);
    vertex(4*s, -3*s);
    vertex(0*s,-2*s );
    vertex(-2*s,0 );
    endShape();
    pop()
  }
}
