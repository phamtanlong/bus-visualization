//WebGL have right-handed cordinate
//but this application want to view in left-handed cordinate
//so, all core functions here will use Y value to view in Oz, Z value to view in Oy
//these functions are marked: "TRANS"



//Oyz
//scene to draw to
//p1 = [x1,y1,z1]
//p2 = [x2,y2,z2]
//color = 0xFF0000
function createDashedLine(p1, p2, color) {
	var line_color = (color == undefined) ? 0xFF0000 : color;
	var geometry = new THREE.Geometry();
	geometry.vertices.push( new THREE.Vector3( p1[0], p1[2], p1[1] ) ); //oz-oy
	geometry.vertices.push( new THREE.Vector3( p2[0], p2[2], p2[1] ) );
	geometry.computeLineDistances();

	var line = new THREE.Line( geometry, new THREE.LineDashedMaterial( { color: line_color, dashSize: 3, gapSize: 1, linewidth: 2 } ), THREE.LinePieces );

	chart_objects.push(line);
	
	return line;
}

//Oyz
//default 0.25
function createLine(p1, p2, color, radius) {
	var line_color = (color == undefined) ? 0xFF0000 : color;
	var r = (radius == undefined) ? 0.25 : radius;
	var pointX = new THREE.Vector3(p1[0], p1[2], p1[1]);
	var pointY = new THREE.Vector3(p2[0], p2[2], p2[1]);

    // edge from X to Y
    var direction = new THREE.Vector3().subVectors( pointY, pointX );
    var arrow = new THREE.ArrowHelper( direction, pointX );

    // cylinder: radiusAtTop, radiusAtBottom, 
    //     height, radiusSegments, heightSegments
    var edgeGeometry = new THREE.CylinderGeometry( r, r, direction.length(), 8, 1, false); //default r = 0.25

    var material = new THREE.MeshBasicMaterial( { color: line_color } );
    material.shading = THREE.SmoothShading;

    var edge = new THREE.Mesh( edgeGeometry, material);
    edge.rotation = arrow.rotation.clone();
    edge.position = new THREE.Vector3().addVectors( pointX, direction.multiplyScalar(0.5) ); //multiplyScalar(0.5)

    chart_objects.push(edge);

    return edge;
}


//Oyz
//default size = 1
function createPoint(p, size, color) {
	var c = (color == undefined) ? 0x0000ff : color;
	var s = (size == undefined) ? 1 : size;

	//SPHERE
	// set up the sphere vars
	var radius = s,
	    segments = 8 * s,
	    rings = 8 * s;
	var geometry = new THREE.SphereGeometry( radius, segments, rings);
	var material = new THREE.MeshNormalMaterial();

	var point = new THREE.Mesh( geometry, material );
		point.position.x = p[0];
		point.position.y = p[2];
		point.position.z = p[1];
		point.updateMatrix();
		point.matrixAutoUpdate = false;
	//
	chart_objects.push(point);

	return point;

	//CUBE
	// var c = (color == undefined) ? 0x0000ff : color;
	// var s = (size == undefined) ? 1 : size;
	// var geometry = new THREE.CubeGeometry(s, s, s);
	// var material = new THREE.MeshNormalMaterial();

	// var point = new THREE.Mesh( geometry, material );
	// 	point.position.x = p[0];
	// 	point.position.y = p[2];
	// 	point.position.z = p[1];
	// 	point.updateMatrix();
	// 	point.matrixAutoUpdate = false;
	// //
	// chart_objects.push(point);

	// return point;
}

//Oyz
function createText(text, size, position, colorFront, colorSide) {
	var font_size = (size == undefined) ? 10 : size;
	var cFront = (colorFront == undefined) ? 0xFFFFFF : colorFront;
	var cSide = (colorSide == undefined) ? 0x737373 : colorSide;

	// add 3D text
	var materialFront = new THREE.MeshBasicMaterial( { color: cFront } );
	var materialSide = new THREE.MeshBasicMaterial( { color: cSide } );
	var materialArray = [ materialFront, materialSide ];

	var obj = {
		size: font_size, height: 1, curveSegments: 1,
		font: "optimer", weight: "normal", style: "normal",
		bevelThickness: 1, bevelSize: 1, bevelEnabled: false,
		material: 0, extrudeMaterial: 1
	};

	var textGeom = new THREE.TextGeometry(text, obj);
	// font: helvetiker, gentilis, droid sans, droid serif, optimer
	// weight: normal, bold
	
	var textMaterial = new THREE.MeshFaceMaterial(materialArray);
	var textMesh = new THREE.Mesh(textGeom, textMaterial );
	
	textGeom.computeBoundingBox();
	
	textMesh.position.set(position[0], position[2], position[1]);
	textMesh.rotation.y = 45;

	chart_objects.push(textMesh);
	
	return textMesh;
}


//Oyz
function createAxis() {
	var obj = new THREE.Object3D();

	//Ox
	var p0 = [0, 0, 0];
	var px = [AXIS_LEN, 0, 0];
	var obj1 = createLine(p0, px, 0xFF0000, 0.5);
  	var obj2 = createText("X", 10, [AXIS_LEN, 0, 0], "red", "white");
  	obj1.name = obj1.id = "axis_Ox";
  	obj2.name = obj2.id = "X";


  	//Oy
  	var py = [0, 0, AXIS_LEN];
  	var py0 = [0, 0, -5];
	var obj3 = createLine(py0, py, 0x00FF00, 2.0);
  	var obj4 = createText("Y", 10, [0, AXIS_LEN, 0], "red", "white");
  	obj3.name = obj3.id = "axis_Oy";
  	obj4.name = obj4.id = "Y";


  	//Oz
  	var pz = [0, AXIS_LEN, 0];
	var obj5 = createLine(p0, pz, 0x0000FF, 0.0);
  	var obj6 = createText("Z", 10, [0, 0, AXIS_LEN], "red", "white");
  	obj5.name = obj5.id = "axis_Oz";
  	obj6.name = obj6.id = "Z";

  	//obj.add(obj1);
  	//obj.add(obj2);
  	obj.add(obj3);
  	obj.add(obj4);
  	//obj.add(obj5);
  	//obj.add(obj6);

  	obj.name = obj.id = "axis";

  	return obj;
}

//Oyz
//draw ruler in Oz
function createRulers () {
	var obj = new THREE.Object3D();

  	for (var i = START_TIME * 60; i <= END_TIME * 60; i += 10) { //in minute
  		var h = (i / 60 - START_TIME) * TIME_SCALE;

		var p = [0, 0, h];
		var obj7 = createPoint(p, 2.5, 0xffffff);

		var p1 = [0, -4, h];
		var obj8 = createText(MyUltils.TimeToString(i), 4, p1, "red", "gray");

		obj7.id = obj7.name = "ruler_point";
		obj8.id = obj8.name = "ruler_text";

		obj.add(obj7);
		obj.add(obj8);
	};

	obj.name = obj.id = "ruler";
	return obj;
}


function createMapMesh() {
	//map texture
	var mapTex = new THREE.ImageUtils.loadTexture("images/bus_map.jpg");
	mapTex.min_filter = THREE.LinearFilter;
	mapTex.mag_filter = THREE.LinearFilter;
	//mapTex.wrapS = THREE.RepeatWrapping;
	//mapTex.wrapT = THREE.RepeatWrapping;
	//mapTex.repeat.x = 2;
	//mapTex.repeat.y = 2;

	var planeMat = new THREE.MeshLambertMaterial({
		map: mapTex,
		opacity: 1.0,
		side: THREE.DoubleSide // THREE.DoubleSide //FrontSide
	});

	var planeGeo = new THREE.PlaneGeometry(MAP_WIDTH, MAP_HEIGHT);//AXIS_LEN, AXIS_LEN);

	var mapMesh = new THREE.Mesh(planeGeo, planeMat);

	var position = new THREE.Vector3(MAP_WIDTH/2, -1.2, MAP_HEIGHT/2);
	mapMesh.position = position;
	mapMesh.rotation.set(-Math.PI / 2, 0, 0);
	mapMesh.overdraw = true;

	chart_objects.push(mapMesh);
	
	return {mapMesh: mapMesh, planeGeo:planeGeo, position:position};
}


//public function => event handle checkbox "show map"
function showMap(check) {
	if(check == true) {
		var map = createMapMesh();

		mapMesh = map.mapMesh;
		mapGeo = map.planeGeo;
		mapPos = map.position;

		mapMesh.name = "map";
		scene.add(mapMesh);
	} else {
		scene.remove(mapMesh);
	}
}

function createBus (one_bus_data, color, number) {

	var obj = new THREE.Object3D();

	for (var i = 0; i < one_bus_data.length - 1; i++) {
		var bs = one_bus_data[i];
		var bs1 = one_bus_data[i + 1];

		//location
		var p0 = [bs[0], bs[1], 0];
		var p1 = [bs1[0], bs1[1], 0];
		
		//locations line

		var line1 = createLine(p0, p1, color, BUS_RADIUS);
		var point1 = createPoint(p0, 1, color);
		//last point
		if(i == one_bus_data.length - 1 - 1) {
			var point2 = createPoint(p1, 1, color);
		}

		obj.add(line1);
		obj.add(point1);
		obj.add(point2);
	};

	////show number
	// var p = one_bus_data[0];
	// var pN = one_bus_data[one_bus_data.length - 1];
	// var text1 = createText("" + number, 10, [p[0], p[1], 0], "red", "white");
	// var textN = createText("" + number, 10, [pN[0], pN[1], 0], "red", "white");
	// obj.add(text1);
	// obj.add(textN);

	return obj;
}

function createTimeLine (one_bus_data, color) {

	var obj = new THREE.Object3D();

	for (var i = 0; i < one_bus_data.length - 1; i++) {
		var bs = one_bus_data[i];
		var bs1 = one_bus_data[i + 1];

		//location
		var p0 = [bs[0], bs[1], 0];
		var p1 = [bs1[0], bs1[1], 0];
		//time
		var t0 = [bs[0], 
				bs[1], 
				bs[2] * TIME_SCALE];
		var t1 = [bs1[0], 
				bs1[1], 
				bs1[2] * TIME_SCALE];
		//ruler
		var r0 = [0, 0, bs[2] * TIME_SCALE];
		var r1 = [0, 0, bs1[2] * TIME_SCALE];

		//times line		

		var line2 = createLine(t0, t1, color);
		var point3 = createPoint(t0, color);
		//last point
		if(i == one_bus_data.length - 1 - 1) {
			var point4 = createPoint(t1, color);
		}

		obj.add(line2);
		obj.add(point3);
		obj.add(point4);
	};

	return obj;
}

function createConnectTimeBus (one_bus_data, color) {

	var obj = new THREE.Object3D();

	for (var i = 0; i < one_bus_data.length - 1; i++) {
		var bs = one_bus_data[i];
		var bs1 = one_bus_data[i + 1];

		//location
		var p0 = [bs[0], bs[1], 0];
		var p1 = [bs1[0], bs1[1], 0];
		//time
		var t0 = [bs[0], 
				bs[1], 
				bs[2] * TIME_SCALE];
		var t1 = [bs1[0], 
				bs1[1], 
				bs1[2] * TIME_SCALE];
		//ruler
		var r0 = [0, 0, bs[2] * TIME_SCALE];
		var r1 = [0, 0, bs1[2] * TIME_SCALE];

		//connect 2 lines

		var dashedLine1 = createDashedLine(p0, t0, 0x9E9E9E);
		if(i == one_bus_data.length - 1 - 1) {
			var dashedLine2 = createDashedLine(p1, t1, 0x9E9E9E);
		}

		obj.add(dashedLine1);
		obj.add(dashedLine2);
	};

	return obj;
}

function createConnectTimeRuler (one_bus_data, color, origin_position) {
	var origin = (origin_position == undefined) ? {x: 0, y: 0} : origin_position;

	var obj = new THREE.Object3D();

	for (var i = 0; i < one_bus_data.length - 1; i++) {
		var bs = one_bus_data[i];
		var bs1 = one_bus_data[i + 1];

		//location
		var p0 = [bs[0], bs[1], 0];
		var p1 = [bs1[0], bs1[1], 0];
		//time
		var t0 = [bs[0], 
				bs[1], 
				bs[2] * TIME_SCALE];
		var t1 = [bs1[0], 
				bs1[1], 
				bs1[2] * TIME_SCALE];
		//ruler
		var r0 = [origin.x, origin.y, bs[2] * TIME_SCALE];
		var r1 = [origin.x, origin.y, bs1[2] * TIME_SCALE];

		//times to ruler

		var dashedLine3 = createDashedLine(r0, t0, 0x7E7E7E);
		//last point
		if(i == one_bus_data.length - 1 - 1) {
			var dashedLine4 = createDashedLine(r1, t1, 0x7E7E7E);
		}

		obj.add(dashedLine3);
		obj.add(dashedLine4);
	};

	return obj;
}

function hideBusTrip (scene, number) {
	for (var i = all_bus_data.length - 1; i >= 0; i--) {
		if(number == all_bus_data[i].number) {
			scene.remove(all_bus_data[i].object);
			break;
		}
	};
}

function showBusTrip (scene, number) {
	for (var i = all_bus_data.length - 1; i >= 0; i--) {
		if(number == all_bus_data[i].number) {
			scene.add(all_bus_data[i].object);
			break;
		}
	};
}

function hideAllBusTrip (scene) {
	for (var i = all_bus_data.length - 1; i >= 0; i--) {
		scene.remove(all_bus_data[i].object);
	};
}

function showAllBusTrip (scene) {
	for (var i = all_bus_data.length - 1; i >= 0; i--) {
		scene.add(all_bus_data[i].object);
	};
}

function moveRulers (h, m) {
	h = h - START_TIME;
	rulers.position.y = - (h * 60 + m) / 60 * TIME_SCALE;
}

var drawChart = function(scene) {

	var axis = createAxis();
	axis.name = "axis";
	rulers = createRulers(); //global
							//move to current time
	var now = new Date();
	var h = now.getHours();
	var m = now.getMinutes();
	if(h >= END_TIME) {
		h = END_TIME;
		m = 0;
	}
	if(h < START_TIME) {
		h = START_TIME;
		m = 0;
	}

	moveRulers(h, m);

	rulers.name = "ruler";
	objAxis.add(axis);
	objAxis.add(rulers);

	objAxis.name = "axis_ruler";
	scene.add(objAxis);

	var check = true;// document.getElementById("checkShowMap").checked;
	showMap(check);

	//draw buses

	//pre-process data
	//scale
	var scale = 0.1;
	for (var i = all_bus_data.length - 1; i >= 0; i--) {
		var one_bus_data = all_bus_data[i].data;

		for (var j = one_bus_data.length - 1; j >= 0; j--) {
			one_bus_data[j][0] *= MAP_SCALE; //x
			one_bus_data[j][1] *= MAP_SCALE; //y
		};
	};

	//draw
	for (var i = all_bus_data.length - 1; i >= 0; i--) {
		var bus = createBus(all_bus_data[i].data, all_bus_data[i].color, all_bus_data[i].number);
		var time = createTimeLine(all_bus_data[i].data, all_bus_data[i].color);
		var timebus = createConnectTimeBus(all_bus_data[i].data, all_bus_data[i].color);
		//var timeruler = createConnectTimeRuler(all_bus_data[i].data, all_bus_data[i].color, ORIGIN_POSITION);

		bus.name = "busroute" + all_bus_data[i].number;
		time.name = "bustime" + all_bus_data[i].number;

		var one_bus_trip = new THREE.Object3D();
		one_bus_trip.add(bus);
		one_bus_trip.add(time);
		one_bus_trip.add(timebus);
		//one_bus_trip.add(timeruler);

		one_bus_trip.id = all_bus_data[i].number;
		one_bus_trip.name = "bus" + all_bus_data[i].number;
		all_bus_data[i].object = one_bus_trip;


		scene.add(one_bus_trip);
	};
}

