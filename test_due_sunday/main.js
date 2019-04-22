

var width = window.innerWidth;
var height = window.innerHeight ;


var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(width, height);
document.body.appendChild(renderer.domElement);
 
// create scene object
var scene = new THREE.Scene; 
// scene.fog = new THREE.Fog( 0xffffff, 100, 0 );

scene.add( new THREE.AmbientLight( 0x222222 ) );

// create perspective camera
var camera = new THREE.PerspectiveCamera(60, width / height, 0.01, 10000);
camera.position.set( 0, 150, 1300 );
scene.add(camera); 
renderer.render(scene, camera);

var point_on_screen = new THREE.Mesh(new THREE.BoxGeometry(.1, .1, .1), new THREE.MeshBasicMaterial({color: 0x5555ff }));
point_on_screen.position.set(0,0,-20);
camera.add(point_on_screen);

var where_bullet_come_from_weapon = new THREE.Object3D();
where_bullet_come_from_weapon.position.set(2, -1, -5);
camera.add(where_bullet_come_from_weapon);

var bullets = [];
function onMouseDown() {
    let sphere_ball = new THREE.SphereGeometry(10, 8, 4);
    let basic_mesh = new THREE.MeshBasicMaterial({color: "blue"});
    let bullet = new THREE.Mesh(sphere_ball, basic_mesh);
    bullet.position.copy(where_bullet_come_from_weapon.getWorldPosition()); // start position - the tip of the weapon
    bullet.quaternion.copy(camera.quaternion); // apply camera's quaternion
    scene.add(bullet);
    bullets.push(bullet);
}
window.addEventListener("mousedown", onMouseDown);


var light = new THREE.DirectionalLight( 0xffffff, 2.25 );
light.position.set( 200, 450, 500 );
light.castShadow = true;
light.shadow.mapSize.width = 1024;
light.shadow.mapSize.height = 512;
light.shadow.camera.near = 100;
light.shadow.camera.far = 1200;
light.shadow.camera.left = - 1000;
light.shadow.camera.right = 1000;
light.shadow.camera.top = 350;
light.shadow.camera.bottom = - 350;
scene.add( light );

var gt = new THREE.TextureLoader().load( "grasslight-big.jpg" );
var gg = new THREE.PlaneBufferGeometry( 16000, 16000 );
var gm = new THREE.MeshPhongMaterial( { color: 0xffffff, map: gt } );
var ground = new THREE.Mesh( gg, gm );
ground.rotation.x = - Math.PI / 2;
ground.material.map.repeat.set( 64, 64 );
ground.material.map.wrapS = THREE.RepeatWrapping;
ground.material.map.wrapT = THREE.RepeatWrapping;
ground.receiveShadow = true;
scene.add( ground );

var targets = []
for (var i = 0; i < 100; i++){
    g_height = 200;
    var geometry = new THREE.BoxGeometry (10 , 100 , 100) ;
    var material = new THREE.MeshLambertMaterial ( { color : 0xffffff } ) ;
    var mesh = new THREE.Mesh( geometry , material ) ;
    var number_x =  Math.random() * 7000;
    number_x *= Math.floor(Math.random()*2) == 1 ? 1 : -1; 
    var number_z =  Math.random() * 7000;
    number_z *= Math.floor(Math.random()*2) == 1 ? 1 : -1;
    mesh.position.x = number_x;
    mesh.position.y =  g_height;
    mesh.position.z =  number_z
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    
    var geometry_2 = new THREE.BoxGeometry (10 , 10 , 155) ;
    var material_2 = new THREE.MeshLambertMaterial ( { color : 0xffffff } ) ;
    var mesh_2 = new THREE.Mesh( geometry_2 , material_2 ) ;
    mesh_2.position.x =  mesh.position.x
    mesh_2.position.y =  mesh.position.y - 120
    mesh_2.position.z =  mesh.position.z
    mesh_2.castShadow = true;
	mesh_2.receiveShadow = true;
    mesh_2.rotation.x = - Math.PI / 2;

    mesh.needsUpdate = true ;
    targets.push(mesh)
    scene.add( mesh ) ;
    scene.add( mesh_2 ) ;
}

var camPos = {x: 0, y: 0, z:-1};

var camMove = new THREE.Vector3(0, 0, 0), camStrafe = new THREE.Vector3(0,0, 0);

var cameraLookAt = new THREE.Vector3(0 , 0 , -3);
var cameraRight = new THREE.Vector3( 3 , 0 , 0);
var cameraUp = new THREE.Vector3().crossVectors( cameraRight , cameraLookAt );
 
renderer.shadowMap.enabled = true;
renderer.render(scene, camera);

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
        // camMove.y = cameraLookAt.y / 1.0;
        camMove.z = cameraLookAt.z / 1.0;

    } else if (keyCode == 83) { //s
        camMove.x =  - cameraLookAt.x / 1.0;
        // camMove.y = - cameraLookAt.y / 1.0;w
        camMove.z = - cameraLookAt.z / 1.0;

    } else if (keyCode == 65) {
        camStrafe.x = - cameraRight.x / 1.0;
        // camStrafe.y = - cameraRight.y / 1.0;
        camStrafe.z = - cameraRight.z / 1.0;

    } else if (keyCode == 68) {
        camStrafe.x =  cameraRight.x / 1.0;
        // camStrafe.y =  cameraRight.y / 1.0;
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
var score = 0.0;
document.getElementById('message').innerHTML = "Score: " + score;
function appendText(txt)
{   
    
    document.getElementById('message').innerHTML = "Score: " + (score += parseInt(txt));
}

function remove(index){
    var obj = scene.getObjectByProperty('uuid', bullets[index-1].uuid);
    obj.material.dispose();
    scene.remove(obj);
    bullets.splice(index-1, 1)
}

function countdown() {
    var seconds = 60;
    function tick() {
        var counter = document.getElementById("counter");
        seconds--;
        counter.innerHTML = "0:" + (seconds < 10 ? "0" : "") + String(seconds);
        if( seconds > 0 ) {
            setTimeout(tick, 1000);
        } else {
            alert("Game over");
            location.reload();
        }
    }
    tick();
}

countdown();


var speed = 1000;
var clock = new THREE.Clock();
var delta = 0;
function render() {
    if(camera.position.x <= 450 || camera.position.x >= -450 && camera.position.z <= 450 || camera.position.z >= -450){
        camera.position.add(camMove);
        camera.position.add(camStrafe);
    }

    var newLookAt = new THREE.Vector3().addVectors(camera.position, cameraLookAt);
    camera.lookAt(newLookAt);
    camera.up = cameraUp;
    delta = clock.getDelta();
    var index = -1;
    var position = 0;
    bullets.forEach(b =>{ 
        position++;
        index = -1;
        // console.log(b.geometry.vertices[1]);
        b.translateZ(-speed * delta); // move along the local z-axis

        var origin_point = b.position.clone();

        for (var vertexIndex = 0; vertexIndex < b.geometry.vertices.length; vertexIndex++)
        {		
            index = -1;
            var localVertex = b.geometry.vertices[vertexIndex].clone();
            var globalVertex = localVertex.applyMatrix4( b.matrix );
            var directionVector = globalVertex.sub( b.position );
            
            var ray = new THREE.Raycaster( origin_point, directionVector.clone().normalize() );
            var collisionResults = ray.intersectObjects( targets );
            if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() ) {
                console.log(camera.position)
                console.log(collisionResults[0].object.position)
                var difference_x = Math.abs(camera.position.x - collisionResults[0].object.position.x )
                var difference_z = Math.abs(camera.position.z - collisionResults[0].object.position.z )

                console.log(difference_x)
                console.log(difference_z)
                if(difference_x > difference_z){
                    if(collisionResults[0].object.material.color.r != 1 || collisionResults[0].object.material.color.b != 0){
                        appendText(difference_x / 20)
                    }
                
                }
                else{
                    if(collisionResults[0].object.material.color.r != 1 || collisionResults[0].object.material.color.b != 0){
                        appendText(difference_z / 20)
                    }
                }
                collisionResults[0].object.material.color.set( 0xff0000 );
                index = position;
                remove(index)
                break;
            }
                
        }



      });

    renderer.render(scene, camera);
    requestAnimationFrame(render);


}
render();

