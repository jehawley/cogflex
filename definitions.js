var WIDTH = 500;
var HEIGHT = 550;
var DATA_WIDTH = 200;
var DATA_HEIGHT = 200;
var SIDE_WIDTH = 50;
var FPS = 60;

// TODO: Determine appropriate values for these constants
var OFFSET = 75;
var BAR_WIDTH = 16;
var SHIP_WIDTH = 50;
var SHIP_SPEED = 450;
var SHIP_DESCENT = 180;

var BASE_POINTS = 10;
var MULT_INCR = 1;
var MULT_MAX = 10;

var ctx;
var dataCtx;
var backCtx;
var topCtx;
var loopID = -1;
var eventFun;
var powerupUsed = false;
var keysDown = [];
// TODO: Find out if this optimization is necessary
// var topDirty = true;

var starQueue = [];
var redFlashState = 0;
var xFlashState = 0;
var scoreFlashState = 0;
var multFlashState = 0;
var powerupGetState = 0;
var powerupUseState = 0;
