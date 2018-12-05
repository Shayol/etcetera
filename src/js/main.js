import "@babel/polyfill";
require('intersection-observer');
import "../scss/main.scss";

var THREE = require('three');
import Detector from "./lib/Detector.js";
var OrbitControls = require('three-orbitcontrols');
import "../assets/Arial-Black.json";

window.addEventListener('load', function () {
    var navs = document.querySelectorAll(".js-nav");
    var workItem = document.querySelectorAll(".work__item");
    var scrollNav = document.querySelectorAll(".work__nav-link");
    var merch = document.querySelectorAll(".merch-photo");

    //navigation

    navs.forEach(function (el) {
        el.addEventListener('change', function () {

            var prev = document.querySelector(".active");
            var current = document.querySelector("." + el.dataset.id);

            if (prev && current) {
                if (prev != current) {
                    prev.classList.toggle("active");
                    current.classList.toggle("active");
                }
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


    //origami merch show hide 
    merch.forEach((el, index) => {

        el.addEventListener('click', e => {
            el.style.opacity = '0';
            el.style.zIndex = '-1';
            merch[index ? 0 : 1].style.opacity = '1';
            merch[index ? 0 : 1].style.zIndex = '1';
        });
    });

    // text 3d

    if (!Detector.webgl) {
        Detector.addGetWebGLMessage();
    }

    const loader = new THREE.FontLoader();
    var container = document.querySelector(".home");
    var windowHalfX = container.clientWidth / 2;
    var windowHalfY = container.clientHeight / 2;


    const scene = new THREE.Scene();

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setClearColor(new THREE.Color("hsla(360, 100%, 100%, 1)"));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 500);
    camera.lookAt(scene.position);

    loader.load("/assets/Arial-Black.json", function (font) {

        const textGeometry = new THREE.TextGeometry('etcetera', {
            font: font,
            size: 60,
            height: 5,
            curveSegments: 24,
            bevelEnabled: true,
            bevelThickness: 10,
            bevelSize: 1,
            bevelSegments: 10
        });

        const textMaterial = new THREE.MeshLambertMaterial({ color: 0x5D5E5E, flatShading: true });

        const textMesh = new THREE.Mesh(textGeometry, textMaterial);
        textMesh.position.set(-200, -15, 0);
        textMesh.receiveShadow = true;
        textMesh.castShadow = true;
        scene.add(textMesh);

        // light to make shadow

        var light = new THREE.DirectionalLight(0xffffff, 0.8);
        light.position.set(-30, 194, -35);
        light.castShadow = true;
        scene.add(light);
        scene.add(light.target);
        light.target.position.set(60, 20, 0);

        //light illuminate from above

        var dlight = new THREE.DirectionalLight(0xffffff, 0.3);
        dlight.position.set(10, 194, -42);
        scene.add(dlight);

        light.shadow.mapSize.width = 2048;
        light.shadow.mapSize.height = 2048;
        light.shadow.camera.near = 0.5;
        light.shadow.camera.far = 370;
        light.shadow.camera.left = -250;
        light.shadow.camera.right = 250;
        light.shadow.camera.bottom = -250;
        light.shadow.camera.top = 250;
        light.radius = 0.0039;
        light.bias = 0.0001;


        var helper = new THREE.CameraHelper(light.shadow.camera);
        scene.add(helper);


        const planeGeometry = new THREE.PlaneGeometry(500, 500);
        planeGeometry.rotateX(- Math.PI / 2);

        const planeMaterial = new THREE.ShadowMaterial();
        planeMaterial.opacity = 0;

        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.position.y = -55;
        plane.receiveShadow = true;
        scene.add(plane);

        const controls = new OrbitControls(camera, renderer.domElement);

        controls.addEventListener("change", () => {
            if (camera.position.x == 0 && camera.position.y == 0) {
                planeMaterial.opacity = 0;
            }
            else {
                planeMaterial.opacity = 0.3;
            }
            renderer.render(scene, camera);
        });

        renderer.render(scene, camera);

    })

    window.addEventListener('resize', onWindowResize, false);

    function onWindowResize() {

        windowHalfX = container.clientWidth / 2;
        windowHalfY = container.clientHeight / 2;
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);

    }

    // function onKeyboardEvent(e) {

    //     /*if (e.code === 'KeyL') {

    //         lighting = !lighting;

    //         if (lighting) {

    //             ambient.intensity = 0.0;
    //             scene.add(keyLight);
    //             scene.add(fillLight);
    //             scene.add(backLight);

    //         } else {

    //             ambient.intensity = 1.0;
    //             scene.remove(keyLight);
    //             scene.remove(fillLight);
    //             scene.remove(backLight);

    //         }

    //     } */

    // }

    // function animate() {

    //     requestAnimationFrame(animate);

    //     controls.update();

    //     render();

    // }

    // function render() {

    //     renderer.render(scene, camera);

    // }



});