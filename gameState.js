var GameState = {
  score: 0,
  multiplier: 1,
  multiplierBar: 0,

  powerupCount: 0,

  reset: function () {
           this.score = 0;
           this.multiplier = 1;
           this.multiplierBar = 0;

           this.powerupCount = 0;

           this.warningState = 0;
         }
};
