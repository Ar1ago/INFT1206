// setup canvas

const para = document.querySelector("p");
let count = 0;

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight);

// function to generate random number

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// function to generate random colour

function randomRGB() {
  return `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;
}

// Modeling a ball in program
class Shape {
  constructor(x, y, velX, velY) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
  }
}

// Make a class that extends from shape
class Ball extends Shape {
  constructor(x, y, velX, velY, color, size) {
    super(x, y, velX, velY);

    this.color = color;
    this.size = size;
    this.exists = true;
  }

  //draw out the circles 
  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
  }
  //determines the movement of the balls and whether they are hitting the outerbounds or not
  update() {
    if (this.x + this.size >= width) {
      this.x = width - this.size;
      this.velX = -Math.abs(this.velX);
    }
    if (this.x - this.size <= 0) {
      this.x = this.size;
      this.velX = Math.abs(this.velX);
    }
    if (this.y + this.size >= height) {
      this.y = height - this.size;
      this.velY = -Math.abs(this.velY);
    }
    if (this.y - this.size <= 0) {
      this.y = this.size;
      this.velY = Math.abs(this.velY);
    }

    this.x += this.velX;
    this.y += this.velY;
  }
  //This function is responsible for detecting when a ball hits another ball
  collisionDetect() {
    for (const ball of balls) {
      if (!(this === ball) && ball.exists) {
        const dx = this.x - ball.x;
        const dy = this.y - ball.y;

        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.size + ball.size) {
          ball.color = this.color = randomRGB();
        }
      }
    }
  }
}

//This class is to create the evil circle
class EvilCircle extends Shape {
  constructor(x, y) {
    super(x, y, 20, 20);

    this.color = "white";
    this.size = 10;
    //This function (eventlistener) reads the keystrokes of the user and moves the evil cirlce in that direction
    window.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "a":
          this.x -= this.velX;
          break;
        case "d":
          this.x += this.velX;
          break;
        case "w":
          this.y -= this.velY;
          break;
        case "s":
          this.y += this.velY;
          break;
      }
    });
  }
  //the draw() fucntion is responsible for actually displaying the evil circle onto the canvas
  draw() {
    ctx.beginPath();
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 3;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.stroke();
  }
  //This will check to make sure that the evil circle doesn't go out of bounds
  checkBounds() {
    if (this.x + this.size >= width) {
      this.x -= this.size;
    }

    if (this.x - this.size <= 0) {
      this.x += this.size;
    }

    if (this.y + this.size >= height) {
      this.y -= this.size;
    }

    if (this.y - this.size <= 0) {
      this.y += this.size;
    }
  }
  //This is for the evil circle, if it touches one of the balls, it deletes the ball it touches
  collisionDetect() {
    for (const ball of balls) {
      if (ball.exists) {
        const dx = this.x - ball.x;
        const dy = this.y - ball.y;

        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.size + ball.size) {
          ball.exists = false;
          count--;
          para.textContent = "Ball count: " + count;
        }
      }
    }
  }
}

//This is to create the evilball using the evilcirlce class
const evilBall = new EvilCircle(random(0, width), random(0, height));

//This is the creation of the balls and it makes 25 instances of it at random sizes 
const balls = [];
while (balls.length < 25) {
  const size = random(10, 20);
  const ball = new Ball(
    random(0 + size, width - size),
    random(0 + size, height - size),
    random(-7, 7),
    random(-7, 7),
    randomRGB(),
    size
  );
  balls.push(ball);
  count++;
  para.textContent = "Ball count: " + count;
}

//This is the main animation loop for the program
function loop() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
  ctx.fillRect(0, 0, width, height);

  for (const ball of balls) {
    if (ball.exists) {
      ball.draw();
      ball.update();
      ball.collisionDetect();
    }
  }

  evilBall.draw();
  evilBall.checkBounds();
  evilBall.collisionDetect();

  requestAnimationFrame(loop);
}

//This runs the function at the end of the program
loop();
