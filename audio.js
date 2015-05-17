var audioData = {
  loadSounds: function () {

  },
  soundLoaded: function () {
    audioData.loadCount += 1;
  },
  loadCount: 0,
  totalSounds: 7
};
// Lets me turn sound off
if (AUDIO_ON) {
  audioData.sparkleSmall = new Audio('sounds/sparkleSmall2.wav');
  audioData.sparkleBig = new Audio('sounds/sparkleBig2.wav');
  audioData.buzzSmall = new Audio('sounds/buzzSmall.wav');
  audioData.buzzBig = new Audio('sounds/buzzBig.wav');
  audioData.powerupGet = new Audio('sounds/powerupGet.wav');
  audioData.powerupUse = new Audio('sounds/powerupUse.wav');
  audioData.barrierWarning = new Audio('sounds/barrierWarning.wav');
} else {
  audioData.sparkleSmall = new Audio('sounds/silence.wav');
  audioData.sparkleBig = new Audio('sounds/silence.wav');
  audioData.buzzSmall = new Audio('sounds/silence.wav');
  audioData.buzzBig = new Audio('sounds/silence.wav');
  audioData.powerupGet = new Audio('sounds/silence.wav');
  audioData.powerupUse = new Audio('sounds/silence.wav');
  audioData.barrierWarning = new Audio('sounds/silence.wav');
}
