

var width = window.innerWidth;
var height = window.innerHeight;


var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(width, height);
document.body.appendChild(renderer.domElement);
 
// create scene object
var scene = new THREE.Scene; 

// create perspective camera
var camera = new THREE.PerspectiveCamera(100, width / height, 0.1, 10000);
camera.position.y = 300;
camera.position.z = 500;
camera.position.x = 100;
// add to scene and renderer
scene.add(camera); 
renderer.render(scene, camera);

hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
hemiLight.color.setHSL( 0.6, 1, 0.6 );
hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
hemiLight.position.set( 0, 50, 0 );
scene.add( hemiLight );

dirLight = new THREE.DirectionalLight( 0xffffff, 1);
dirLight.color.setHSL( 0.1, 1, 0.95 );
dirLight.position.set( -15, 10.75, 1 );
dirLight.position.multiplyScalar( 30 );
scene.add( dirLight );

dirLight.castShadow = true;

dirLight.shadow.mapSize.width = 2048;
dirLight.shadow.mapSize.height = 2048;

var d = 500;

dirLight.shadow.camera.left = - d;
dirLight.shadow.camera.right = d;
dirLight.shadow.camera.top = d;
dirLight.shadow.camera.bottom = - d;

dirLight.shadow.camera.far = 3500;
dirLight.shadow.bias = - 0.0001;

// dirLightHeper = new THREE.DirectionalLightHelper( dirLight, 10 );
// scene.add( dirLightHeper );

var array_of_mesh = [];
var g_width = 10, g_height = Math.random() * 30 , g_length = 10;

for ( var i = 0; i < 500; i ++ ) {
    g_height = (Math.random() * 100 )+10;
    var geometry = new THREE . BoxGeometry (g_width , g_height , g_length) ;
    var material = new THREE.MeshLambertMaterial ( { color : 0xffffff } ) ;
    var mesh = new THREE.Mesh( geometry , material ) ;
    mesh.position.x =  Math.random() * 800 - 400;
    mesh.position.y =  g_height/2;
    mesh.position.z =  Math.random() * 800 - 400;
    mesh.castShadow = true;
	mesh.receiveShadow = true;
    mesh.needsUpdate = true ;
    array_of_mesh.push(mesh)
    scene.add( mesh ) ;

}

var groundGeo = new THREE.PlaneBufferGeometry( 10000, 10000 );
var groundMat = new THREE.MeshLambertMaterial( { color: 0xffffff } );
groundMat.color.setHSL( 0.095, 1, 0.75 );

var ground = new THREE.Mesh( groundGeo, groundMat );
ground.position.y = -.01;
ground.rotation.x = - Math.PI / 2;
ground.receiveShadow = true;
scene.add( ground );

var camPos = {x: 0, y: 0, z:-1};

var camMove = new THREE.Vector3(0, 0, 0), camStrafe = new THREE.Vector3(0,0, 0);

var cameraLookAt = new THREE.Vector3(0 , 0 , -1);
var cameraRight = new THREE.Vector3( 1 , 0 , 0);
var cameraUp = new THREE.Vector3().crossVectors( cameraRight , cameraLookAt );
 
renderer.shadowMap.enabled = true;

renderer.render(scene, camera);

var direction = 0;

var previous_mouse = new THREE.Vector2();
previous_mouse.x = 0;
previous_mouse.y = 0;
var firstMouseMove = true;

function onMouseMove( event ) {
    if (firstMouseMove){
        previous_mouse.x = event.clientX;
        previous_mouse.y = event.clientY;

        firstMouseMove = false;
        return;
    }

    var yaw = (previous_mouse.x - event.clientX) / 200.0;
    var pitch  = (previous_mouse.y - event.clientY) / 200.0;

    cameraLookAt.applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw);
    cameraRight.applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw);
    cameraLookAt.applyAxisAngle(cameraRight, pitch);

    previous_mouse.x = event.clientX;
    previous_mouse.y = event.clientY;

}


function doKeyDown(event) {
    var keyCode = event.which;
    if (keyCode == 87) { //w
        camMove.x = cameraLookAt.x / 1.0;
        camMove.y = cameraLookAt.y / 1.0;
        camMove.z = cameraLookAt.z / 1.0;

    } else if (keyCode == 83) { //s
        camMove.x =  - cameraLookAt.x / 1.0;
        camMove.y = - cameraLookAt.y / 1.0;
        camMove.z = - cameraLookAt.z / 1.0;

    } else if (keyCode == 65) {
        camStrafe.x = - cameraRight.x / 1.0;
        camStrafe.y = - cameraRight.y / 1.0;
        camStrafe.z = - cameraRight.z / 1.0;

    } else if (keyCode == 68) {
        camStrafe.x =  cameraRight.x / 1.0;
        camStrafe.y =  cameraRight.y / 1.0;
        camStrafe.z =  cameraRight.z / 1.0;

    }
};

function doKeyUp(event) {
    var keyCode = event.which;
    if (keyCode == 87) { //
        camMove.x = 0;
        camMove.y = 0;
        camMove.z = 0;
    } else if (keyCode == 83) { //
        camMove.x = 0;
        camMove.y = 0;
        camMove.z = 0;

    } else if (keyCode == 65) { //a
        camStrafe.x =0;
        camStrafe.y =0;
        camStrafe.z =0;

    } else if (keyCode == 68) { //d
        camStrafe.x =0;
        camStrafe.y =0;
        camStrafe.z =0;

    } 
};


document.addEventListener("keydown", doKeyDown, false);
document.addEventListener("keyup", doKeyUp, false);
window.addEventListener( 'mousemove', onMouseMove, false );



function render() {

    if(dirLight.position.x == 500){
        dirLight.position.x = -500;
    }   
    dirLight.position.x += 1;

    camera.position.add(camMove);
    camera.position.add(camStrafe);

    var newLookAt = new THREE.Vector3().addVectors(camera.position, cameraLookAt);
    camera.lookAt(newLookAt);
    camera.up = cameraUp;
    renderer.render(scene, camera);
    requestAnimationFrame(render);


}
render();

