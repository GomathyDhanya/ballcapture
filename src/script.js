const canvas=document.querySelector('canvas');
const ctx= canvas.getContext('2d');
const width=canvas.width=window.innerWidth;
const height=canvas.height=window.innerHeight;

function random(min, max) {
    const num = Math.floor(Math.random() * (max - min + 1)) + min;
    return num;
  }

function shape(x,y,velx,vely)
{
  this.x=x;
  this.y=y;
  this.velx=velx;
  this.vely=vely;
  this.exists=true;
}

function ball(x,y,velx,vely,color,radius,exists=true)
{ 
    shape.call(this,x,y,velx,vely,exists);
    this.color=color;
    this.radius=radius;
}
function evilcircle(x,y,velx,vely,exists=true)
{
  shape.call(this,x,y,velx,vely,exists);
  this.color='white';
  this.radius=10;
}
evilcircle.prototype.draw=function(){
    ctx.beginPath();
    ctx.strokeStyle=this.color;
    ctx.arc(this.x,this.y,this.radius,0,2*Math.PI);
    ctx.lineWidth=3;
    ctx.stroke();
}
evilcircle.prototype.checkbounds=function(){
  if ((this.x + this.radius) >= width) {
    this.x=this.x-this.radius;
  }
  if((this.x - this.radius) <= 0){
    this.x=this.x+this.radius; 
  }
  if ((this.y + this.radius) >= height) {
    this.y=this.y-this.radius;
  }
  if ((this.y - this.radius) <= 0) {
    this.y=this.y+this.radius;
  }
}

evilcircle.prototype.setcontrols=function() {
  let _this = this;
  window.onkeydown = function(e) {
      if (e.key =="ArrowLeft") {
        _this.x -= _this.velx;
      } else if (e.key =="ArrowRight") {
        _this.x += _this.velx;
      } else if (e.key =="ArrowUp") {
        _this.y -= _this.vely;
      } else if (e.key =="ArrowDown") {
        _this.y += _this.vely;
      }
    } 
}


ball.prototype.draw=function(){
    ctx.beginPath();
    ctx.fillStyle=this.color;
    ctx.arc(this.x,this.y,this.radius,0,2*Math.PI);
    ctx.fill();
}
//let testBall = new ball(50, 100, 4, 4, 'blue', 10);
//testBall.draw();

ball.prototype.update = function() {
    if (((this.x + this.radius) >= width)||((this.x - this.radius) <= 0)) {
      this.velx = -(this.velx);
    }
  
    if (((this.y + this.radius) >= height)|| ((this.y - this.radius) <= 0)){
      this.vely = -(this.vely);
    }
  
    this.x += this.velx;
    this.y += this.vely;
  }
 
let balls=[];
for(let i=1;i<=25;i++){
    let rad=random(10,15);
    let tempball= new ball(random(rad,width-rad),random(rad,height-rad),random(-7,5),random(-7,5), 'rgb(' + random(0,255) + ',' + random(0,255) + ',' + random(0,255) +')',rad );
    balls.push(tempball);
}

ball.prototype.collisionDetect = function() {
  for (let j = 0; j < balls.length; j++) {
    if (!(this === balls[j])) {
      const dx = this.x - balls[j].x;
      const dy = this.y - balls[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.radius + balls[j].radius) {
       let temp=this.color;
       this.color=balls[j].color;
       balls[j].color=temp;
       this.velx=-(this.velx);
       this.vely=-(this.vely);
       balls[j].velx=-(balls[j].velx);
       balls[j].vely=-(balls[j].vely);
      }
    }
  }
}

evilcircle.prototype.collisionDetect= function(){
  for (let j = 0; j < balls.length; j++) {
    if (balls[j].exists===true) {
      const dx = this.x - balls[j].x;
      const dy = this.y - balls[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.radius + balls[j].radius) {
       balls[j].exists=false;
       balls.splice(j,1);
      } 
    }
  }
}
let evil1=new evilcircle(width/2,height/2,10,10);
evil1.setcontrols();

function loop() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.fillRect(0, 0, width, height);
  
    for (let i = 0; i < balls.length; i++) {
      if(balls[i].exists===true)
      {balls[i].draw();
       balls[i].update();
       balls[i].collisionDetect();}
    }

    evil1.draw();
    evil1.checkbounds();
    evil1.collisionDetect();
    if(balls.length>0)
    document.getElementById("score").innerHTML="Move the evil cirlcle with the arrow keys! <br> Number of Balls left: "+balls.length;
    else
    document.getElementById("score").innerHTML="GAME OVER";
    requestAnimationFrame(loop);
    
  }
  //let inter=setInterval(loop,16.7);
  //if(balls.length==0) 
    //clearInterval(inter);
    loop();

  