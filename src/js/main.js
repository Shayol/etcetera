import "@babel/polyfill";
require('intersection-observer');
import "../scss/main.scss";

var THREE = require('three');
import { MTLLoader, OBJLoader } from 'three-obj-mtl-loader';
import Detector from "./lib/Detector.js";
var OrbitControls = require('three-orbitcontrols');
import "../assets/etcetera.mtl";
import "../assets/etcetera.obj";

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

    //scroll for work items 
    // scrollNav.forEach(el => {
    //     el.addEventListener('click', (e) => {
    //         if(this.window.scrollTo)
    //     })
    // })

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

    var container;

    var camera, controls, scene, renderer;
    var lighting, ambient, keyLight, fillLight, backLight;

    var windowHalfX = window.innerWidth / 2;
    var windowHalfY = window.innerHeight / 2;

    init();
    animate();

    function init() {

        container = document.querySelector(".home");

        /* Camera */
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
        camera.position.set(0, 320, 360);
        camera.lookAt(scene.position);

        /* Scene */


        lighting = false;
        ambient = new THREE.AmbientLight(0xffffff, 1.0);
        scene.add(ambient);



        //lighting

        keyLight = new THREE.PointLight(0xffffff, 10);
        keyLight.position.set(100, 0, 0);
        ambient.intensity = 0.5;
        // scene.add(keyLight);



        /* Model */

        var mtlLoader = new MTLLoader();

        mtlLoader.setBaseUrl('/assets/');
        mtlLoader.setPath('/assets/');
        mtlLoader.load('etcetera.mtl', function (materials) {

            materials.preload();

            var objLoader = new OBJLoader();
            objLoader.setMaterials(materials);
            objLoader.setPath('/assets/');
            objLoader.load('etcetera.obj', function (object) {

                object.position.set(0, 0, 0)
                object.rotation.set(0., 0, 0)
                scene.add(object);

            });

        });

        /* Renderer */

        renderer = new THREE.WebGLRenderer();
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(new THREE.Color("hsla(360, 100%, 100%, 1)"));

        container.appendChild(renderer.domElement);

        /* Controls */

        controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.25;
        controls.enableZoom = true;

        /* Events */

        window.addEventListener('resize', onWindowResize, false);
        window.addEventListener('keydown', onKeyboardEvent, false);

    }

    function onWindowResize() {

        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);

    }

    function onKeyboardEvent(e) {

        /*if (e.code === 'KeyL') {
    
            lighting = !lighting;
    
            if (lighting) {
    
                ambient.intensity = 0.0;
                scene.add(keyLight);
                scene.add(fillLight);
                scene.add(backLight);
    
            } else {
    
                ambient.intensity = 1.0;
                scene.remove(keyLight);
                scene.remove(fillLight);
                scene.remove(backLight);
    
            }
    
        } */

    }

    function animate() {

        requestAnimationFrame(animate);

        controls.update();

        render();

    }

    function render() {

        renderer.render(scene, camera);

    }



});