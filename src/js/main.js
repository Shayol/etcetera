import "@babel/polyfill";
import "../scss/main.scss";

window.addEventListener('load', function () {
    var navs = document.querySelectorAll(".js-nav");
    var contentItems = document.querySelectorAll(".js-content-item");

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

});