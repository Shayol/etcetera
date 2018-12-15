import "@babel/polyfill";
require('intersection-observer');
import "../scss/main.scss";

var THREE = require('three');
import Detector from "./lib/Detector.js";
import { OBJLoader } from 'three-obj-mtl-loader';
var OrbitControls = require('three-orbitcontrols');
import "../assets/etcetera.obj";
import '../img/favicon.ico';
import '../img/icon.png';

// let vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0) * 0.01;
// document.documentElement.style.setProperty('--vh', `${vh}px`);

window.addEventListener("orientationchange", function () {
    let vh = document.documentElement.clientHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
});

window.addEventListener('load', function () {
    var navs = document.querySelectorAll(".js-nav");
    var workItem = document.querySelectorAll(".work__item");
    var scrollNav = document.querySelectorAll(".work__nav-link");
    var merch = document.querySelectorAll(".merch-photo");
    var slider = document.querySelector(".work__slider");
    var media = document.querySelectorAll(".work__media");

    //navigation



    navs.forEach(function (el) {
        el.addEventListener('change', function () {

            var prev = document.querySelector(".active");
            var current = document.querySelector("." + el.dataset.id);

            if (prev && current) {
                if (prev != current) {
                    prev.classList.toggle("active");
                    current.classList.toggle("active");
                    //reset slider
                    if (el.dataset.id == "work") {
                        TweenLite.to(slider, 0, { scrollTo: "#work1" });
                    }
                }

            }
        });
    });

    scrollNav.forEach(el => {
        el.addEventListener('click', e => {
            if (TweenLite) {
                e.preventDefault();
                TweenLite.to(slider, 1, { scrollTo: "#" + el.href.split("#")[1] });
            }
        });
    });


    //observe items showing in viewport in wrk section

    const intersectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.intersectionRatio > 0) {
                scrollNav.forEach(nav => {
                    nav.classList.remove("scrolled");
                    if (entry.target.id == nav.href.split("#")[1]) {
                        nav.classList.add("scrolled");
                    }
                })

            }

        });
    }, { threshold: 0.6 });

    workItem.forEach((element) => intersectionObserver.observe(element));


    //gallery show hide 
    media.forEach((mediaEl) => {

        let imgs = mediaEl.querySelectorAll(".work__img");
        imgs.forEach((el, index) => {
            el.addEventListener('click', e => {
                el.style.opacity = '0';
                el.style.zIndex = '-1';
                imgs[index + 1 >= imgs.length ? 0 : index + 1].style.opacity = '1';
                imgs[index + 1 >= imgs.length ? 0 : index + 1].style.zIndex = '1';
            });
        })


    });

    // text 3d

    if (!Detector.webgl) {
        Detector.addGetWebGLMessage();
    }


    THREE.Cache.enabled = true;
    var container = document.querySelector(".home");

    const scene = new THREE.Scene();
    scene.background = new THREE.Color();

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setClearColor(new THREE.Color(), 1);
    renderer.setSize(container.clientWidth, container.clientHeight);


    // camera
    var viewSize;

    if (container.clientWidth < 600) {
        viewSize = 2750;
    }

    else if (container.clientWidth < 1100) {
        viewSize = 2000;
    }

    else {
        viewSize = 1250;
    }


    var originalAspect;
    var windowHalfX = container.clientWidth / 2;
    var windowHalfY = container.clientHeight / 2;
    // var obj;
    var aspectRatio = container.clientWidth / container.clientHeight;
    originalAspect = container.clientWidth / container.clientHeight;
    const camera = new THREE.OrthographicCamera(-aspectRatio * viewSize / 2, aspectRatio * viewSize / 2, viewSize / 2, -viewSize / 2, 1, 1000);

    camera.position.set(0, 0, 400);
    camera.zoom = 5;
    camera.updateProjectionMatrix();

    camera.lookAt(scene.position);


    // load object and add material

    const material = new THREE.MeshLambertMaterial({ color: 0x5A5A5A, flatShading: true });
    const objLoader = new THREE.OBJLoader();
    objLoader.setPath('/assets/');

    // light to make shadow

    var light = new THREE.DirectionalLight(0xffffff, 0.8);
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

    var dlight = new THREE.DirectionalLight(0xffffff, 0.7);
    dlight.position.set(20, 194, 0);
    scene.add(dlight);


    // var helper = new THREE.CameraHelper(light.shadow.camera);
    // scene.add(helper);


    const planeGeometry = new THREE.PlaneGeometry(500, 500);
    planeGeometry.rotateX(- Math.PI / 2);

    const planeMaterial = new THREE.ShadowMaterial();
    planeMaterial.opacity = 0.4;

    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.position.y = -35;
    plane.receiveShadow = true;
    scene.add(plane);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.minZoom = 2;
    controls.maxZoom = 15;

    controls.addEventListener("change", () => {
        renderer.render(scene, camera);
    });

    objLoader.load('etcetera.obj', function (object) {
        object.traverse(function (child) {
            if (child instanceof THREE.Mesh) {
                child.material = material;
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
        object.position.set(0, -10, 0);
        object.castShadow = true;
        object.receiveShadow = true;
        object.rotation.y -= (Math.PI / 6);
        scene.add(object);
        container.appendChild(renderer.domElement);
        renderer.render(scene, camera);

        initAnimation(object);
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

    function initAnimation(object) {
        requestAnimationFrame(function animation(time) {

            if (object.rotation.y >= 0) {
                return;
            }

            object.rotation.y += Math.PI / 180;
            renderer.render(scene, camera);

            requestAnimationFrame(animation);


        });
    }

    //load iframes


    function deferIframes() {
        let vidDefer = document.getElementsByTagName('iframe');
        for (let i = 0; i < vidDefer.length; i++) {
            if (vidDefer[i].getAttribute('data-src')) {
                vidDefer[i].setAttribute('src', vidDefer[i].getAttribute('data-src'));
            }
        }
    }

    deferIframes();


});