var WIDTH;
var HEIGHT;
var canvas = null;
var cxt = null;
var game = null;
var snowflake = null;

function FrameTimer(){
    this._prev_tick = (new Date()).getTime();
	this._tick = 0;
    
    this.getSeconds = function(){        
        return this._frameSpacing / 1000;
    };
    
    this.tick = function(){
        this._tick = (new Date()).getTime();
        this._frameSpacing = this._tick - this._prev_tick;
        this._prev_tick = this._tick;
    }
}

function Flake(){	
	this.angle = Math.random() * Math.PI * 2;	
	this.add_angle = Math.random() * 0.05 + 0.05;
	if (Math.random() > 0.5) this.add_angle *= -1;
	
	this.start_x = Math.random() * WIDTH;
	
	var factor = Math.random();
	this.size = factor * 17 + 16;
	this.half_size = this.size / 2;
	
	this.x = this.start_x  * Math.cos(this.angle);
	this.y = - (factor * 5 + 5);	
}

Flake.prototype.draw = function(){	
	ctx.save();
	ctx.translate(this.x + this.half_size, this.y + this.half_size);
	ctx.rotate(this.angle);
	ctx.drawImage(snowflake, -this.half_size, -this.half_size, this.size, this.size);	
	ctx.restore();
}

Flake.prototype.update_ok = function(dt){
	this.angle += 10*this.add_angle*dt;	
	this.x = this.start_x + Math.cos(this.angle)*20;
	this.y += 20*dt;
}

Flake.prototype.update_jerked = function(dt){
	this.angle += 10*this.add_angle*dt;	
	this.x = this.start_x + Math.cos(this.angle)*2000*dt;
	this.y += 20*dt;
}

Flake.prototype.update = Flake.prototype.update_ok;

function Thing(){
	this.timer = new FrameTimer();
	this.timer.tick();	
	
	this.pile = 0;
	this.flakes = [];	
	
	this.normal_dx = 20;
	
	
	snowflake = document.getElementById("snowflake");
}

Thing.prototype.clear_proper = function(){ ctx.clearRect(0, 0, WIDTH, HEIGHT); }

Thing.prototype.clear_not_so_much = function(){}

Thing.prototype.clear = Thing.prototype.clear_proper;

Thing.prototype.run = function(){
    var dt = this.timer.getSeconds();  
	
	this.pile += dt;
	if (this.pile > 0.5) {
		this.pile = 0;

		this.flakes.push(new Flake());		
		
		if (this.flakes.length > 200){
			this.flakes.splice(0, 100);
		}
	}
	
	for (var i = 0, len = this.flakes.length; i < len; i++){
		this.flakes[i].update(dt);
	}
	
    this.clear();
	
	for (var i = 0, len = this.flakes.length; i < len; i++){
		this.flakes[i].draw();
	}
   
	this.timer.tick();				
}

window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       || 
              window.webkitRequestAnimationFrame || 
              window.mozRequestAnimationFrame    || 
              window.oRequestAnimationFrame      || 
              window.msRequestAnimationFrame     || 
              function( callback ){
                window.setTimeout(callback, 1000 / 30);
              };
    })();
	
function resize(){
	WIDTH = window.innerWidth;
	HEIGHT = window.innerHeight;	
	
	canvas.width = WIDTH;
	canvas.height = HEIGHT;	
}

function toggle(event){
	if (event.charCode == 122){		
		if (Flake.prototype.update == Flake.prototype.update_ok){
			Flake.prototype.update = Flake.prototype.update_jerked;
		}
		else{
			Flake.prototype.update = Flake.prototype.update_ok;
		}			
	}
	else if (event.charCode == 120){
		if (Thing.prototype.clear == Thing.prototype.clear_proper){
			Thing.prototype.clear = Thing.prototype.clear_not_so_much;
		}
		else{
			Thing.prototype.clear = Thing.prototype.clear_proper;
		}
	}
}

function init(){
	canvas = document.getElementById('sky');
	ctx = canvas.getContext('2d');	

	game = new Thing();
	window.addEventListener('resize', resize, false);
	window.addEventListener('keypress', toggle, false);

	resize();	
	loop();
}

function loop(){	
	game.run();					
	requestAnimFrame(loop);
};

init();