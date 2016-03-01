//check if WebGl is enable
if ( ! Detector.webgl ) Detector.addGetWebGLMessage();


//start game
init();
loop();

//---------------------------- functions -----------------------------
//init
function init() {

	//drag and drop file

	document.addEventListener( 'dragover', onDragOver, false);
	document.addEventListener( 'drop', onDrop, false);
	document.addEventListener( 'keydown', onKeyDown, false);

	//init window

	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera( 60, WINDOW_WIDTH / WINDOW_HEIGHT, 0.01, 4096);
	camera.position.x = 30;
	camera.position.y = 120;
	camera.position.z = 160;
	camera.lookAt(new THREE.Vector3(0,0,0));

	container = document.getElementById( 'container' );
	controls = new THREE.OrbitControls( camera, document );
	
	// renderer

	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setClearColor( 0xBDBDBD, 1 );
	renderer.setSize( WINDOW_WIDTH, WINDOW_HEIGHT );
	var rendererDOM = renderer.domElement;
	//rendererDOM.style.position = "absolute";
	//rendererDOM.style.left = "-200px";
	//rendererDOM.style.top = "0px";
	container.appendChild( rendererDOM );

	//show game state in the botom-right
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.bottom = '0px';
	stats.domElement.style.right = '0px';
	stats.domElement.style.zIndex = 100;
	container.appendChild( stats.domElement );

	//auto-resize window

	//THREEx.WindowResize(renderer, camera);

	//lights
	// add subtle ambient lighting
	var ambientLight = new THREE.AmbientLight(0xffffff);
	ambientLight.name = "light_ambient1";
	scene.add(ambientLight);

	// directional lighting
	var directionalLight = new THREE.DirectionalLight(0xffffff);
	directionalLight.position.set(1, 1, 1).normalize();
	directionalLight.name = "light_direction1";
	scene.add(directionalLight);

	//draw default data chart
	drawChart(scene);


	// //show data in text area 'input'
	// var input = document.getElementById('input');
	// input.value = JSON.stringify(all_bus_data);
	// input.onkeydown = function(e){ //enable 'TAB'
 //        if(e.keyCode==9 || event.which==9){
 //            e.preventDefault();
 //            var s = this.selectionStart;
 //            this.value = this.value.substring(0,this.selectionStart) + "\t" + this.value.substring(this.selectionEnd);
 //            this.selectionEnd = s+1;
 //        }
 //    }
}


function update () {
	//update map postion
	var O = controls.target;
	objAxis.position.set(O.x, O.y, O.z);

	//update ruler rotation
	var P = camera.position;
	var dz = O.z - P.z;
	var dx = O.x - P.x;
	var tan = dz/dx;
	var angleInDeg = Math.atan(tan);
	//var angleInRad = angleInDeg / 180 * Math.PI;
	if(dx < 0) {
		rulers.rotation.y = Math.PI / 6 - angleInDeg;
	} else {
		rulers.rotation.y = Math.PI + Math.PI / 6 - angleInDeg;
	}
}


function loop() {
	requestAnimationFrame( loop );
	
	//
	controls.update();
	update();

	//
	renderer.render( scene, camera );
	stats.update();
}


//functions
function refreshChart() {
	//remove all chart objects
	for (var i = 0; i < chart_objects.length; i++) {
		scene.remove(chart_objects[i]);
	};

	chart_objects = []; //clear
	drawChart(scene); //redraw
}

//drag and drop

function onDragOver(event) {
	event.preventDefault();
}

function onDrop(event) {
	event.preventDefault();

	//read all file
	for(var i = 0; i < event.dataTransfer.files.length; i++){
		var file	= event.dataTransfer.files[i];
		var reader	= new FileReader();
		reader.onload = function (event){
			var dataUri	= event.target.result;
			var base64	= dataUri.match(/[^,]*,(.*)/)[1];
			var json	= window.atob(base64);

			try
		  	{
				all_bus_data	= JSON.parse(json);
				var input = document.getElementById('input');
				input.value = json;
				refreshChart();
		  	}
			catch(err)
			{
				alert('Invalid data!');
			}
		};
		reader.readAsDataURL(file);
	}
}

function onKeyDown (event) {

	switch(event.keyCode) {
		case 49: //1
			showAllBusTrip(scene);
		break;
		
		case 50: //2
			hideAllBusTrip(scene);
		break;

		case 38: //UP
			rulers.position.set(rulers.position.x, rulers.position.y + 2, rulers.position.z);
		break;

		case 40: //DOWN
			rulers.position.set(rulers.position.x, rulers.position.y - 2, rulers.position.z);
		break;
	}
}

function loadNewData () {
	var input = document.getElementById('input');
	try
  	{
		all_bus_data = JSON.parse(input.value);
		refreshChart();
  	}
	catch(err)
	{
		alert('Invalid data!');
	}
}
