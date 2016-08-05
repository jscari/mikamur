var introState = {
   preload: function() { 
    game.load.image('intro', 'assets/intro.png');    
  },
  create: function() {
  // splash intro
    var logo = game.add.sprite(0, 0, 'intro');
    logo.fixedToCamera = true;
    game.input.onDown.add(function() {      
    //game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
    //game.scale.startFullScreen();
      logo.kill();
      game.state.start('main');
    }.bind(this), this);    
  },
  update: function(){}
}
var mainState = {
  preload: function() { 
    // Load the mika sprite
    game.load.image('mika', 'assets/mika.png');
    game.load.image('wall', 'assets/pipe.png');
    game.load.image('hair', 'assets/hair.png');
    game.load.image('intro', 'assets/intro.png');    
  },
create: function() {
    // Change the background color of the game to blue
    game.stage.backgroundColor = '#71c5cf';

    // Set the physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    // Display the mika at the position x=100 and y=245
    this.mika = game.add.sprite(100, 440, 'mika');
    this.mika.anchor.setTo(0.5, 0.5);
    // Add physics to the mika
    // Needed for: movements, gravity, collisions, etc.
    game.physics.arcade.enable(this.mika);

    // Add gravity to the mika to make it fall
    this.mika.body.gravity.y = 0;  

    // tap control
    game.input.onTap.add(function(e){
      if(this.mika.body.velocity.x === 0) {
        if (Math.floor(e.x/(this.game.width/2)) === 1) {
          this.mika.body.velocity.x = 150;
        }
        if (Math.floor(e.x/(this.game.width/2)) === 0) {
          this.mika.body.velocity.x = -150;
        }
      } else {
        this.mika.body.velocity.x = -this.mika.body.velocity.x;
      }
      }.bind(this));

    // Create an empty group
    this.walls = game.add.group();

    // To actually add walls in our game we need to call the addRowOfWalls() 
    this.timer = game.time.events.loop(1800, this.addRowOfWalls, this);

    // score
    this.score = 0;
    this.labelScore = game.add.text(20, 20, "0", { font: "30px Arial", fill: "#ffffff" });
},

update: function() {
    // If the mika is out of the screen (too high or too low)
    // Call the 'restartGame' function
    if (this.mika.y < 0 || this.mika.y > 490 || this.mika.x < 0 || this.mika.x > 400)
        this.restartGame();

    // call restartGame() each time the mika collides with a wall from the walls group.
    game.physics.arcade.overlap(
    this.mika, this.walls, this.restartGame, null, this);

    //key press
    if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
    {
       this.mika.body.velocity.x = -150;
    }
    else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
    {
       this.mika.body.velocity.x = 150;
    }
    
},
addOneWall: function(x, y) {
    // Create a wall at the position x and y
    var wall = game.add.sprite(x, y, 'wall');

    // Add the wall to our previously created group
    this.walls.add(wall);

    // Enable physics on the wall 
    game.physics.arcade.enable(wall);

    // Add velocity to the wall 
    wall.body.velocity.y = 150; 

    // Automatically kill the wall when it's no longer visible 
    wall.checkWorldBounds = true;
    wall.outOfBoundsKill = true;
},
addRowOfWalls: function() {
    var hole = Math.floor(Math.random() * 4) + 2;

    // Add the 6 walls 
    // With one big hole
    for (var i = 0; i < 8; i++)
        if (i != hole && i != hole - 1 && i != hole + 1 && i != hole + 2) 
            this.addOneWall(i * 50, 10);   
    this.score += 1;
    this.labelScore.text = this.score; 
    game.add.sprite(45 +this.score * 5, 22, 'hair');

    // faster
    if(this.score % 3 === 0) {
      game.time.events.remove(this.timer);
      this.timer = game.time.events.loop(1800 - this.score * 30, this.addRowOfWalls, this);
    }
},
// Restart the game
restartGame: function() {
    // Start the 'main' state, which restarts the game
    this.game.state.states['score'].score = this.score;
    game.state.start('score');
},
};

var scoreState = {
   preload: function() { 
    game.load.image('score', 'assets/score.png');    
  },
  create: function() {
  // splash intro
    var score = game.add.sprite(20, 200, 'score');
     score.fixedToCamera = true;
    this.labelScore = game.add.text(120, 210, "Tu as gagné", { font: "30px Arial", fill: "#ffffff" });
   
    this.labelScore = game.add.text(120, 260, this.score + " cheveux !", { font: "35px Arial", fill: "#ffffff" });
    game.input.onDown.add(function() { 
      score.kill();
      game.state.start('main');
    }.bind(this), this);    
  },
  update: function(){}
}

var game = new Phaser.Game(400, 490);


game.state.add('intro', introState); 
game.state.add('main', mainState); 
game.state.add('score', scoreState); 

game.state.start('intro');



