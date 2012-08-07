var audioData = {
  loadSounds: function () {

  },
  soundLoaded: function () {
    audioData.loadCount += 1;
  },
  loadCount: 0,
  totalSounds: 0
};
audioData.sparkleSmall = new Audio('sounds/sparkleSmall.wav');
audioData.sparkleBig = new Audio('sounds/sparkleBig.wav');
