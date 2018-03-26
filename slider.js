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
    var slideDelay = 7000;
    var numSlides = $slide.length;
    var windowWidth = $window.width();
    var sliderLeft = (windowWidth / 2) - ((numSlides * 50) / 2); 


    // Setup Functions

    function changeContainerSize() {
        $container.width(windowWidth * numSlides);
    }

    function createBars(){
        for (var i = 1; i < numSlides - 1; i++) {
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
    // Increase width of container
    // Increase the number of slides listed
    jQuery(".slides #1").clone().attr("id", numSlides + 1).appendTo('.slides');
    jQuery(".slides #" + (numSlides)).clone().attr("id", 0).prependTo('.slides');
    $container.css({'left': windowWidth + "px"});
    $slide = jQuery(".slide");
    $container = jQuery("#slider .slides");
    numSlides = $slide.length;
    

    // Execute all the functions
    changeContainerSize();
    createBars();

    sliderLeft = (windowWidth / 2) - (((numSlides - 2) * 50) / 2);
    leftPad(sliderLeft);

    $container.css("left", -1 * windowWidth);

    // Set an automatic transition interval
    function slideTimer(fn, time) {
        var myInterval = setInterval(fn, time);
    
        this.stop = function() {
            if (myInterval) {
                clearInterval(myInterval);
                myInterval = null;
            }
            return this;
        }
    
        // Start timer using current settings (if it's not already running)
        this.start = function() {
            if (!myInterval) {
                this.stop();
                myInterval = setInterval(fn, time);
            }
            return this;
        }
    
        // Start with new interval, stop current interval
        this.reset = function(newT) {
            time = newT;
            return this.stop().start();
        }
    }

    // Create a new timer object
    var interval = new slideTimer(() => {
        moveRight();
    }, slideDelay);


    // Control functions

    function moveLeft(pos = $container.position().left) {
        curSlide--;
        $container.stop(true, true);
        sliderClick(false, pos);
    }

    function moveRight(pos = $container.position().left) {
        curSlide++;
        $container.stop(true, true);
        sliderClick(true, pos);
    }

    function sliderClick(isRight, originalPos) {
        var newOp = (isRight) ? (-1 * windowWidth) : (1 * windowWidth);
        var newPos = originalPos + newOp;
        sliderAnimate(newPos);
        return false;
    }

    function sliderAnimate(newPos) {
        colorBar();
        $container.animate({"left": newPos}, animateDelay, () => {
            if (curSlide === 0) {
                $container.css("left", (-1 * (numSlides - 2) * windowWidth) + "px");
                curSlide = numSlides - 2;
            } else if (curSlide === numSlides - 1) {
                $container.css("left", (-1 * windowWidth) + "px");
                curSlide = 1;
            }
            // Reset animation interval after any animation completes
            interval.reset(slideDelay);
            console.log(curSlide);
        });
    }

    // Visual indicator for current slide 
    function colorBar() {
        $bar.each((index, val) => {
            var newCur = curSlide;
            if(curSlide === 0) {
                newCur = numSlides - 2;
            } else if(curSlide == numSlides - 1) {
                newCur = 1;
            }
            if(parseInt($bar[index].id) === newCur) {
                jQuery(val).css("background-color", "white");
            } else {
                jQuery(val).css("background-color", "black");
            }
        });
    }

    // Event Listeners 

    // When the window resizes, change the size of the slide container
    // and reposition the bottom bar
    $window.resize(() => {
        windowWidth = $window.width();
        sliderLeft = (windowWidth / 2) - (((numSlides - 2) * 50) / 2);
        leftPad(sliderLeft);
        changeContainerSize();
        $container.css("left", -1 * curSlide * windowWidth);
    });

    $slide_left.click(() => {
        moveLeft();
    });

    $slide_right.click(() => {
        moveRight();
    });


    // Make the slider draggable (phew, not easy)

    // Check for a mouse click on the main container
    // Stop all animations
    // Check if the mouse has moved since the click, move container with the mouse
    // Keep track of the original container position
    // If the distance moved is +ve, trigger right button click, else left button click

    $container.on("mousedown touchstart", (clickEvent) => {
        interval.stop();
        $container.stop(true, true);
        var startLeft = $container.position().left;
        var startX = clickEvent.pageX || clickEvent.originalEvent.touches[0].pageX;
        var diff = 0;
        $window.on("mousemove touchmove", (moveEvent) => {
            interval.stop();
            var x = moveEvent.pageX; //|| moveEvent.originalEvent.touches[0].pageX;
            diff = x - startX;
            $container.css("left", ((-1 * (curSlide * windowWidth) - (windowWidth / 2)) + (startX + diff)) + "px");
            console.log(startLeft + ":" + $container.position().left);
        }).on("mouseup touchend", () => {
            jQuery(this).off("mousemove touchmove mousedown touchstart");
            console.log("mouseup: " + $container.position().left) ;

            if (diff > 8) {
                moveLeft(startLeft);
            } else if (diff < -8) {
                moveRight(startLeft);
            }
        });
    });



});