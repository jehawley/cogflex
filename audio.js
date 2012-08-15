var audioData = {
  loadSounds: function () {

  },
  soundLoaded: function () {
    audioData.loadCount += 1;
  },
  loadCount: 0,
  totalSounds: 4
};
audioData.sparkleSmall = new Audio('sounds/sparkleSmall2.wav');
audioData.sparkleBig = new Audio('sounds/sparkleBig2.wav');
audioData.buzzSmall = new Audio('sounds/buzzSmall.wav');
audioData.buzzBig = new Audio('sounds/buzzBig.wav');
