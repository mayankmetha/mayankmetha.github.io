var camera, scene, renderer;
var cylinder;
var texture;
var normal_speed = 0.001;
var hyperspeed = 10;
var hyperspeed_mode = false;
var hyperspeed_upratio = 1.03;
var hyperspeed_downratio = 1.3;
var current_speed = normal_speed;
var hyperspeed_upscale = 1.03;
var hyperspeed_downscale = 1.3;
var current_scale = 1;

init();
animate();

function init() {
    // renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // scene
    scene = new THREE.Scene();

    // camera
    camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 10000);
    camera.position.set(0, 0, 7);
    camera.lookAt(scene.position);
    scene.add(camera);

    //lighting
    var light = new THREE.DirectionalLight(0x0099ff, 0.5);
    light.position.set(1, 1, 0).normalize();
    scene.add(light);
    var light = new THREE.DirectionalLight(0xff4466, 0.5);
    light.position.set(-1, -1, 0).normalize();
    scene.add(light);
    var light = new THREE.PointLight(0xffffff, 10, 25);
    light.position.set(-3, -3, 0);
    scene.add(light);
    var light = new THREE.PointLight(0xffffff, 10, 25);
    light.position.set(3, 3, 0);
    scene.add(light);

    // fog
    scene.fog = new THREE.FogExp2(0x000000, 0.15);

    // texture
    THREE.TextureLoader.prototype.crossOrigin = '';
    texture = new THREE.TextureLoader().load("https://threejs.org/examples/textures/water.jpg");
    texture.wrapT = THREE.RepeatWrapping;
    texture.wrapS = THREE.RepeatWrapping;

    // tunnel
    var material = new THREE.MeshLambertMaterial({
        color: 0xffffff,
        opacity: 1,
        map: texture
    });
    var cylinder_geometry = new THREE.CylinderGeometry(1, 1, 30, 360, 1, true);
    cylinder = new THREE.Mesh(cylinder_geometry, material);
    material.side = THREE.BackSide;
    cylinder.rotation.x = Math.PI / 2;
    scene.add(cylinder);

    // event listeners
    document.addEventListener('mousedown', onClick, false);
    document.addEventListener('touchstart', onClick, false);
    document.addEventListener('mouseup', onRelease, false);
    document.addEventListener('touchend', onRelease, false);
    window.addEventListener('resize', onWindowResize, false);
}

function onClick(event) {
    hyperspeed_mode = true;
}

function onRelease(event) {
    hyperspeed_mode = false;
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    render();
}

function render() {
    if (hyperspeed_mode) {
        current_speed = current_speed >= hyperspeed ? hyperspeed : current_speed * hyperspeed_upratio;
        current_scale = current_scale <= 0.2 ? 0.2 : current_scale / hyperspeed_upscale;
    } else {
        current_speed = current_speed <= 1 ? 1 : current_speed / hyperspeed_downratio;
        current_scale = current_scale >= 1 ? 1 : current_scale * hyperspeed_downscale;
    }
    cylinder.scale.set(current_scale, 1, current_scale);
    texture.offset.y -= normal_speed * current_speed;
    texture.offset.y %= 1;
    texture.needsUpdate = true;

    var seconds = Date.now() / 1000;
    var angle = 0.2 * seconds;
    camera.rotation.z = angle;

    renderer.render(scene, camera);
}