'use strict'

jQuery(() => {

    // Cache DOM
    var $slide_left = jQuery("#slide-left"); 
    var $slide_right = jQuery("#slide-right");
    var $slider = jQuery("#slider");
    var $slide = jQuery(".slide");
    var $bars = jQuery("#slider-container .slider-bars");
    var $container = jQuery("#slider .slides");
    var $window = jQuery(window);
    var $bar;

    // Setup values
    var curSlide = 1;
    var animateDelay = 1000;
    var slideDelay = 3000;
    var numSlides = $slide.length;
    var windowWidth = $window.width();
    var sliderLeft = (windowWidth / 2) - ((numSlides * 50) / 2); 


    // Setup Functions
    
    // Increase width main container to slide no * window size and
    // setup duplicate end slide
    function increaseContainerSize() {
        var newWidth = 100 * (numSlides);
        $container.css("width", newWidth.toString() + "%");
    }

    function createBars(){
        for (var i = 0; i < numSlides; i++) {
            $bars.append("<div id='"+i+"'></div>");
        }
        $bar = jQuery("#slider-container .slider-bars div");
        jQuery("#slider-container .slider-bars #0").css("background-color", "white");
    }

    function leftPad(pad) {
        $bars.css("left", pad);
    }

    // Duplicate the first slide and move it to the end.
    // Duplicate the last slide and move it to the front
    // Increase the number of slides listed
    jQuery(".slides #1").clone().attr("id", numSlides + 1).appendTo('.slides');
    jQuery(".slides #" + (numSlides)).clone().attr("id", 0).prependTo('.slides');
    $container.css({'left': windowWidth + "px"});
    $slide = jQuery(".slide");
    $container = jQuery("#slider .slides");
    numSlides = $slide.length;

    // Execute all the functions
    increaseContainerSize();
    createBars();
    leftPad();
    // var interval = setInterval(() => {

    // }, slideDelay);


    // Control functions
    function sliderAnimate(newPos) {
        $container.animate({"left": newPos}, animateDelay, () => {
            if (Math.abs(newPos) === 0) {
                $container.css("left", ((numSlides - 1) * windowWidth) + "px");
            } else if (Math.abs(newPos) === ((numSlides - 2) * windowWidth)) {
                $container.css("left", (-1 * windowWidth) + "px");
            }
            colorBar();
        });
    }

    // Visual indicator for current slide 
    function colorBar() {
        $bar.each((index, val) => {
            if(parseInt($bar[index].id) === curSlide) {
                jQuery(val).css("background-color", "white");
            } else {
                jQuery(val).css("background-color", "black");
            }
        });
    }

    // Event Listeners 

    $window.resize(() => {
        windowWidth = $window.width();
        sliderLeft = (windowWidth / 2) - ((numSlides * 50) / 2);
        leftPad(sliderLeft);
    });

    $slide_left.click(() => {
        console.info($slide);
        if (curSlide === 1) {
            curSlide = numSlides - 2;
        } else {
            curSlide--;
        }
        $container.stop(true, true);
        var newPos = $container.position().left - (1 * windowWidth);
        console.log("left:" + newPos);
        sliderAnimate(newPos);
        return false;
    });

    $slide_right.click(() => {
        if (curSlide === numSlides - 2) {
            curSlide = 1;
        } else {
            curSlide++;
        }
        $container.stop(true, true);
        var newPos = $container.position().left + (1 * windowWidth);
        console.log("right:" + newPos);
        sliderAnimate(newPos);
        return false;
    });


});