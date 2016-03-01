//Raycasting

projector = new THREE.Projector();
document.addEventListener( 'dblclick', raycastMouseDbClick, false );
document.addEventListener( 'mousedown', raycastMouseDown, false);
document.addEventListener( 'mousemove', raycastMouseMove, false);
document.addEventListener( 'mouseup', raycastMouseUp, false);


//if 1bus is showed, and others is hidden
var isShowOne = false;
var isShowMapMesh = true;

function raycastMouseDbClick (event) {
	event.preventDefault();
	var vector = new THREE.Vector3( ( event.clientX / WINDOW_WIDTH ) * 2 - 1, - ( event.clientY / WINDOW_HEIGHT ) * 2 + 1, 0.5 );
	projector.unprojectVector( vector, camera );
	var raycaster = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );
	var intersects = raycaster.intersectObjects( chart_objects );
	if ( intersects.length > 0 ) {

		var childObject = intersects[0].object;
		var parentObject = childObject.parent;

		while((parentObject != undefined) && !(parentObject instanceof THREE.Scene)) {
			childObject = parentObject;
			parentObject = parentObject.parent;
		}

		//process childObjectw
		//childObject.material.color.setHex( Math.random() * 0xffffff );
		console.log(childObject);
		
		//if is BUS
		if(childObject.name.indexOf("bus") != -1) {

			if(isShowOne) {
				isShowOne = false;

				//show all
				showAllBusTrip(scene);
			} else {
				isShowOne = true;

				//hide others
				hideAllBusTrip(scene);
				showBusTrip(scene, childObject.id);
			}

			return;
		}
	}

	// show/hide mapMesh
	if(isShowMapMesh == true) {
		scene.remove(mapMesh);
		isShowMapMesh = false;
	} else {
		scene.add(mapMesh);
		isShowMapMesh = true;
	}
}



//Process OY-Ruler

var isRulerFocus = false;
var lastPosition = {x: -1, y: -1};

function raycastMouseDown (event) {
	event.preventDefault();

	var vector = new THREE.Vector3( ( event.clientX / WINDOW_WIDTH ) * 2 - 1, - ( event.clientY / WINDOW_HEIGHT ) * 2 + 1, 0.5 );
	projector.unprojectVector( vector, camera );
	var raycaster = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );
	var intersects = raycaster.intersectObjects( chart_objects );
	
	if ( intersects.length > 0 ) {

		var childObject = intersects[0].object;

		if(childObject.name == "axis_Oy" || childObject.name == "ruler_point" || childObject.name == "ruler_text") {
			
			//childObject.material.color.setHex( Math.random() * 0xffffff );
			isRulerFocus = true;
			controls.enabled = false;
			lastPosition = {x: event.clientX, y: event.clientY};
		}
	}
}

function raycastMouseMove (event) {
	if(isRulerFocus == true) {
		var dy = (lastPosition.y - event.clientY) / 5;
		rulers.position.set(rulers.position.x, rulers.position.y + dy, rulers.position.z);
		lastPosition = {x: event.clientX, y: event.clientY};
	}
}

function raycastMouseUp (event) {
	isRulerFocus = false;
	controls.enabled = true;
}