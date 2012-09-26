// Basic canvas constants
var WIDTH = 500;
var HEIGHT = 550;
var DATA_WIDTH = 200;
var DATA_HEIGHT = 200;
var SIDE_WIDTH = 50;
var FPS = 60;

// Basic gameplay constants
var OFFSET = 75;
var BAR_WIDTH = 16;
var SHIP_WIDTH = 50;
var SHIP_SPEED = 450;
var SHIP_DESCENT = 180;

var BASE_POINTS = 10;
var MULT_INCR = 1;
var MULT_MAX = 10;

var LEVEL_COUNT = 4;

// Canvases
// The main canvas
var ctx;
// Side canvas for debugging only
var dataCtx;
// Background canvas - usually cleared once per screen
var backCtx;
// Animation canvas - usually cleared once per frame
var topCtx;
var loopID = -1;
var eventFun;
var powerupUsed = false;
var keysDown = [];

// Indicates if the canvas background should be drawn and
// whether setup should be done (if used)
var dirty = true;

// Instruction screen data
var instrArrow = 0;

// Level select screen data
// 1-indexed
var chosenLevel = 1;
var levelScores = [0];

// Level screen counters
var starQueue = [];
var redFlashState = 0;
var xFlashState = 0;
var scoreFlashState = 0;
var multFlashState = 0;
var powerupGetState = 0;
var powerupUseState = 0;
var warningFlashState = 0;
var MAX_WARNINGS = 3;
var forcedLevelQuit = false;

// Level building constants
var LEVEL_LENGTH_MIN = [];
LEVEL_LENGTH_MIN[1] = 60;
LEVEL_LENGTH_MIN[2] = 60;
LEVEL_LENGTH_MIN[3] = 60;
LEVEL_LENGTH_MIN[4] = 60;
// The number of distinct SideA/SideB image pairs
var DISTINCT_SIDE_COUNT = [undefined, 2, 2, 2, 2];
var sideImageCount = 0;
var sideImageCurr = 0;
var sideImageChangeover = [];

// Data to be sent to the server
// TODO: Remove
var tempRecord = [];

// TODO: Remove or add toggle button in-game
var AUDIO_ON = true;
