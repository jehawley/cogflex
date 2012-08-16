var audioData = {
  loadSounds: function () {

  },
  soundLoaded: function () {
    audioData.loadCount += 1;
  },
  loadCount: 0,
  totalSounds: 5
};
// Lets me turn sound off
// TODO: Remove for actual release, or add button to toggle this in-game
if (AUDIO_ON) {
  audioData.sparkleSmall = new Audio('sounds/sparkleSmall2.wav');
  audioData.sparkleBig = new Audio('sounds/sparkleBig2.wav');
  audioData.buzzSmall = new Audio('sounds/buzzSmall.wav');
  audioData.buzzBig = new Audio('sounds/buzzBig.wav');
  audioData.powerupGet = new Audio('sounds/powerupGet.wav');
} else {
  audioData.sparkleSmall = new Audio('sounds/silence.wav');
  audioData.sparkleBig = new Audio('sounds/silence.wav');
  audioData.buzzSmall = new Audio('sounds/silence.wav');
  audioData.buzzBig = new Audio('sounds/silence.wav');
  audioData.powerupGet = new Audio('sounds/silence.wav');
}
