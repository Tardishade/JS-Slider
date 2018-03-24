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

    // Configuration
    var curSlide = 0;
    var diff = 0;
    var numSlides = $slide.length - 1;
    var windowWidth = $window.width();
    var sliderLeft = (windowWidth / 2) - ((numSlides * 50) / 2); 
    var animateDelay = 2000;
    var waitDelay = 3000;
    var mouseDown = false;
    var startX = 0;
    var prevMove = true;

    var interval;
    var animating;


    // Setup Functions
    
    // Increase width main container to slide no * window size and
    // setup duplicate end slide
    function increaseContainerSize() {
        var newWidth = 100 * (numSlides + 2);
        $container.css("width", newWidth.toString() + "%");
        jQuery(".slides #" + numSlides).clone().attr("id", "-1").prependTo($container);
    }

    function createBars(){
        for (var i = 0; i <= numSlides; i++) {
            $bars.append("<div id='"+i+"'></div>");
        }
        $bar = jQuery("#slider-container .slider-bars div");
        jQuery("#slider-container .slider-bars #0").css("background-color", "white");
    }

    function leftPad(pad) {
        $bars.css("left", pad);
    }

    increaseContainerSize();
    createBars();
    startSlider();
    leftPad(sliderLeft);


    // Set automatic execution of slider
    function startSlider() {
        interval = setInterval(() => {
            animating = true;
            myAnimate("-=");
        }, waitDelay);
    }

    function stopSlider() {
        animating = false;
        clearInterval(interval);
    }


    // Event Listeners
    $window.resize(() => {
        windowWidth = $window.width();
        sliderLeft = (windowWidth / 2) - ((numSlides * 50) / 2);
        leftPad(sliderLeft);
    });

    $slide_left.click((e) => {
        e.preventDefault();
        console.log("clicked");
        stopSlider();
        myAnimate("+=")
    });

    $slide_right.click((e) => {
        e.preventDefault();
        console.log("clicked");
        stopSlider();
        myAnimate("-=")
    });

    // Listen for a click
    $slider.on("mousedown touchstart", (clickEvent) => {
        console.log("mouse down");
        if (animating) return;
        mouseDown = true;
        stopSlider();
        startX = clickEvent.pageX || clickEvent.originalEvent.touches[0].pageX;
        diff = 0;

         // Check if mouse was moved after click
        $slider.on("mousemove touchmove", (moveEvent) => {
            stopSlider();
            console.log("mouse moving");
            if (mouseDown) {
                var x = moveEvent.pageX || moveEvent.originalEvent.touches[0].pageX;
                diff = (startX - x);// / windowWidth * 70;
                $container.css("margin-left", (-1 * (curSlide * windowWidth)) - diff);
            }
        });
    });

    
    $slider.on("mouseup touchend", (clickEvent) => {
        console.log("mouse up");
        mouseDown = false;
        $slider.off("mousemove touchmove");
        if(animating) return;
        if(diff > 0) {
            $slide_right.click();
        } else {
            $slide_left.click();
        }
        startSlider();
    });


    // Control Functions

    // Add a left margin to the slider to move the images. Move by window width each time.
    // animateDelay controls the time for the animation to happen
    function myAnimate(dir) {
        $container.animate({'margin-left': dir + windowWidth}, animateDelay, () => {
            animating = false;
            if (dir === "-=") {
                curSlide++;
                if (curSlide === numSlides + 1) {
                    curSlide = 0;
                    $container.css('margin-left', 0);
                }
            } else {
                curSlide--;
                if (curSlide === 0) {
                    curSlide = numSlides + 1;
                    $container.css('margin-left', numSlides * windowWidth);
                }
            }
            colorBar();
            startSlider();
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
});