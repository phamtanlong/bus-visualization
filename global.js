//global 
//variant + constant


//NAMING CONVENTION
//Object3D's name
//THREE.Scene's direct child

//Bus route
//"busroute" + number

//Bus time
//"bustime" + number

//Bus route + time
//"bus" + number

//Asix
//"axis_Ox"
//"axis_Oy"
//"axis_Oz"
//"axis" => 3 axis
//"ruler" => ruler
//"axis_ruler" => axis + ruler

//Map
//"map"

//Light
//"light_ambient"
//"light_direction"
//

//Map
//"map"



/////////// raycasting


var projector;


/////////// main


var WINDOW_WIDTH = 1366;
var WINDOW_HEIGHT = 1000;


//constants
var container, stats;
var camera, controls, scene, renderer;
var cross;
var all_bus_data; //data
var chart_objects = []; //list of chart object
var time = Date.now();

var mesh1, mesh2;
var allMesh = new THREE.Object3D();
var rulers;


/////////// draw chart


//scale to draw in time ruler
//position.y = timeInHour * TIME_SCALE;
var TIME_SCALE = 60;
// 1h 		= 6 unit
// 10min 	= 1 unit

var START_TIME = 5; //5h00 sáng
var END_TIME = 21; //21h00 tối



//length of axis: Ox, Oy, Oz
var AXIS_LEN = 620;

//map mesh
var mapMesh;
var mapGeo;
var mapPos;

var REAL_MAP_WIDTH = 1500;
var REAL_MAP_HEIGHT = 1000;

var MAP_WIDTH = 600; //600; //512; //1024; //2048; //4096;
var MAP_HEIGHT = 400; //341; //683; //1365; //2729;

var MAP_SCALE = MAP_WIDTH / REAL_MAP_WIDTH;
var BUS_RADIUS = 0.8;

var objAxis = new THREE.Object3D();
var ORIGIN_POSITION = {x: 0, y: 0};


