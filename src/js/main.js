import "@babel/polyfill";
require('intersection-observer');
import "../scss/main.scss";

import '../img/favicon.ico';
import '../img/icon.png';

import './3dtext.js';


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
                if (prev.className !== current.className) {
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
            if (entry.intersectionRatio > 0.3) {
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


});