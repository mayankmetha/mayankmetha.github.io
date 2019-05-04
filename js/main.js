var scene, camera, renderer, cube;

var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;

var SPEED = 0.001;

function init() {
    scene = new THREE.Scene();
    initLight();
    drawScene();
    initCamera();
    initRenderer();
    document.body.appendChild(renderer.domElement);
}

function initLight() {
    const light = new THREE.PointLight(0xFFFFFF);
    light.position.x = 0;
    light.position.y = 0;
    light.position.z = 0;
    scene.add(light);
}

function initCamera() {
    camera = new THREE.PerspectiveCamera(60, WIDTH / HEIGHT, 0.001, 15);
    camera.position.set(0, 0, 0);
    camera.lookAt(scene.position);
}

function initRenderer() {
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(WIDTH, HEIGHT);
    renderer.sortObjects = false;
    renderer.domElement.id = 'bgcanvas';
    renderer.domElement.name = 'bgcanvas';
}

function drawScene() {
    var material = new THREE.MeshPhongMaterial({ color: 0xFF6600, emissive: 0x111111, emissiveIntensity: 0.75, shininess: 30, specular: 0x111111 });
    var shape = new THREE.SphereGeometry(0.1, 40, 40);
    cube = new THREE.Group();
    for (var a = -33; a <= 33; a = a + 2) {
        for (var b = -33; b <= 33; b = b + 2) {
            for (var c = -33; c <= 33; c = c + 2) {
                var part = new THREE.Mesh(shape, material);
                part.position.set(a, b, c);
                cube.add(part);
            }
        }
    }
    scene.add(cube);
}
function rotateCube() {
    cube.rotation.x -= SPEED;
    cube.rotation.y -= SPEED;
    cube.rotation.z -= SPEED;
}

function render() {
    requestAnimationFrame(render);
    rotateCube();
    renderer.render(scene, camera);
}

init();
render();
window.addEventListener('resize', () => {
    WIDTH = window.innerWidth;
    HEIGHT = window.innerHeight;
    camera.aspect = WIDTH/HEIGHT;
    camera.updateProjectionMatrix();
    renderer.setSize(WIDTH, HEIGHT);
}, false);