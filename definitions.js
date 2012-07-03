var WIDTH = 500;
var HEIGHT = 550;
var DATA_WIDTH = 200;
var DATA_HEIGHT = 200;
var SIDE_WIDTH = 50;
var FPS = 60;

// TODO: Determine appropriate values for these constants
var OFFSET = 40;
var BAR_WIDTH = 16;
var SHIP_WIDTH = 50;
var SHIP_SPEED = 450;
var SHIP_DESCENT = 180;

var LEVEL_LENGTH = 80;

var BASE_POINTS = 10;
var MULT_INCR = 1;
var MULT_MAX = 10;

var ctx;
var dataCtx;
var loopID = -1;
var eventFun;
var powerupUsed = false;
var keysDown = [];
