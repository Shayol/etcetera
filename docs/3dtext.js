// var THREE = require('three');
import { ShadowMaterial, Scene, WebGLRenderer, Color, DirectionalLight, OrthographicCamera, MeshLambertMaterial, Mesh, PlaneGeometry, Cache, PCFSoftShadowMap } from 'three';
// import Detector from "./lib/Detector.js";
import { OBJLoader } from 'three-obj-mtl-loader';
var OrbitControls = require('three-orbitcontrols');
import "../assets/etcetera.obj";

// if (!Detector.webgl) {
//     Detector.addGetWebGLMessage();
// }


Cache.enabled = true;
var container = document.querySelector(".home");

const scene = new Scene();
scene.background = new Color();

const renderer = new WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = PCFSoftShadowMap;
renderer.setClearColor(new Color(), 1);
renderer.setSize(container.clientWidth, container.clientHeight);


// camera
var viewSize;

if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
    viewSize = 3000;
}

else if (document.documentElement.clientWidth < 768) {

    viewSize = 2750;

}

else if (document.documentElement.clientWidth == 768 && window.matchMedia('(orientation: portrait)').matches) {
    viewSize = 2850;
}

else if (document.documentElement.clientWidth < 1100) {
    viewSize = 2000;
}

else {
    viewSize = 1250;
}




var originalAspect;
var windowHalfX = container.clientWidth / 2;
var windowHalfY = container.clientHeight / 2;
var mainObj;
var animationID;
var timerId;
export var idleAnimation;
var aspectRatio = container.clientWidth / container.clientHeight;
originalAspect = container.clientWidth / container.clientHeight;
const camera = new OrthographicCamera(-aspectRatio * viewSize / 2, aspectRatio * viewSize / 2, viewSize / 2, -viewSize / 2, 1, 1000);

camera.position.set(0, 0, 400);
camera.zoom = 5;
camera.updateProjectionMatrix();

camera.lookAt(scene.position);


// load object and add material

const material = new MeshLambertMaterial({ color: 0x5A5A5A, flatShading: true });
const objLoader = new OBJLoader();
objLoader.setPath('/assets/');

// light to make shadow

var light = new DirectionalLight(0xffffff, 0.8);
light.position.set(-30, 194, -45);
light.castShadow = true;
scene.add(light);
scene.add(light.target);
light.target.position.set(60, 20, 0);

light.shadow.mapSize.width = 1024;
light.shadow.mapSize.height = 1024;
light.shadow.camera.near = 0.5;
light.shadow.camera.far = 370;
light.shadow.camera.left = -250;
light.shadow.camera.right = 250;
light.shadow.camera.bottom = -250;
light.shadow.camera.top = 250;
light.radius = 0.0039;
light.bias = 0.0001;

//light illuminate from above

var dlight = new DirectionalLight(0xffffff, 0.7);
dlight.position.set(20, 194, 0);
scene.add(dlight);


// var helper = new CameraHelper(light.shadow.camera);
// scene.add(helper);


const planeGeometry = new PlaneGeometry(500, 500);
planeGeometry.rotateX(- Math.PI / 2);

const planeMaterial = new ShadowMaterial();
planeMaterial.opacity = 0.4;

const plane = new Mesh(planeGeometry, planeMaterial);
plane.position.y = -35;
plane.receiveShadow = true;
scene.add(plane);

const controls = new OrbitControls(camera, renderer.domElement);
controls.minZoom = 2;
controls.maxZoom = 15;

controls.addEventListener("change", () => {
    restartTimer();
    renderer.render(scene, camera);
});

objLoader.load('etcetera.obj', function (object) {
    object.traverse(function (child) {
        if (child instanceof Mesh) {
            child.material = material;
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });
    object.position.set(0, -10, 0);
    object.castShadow = true;
    object.receiveShadow = true;
    // object.rotation.y -= (Math.PI / 6);
    scene.add(object);
    container.appendChild(renderer.domElement);
    renderer.render(scene, camera);

    idleAnimation = function () {
        animationID = requestAnimationFrame(function animation(time) {

            object.rotation.y += Math.PI / 1440;
            renderer.render(scene, camera);

            animationID = requestAnimationFrame(animation);


        });
    }


    setTimeout(idleAnimation, 2000, object);

});

window.addEventListener('resize', onWindowResize, false);

function onWindowResize(e) {

    let aspect = container.clientWidth / container.clientHeight;

    let change = originalAspect / aspect;
    let newSize = viewSize * change;
    camera.left = -aspect * newSize / 2;
    camera.right = aspect * newSize / 2;
    camera.top = newSize / 2;
    camera.bottom = -newSize / 2;


    camera.updateProjectionMatrix();
    controls.update();
    renderer.setSize(container.clientWidth, container.clientHeight);

    renderer.render(scene, camera);

}


function restartTimer() {
    cancelAnimationFrame(animationID);
    clearTimeout(timerId);
    timerId = setTimeout(() => {
        idleAnimation();
    }, 3000);
}

export function stopAnimation() {
    cancelAnimationFrame(animationID);
    clearTimeout(timerId);
}


