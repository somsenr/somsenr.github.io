var webFeatures = (function () {
    /* Create and insert a copyright footer */
    function insertFooter () {
        "use strict";
        try {
            var footer;
			/* There are at least one, and maybe more, courses that are developed in partnership with BYU or BYU-Hawaii and require that to be displayed in the copyright. Checking here for customCopyright allows for those courses to create this variable with the custom text in the course.js file before the online.js is appended and then will use the custom text */
			if (typeof customCopyright === "undefined") {
				footer = "<div id='footer'>Copyright &copy; " + new Date().getFullYear() + " by Brigham Young University - Idaho. All Rights Reserved.</div>";
			} else {
				footer = "<div id='footer'>" + customCopyright + "</div>";
			}
            document.getElementById("main").insertAdjacentHTML("beforeend", footer); 
        } catch (ex) {
            console.log(ex.name + ": " + ex.message);
        }
    }

    /****************************************
        Drop-downs
    ****************************************/

    // This will make the necessary changes for the drop-downs to work. This way if the JavaScript doesn't run all the content will still be displayed. The role=button and aria attributes are for accessibility. ID's are attached to the drop-downs and content divs so aria-controls and aria-labeledby can be implemented properly
    function initDropDowns() {
        "use strict";
        try {
            var pointer = "<span class='drop-pointer' aria-hidden='true'>&#x276f;</span>",
                dropDowns = document.querySelectorAll(".drop-down"),
                dropContentDivs = document.querySelectorAll(".drop-content"),
                i;
            for (i = 0; i < dropDowns.length; i++) {
                if (!dropDowns[i].querySelector('.drop-pointer')) {
                    dropDowns[i].id = "drop-down-" + i;
                    dropDowns[i].insertAdjacentHTML("beforeend", pointer);
                    dropDowns[i].setAttribute("role", "button");
                    dropDowns[i].setAttribute("aria-expanded", false);
                    dropDowns[i].setAttribute("aria-controls", "drop-content-" + i);
                    dropDowns[i].classList.add("drop-down-hover");
                    dropDowns[i].tabIndex = "0";
                    dropDowns[i].onclick = dropDown;
                    dropDowns[i].onkeydown = dropDown;
                }
            }
            for (i = 0; i < dropContentDivs.length; i++) {
                if (dropContentDivs[i].style.display != 'none') {
                    dropContentDivs[i].style.display = "none";
                    dropContentDivs[i].setAttribute("aria-labelledby", "drop-down-" + i);
                    dropContentDivs[i].setAttribute("aria-hidden", true);
                    dropContentDivs[i].id = "drop-content-" + i;
                }
            }
        } catch (ex) {
            console.log(ex.name + ": " + ex.message);
        }
    }

    // This function controls the drop-down. It is set to work on a mouseclick or by pressing the spacebar or enter key for accessibility. There are also aria attribute added for accessibility.
    function dropDown(e) {
        "use strict";
        try {
            var contentDiv,
                nextElement,
                i;
            // Only allow enter or spacebar to activate dropdown on a keydown event.
            if (e.type === "keydown" && !(e.keyCode === 32 || e.keyCode === 13)) {
                return;
            }
            e.preventDefault();
            // Find the content-div. It should be the next div or the one after that if there is a checkbox being used with the drop-down
            nextElement = this.nextElementSibling;
            // This will run a maximum of 2 times because the content div shouldn't be any further away then that.
            for (i = 0; i < 2; i++) {
                if (nextElement.classList.contains("drop-content")) {
                    contentDiv = nextElement;
                    break;
                } else {
                    nextElement = nextElement.nextElementSibling;
                }
            }
            if (typeof contentDiv != "undefined") {
                if (contentDiv.style.display === "none") {
                    // Open drop-down
                    contentDiv.style.display = "block";
                    contentDiv.setAttribute("aria-hidden", false);
                    this.setAttribute("aria-expanded", true);
                    this.querySelector(".drop-pointer").style.transform = "rotate(270deg)";
                    if (contentDiv.querySelector(".carousel")) {
                        setCarouselHeight();
                    }
                } else {
                    // Close drop-down
                    contentDiv.style.display = "none";
                    contentDiv.setAttribute("aria-hidden", true);
                    this.setAttribute("aria-expanded", false);
                    this.querySelector(".drop-pointer").style.transform = "";
                }
            }
        } catch (ex) {
            console.log(ex.name + ": " + ex.message);
        }
    }

    // D2L only will resize the content iframe if there is a change in the DOM. The dropdowns that are triggered with just css therefore would expand the content with out having the iframe adjust for the needed extra height. This fixes that by adding a foo class to the labels clicked. Also inserts some hidden text so screen readers will explain why there are checkboxes on each dropdown.
    function dropDownFix() {
        "use strict";
        try {
            var dropDowns = document.querySelectorAll(".tab input"),
                dropDownGroups = document.querySelectorAll(".tab-group"),
                accessibilityMsg = "<span class='hiddenText'>The following dropdowns will display content when the checkbox associated with it is checked.</span>",
                i;
            for (i = 0; i < dropDowns.length; i++) {
                dropDowns[i].onchange = function() {
                    this.classList.toggle("foo");
                };
            }
            for (i = 0; i < dropDownGroups.length; i++) {
                dropDownGroups[i].insertAdjacentHTML("afterbegin", accessibilityMsg);
            }
        } catch (ex) {
            console.log(ex.name + ": " + ex.message);
        }
    }

    /****************************************
        Carousel
    ****************************************/
    var carousels = document.querySelectorAll(".carousel");

    // These are designed so that if the JavaScript isn't loaded for any reason the slides will just appear like regular images. This function is what intializes the carousel by adding the active class and inserting the buttons and setting up the event handlers.
    function initCarousel() {
        "use strict";
        try {
            var slides,
                leftButton = '<button class="carouselLeft" type="button" aria-label="Previous slide">&#x276c;</button>',
                rightButton = '<button class="carouselRight" type="button" aria-label="Next slide">&#x276d;</button>',
                navDotContainer,
                navDots,
                i,
                j;

            for (i = 0; i < carousels.length; i += 1) {
                carousels[i].classList.add("active");
                carousels[i].setAttribute("aria-live", "polite");
                // Insert buttons and attach event handlers
                carousels[i].insertAdjacentHTML("afterbegin", leftButton);
                carousels[i].insertAdjacentHTML("beforeend", rightButton);
                carousels[i].querySelector(".carouselLeft").onclick = function() {
                    jumpToSlide(this.parentElement, "previous");
                };
                carousels[i].querySelector(".carouselRight").onclick = function() {
                    jumpToSlide(this.parentElement, "next");
                };
                // Set up slides with classes to control position
                slides = carousels[i].querySelectorAll(".slide");
                navDotContainer = '<p class="navDots">';
                for (j = 0; j < slides.length; j += 1) {
                    if (j === 0) {
                        slides[j].className = "slide selected";
                        slides[j].setAttribute("aria-hidden", false);
                    } else {
                        slides[j].className = "slide right";
                        slides[j].setAttribute("aria-hidden", true);
                    }
                    slides[j].dataset.index = j;
                    navDotContainer += '<button type="button" value="' + j +'" aria-label="Slide ' + (j+1) +'"></button>';
                }
                navDotContainer += '</p>';
                carousels[i].insertAdjacentHTML("beforeend", navDotContainer);
                carousels[i].querySelector(".navDots button:first-child").className = "current";
                navDots = carousels[i].querySelectorAll(".navDots button");
                for (j = 0; j < navDots.length; j += 1) {
                    navDots[j].onclick = function() {
                        jumpToSlide(this.parentElement.parentElement, this.value);
                    };
                }
            }
            setCarouselHeight();
            window.addEventListener("resize", setCarouselHeight);
        } catch (ex) {
            console.log(ex.name + ": " + ex.message);
        }
    }

    // Because the slides are positioned absolute the .carousel div doesn't expand for it's height. This forces the height to 30px greater then the slide so there is room for the navigation dots.
    function setCarouselHeight() {
        "use strict";
        try {
            var selectedHeight,
                i;
            for (i = 0; i < carousels.length; i += 1) {
                selectedHeight = carousels[i].querySelector('.selected').offsetHeight;
                carousels[i].querySelector('.carouselLeft').style.height = selectedHeight + "px";
                carousels[i].querySelector('.carouselRight').style.height = selectedHeight + "px";
                carousels[i].style.height = selectedHeight + carousels[i].querySelector('.navDots').offsetHeight + "px";
            }
        } catch (ex) {
            console.log(ex.name + ": " + ex.message);
        }
    }

    // This function controls any changing of slides. The parameter targetSlide will be either "next", "previous", or a slide number(this is if a nav dot was clicked). It then uses a loop to give all slides to the left of the target a "left" class and all slides to the right a "right" class.
    function jumpToSlide(carousel, targetSlide) {
        "use strict";
        try{
            var slides = carousel.querySelectorAll(".slide"),
                slideCount = slides.length,
                currentSlide = carousel.querySelector(".selected"),
                currentIndex = parseInt(currentSlide.dataset.index),
                targetIndex,
                assignLeft = true,
                i;
            // Figure out slideIndex
            if (targetSlide === "next") {
                if ((currentIndex + 1) < slideCount) {
                    targetIndex = currentIndex + 1;
                } else {
                    targetIndex = 0;
                }
            } else if (targetSlide === "previous") {
                if ((currentIndex - 1) < 0) {
                    targetIndex = slideCount - 1;
                } else {
                    targetIndex = currentIndex - 1;
                }
            } else {
                targetIndex = targetSlide;
            }
            for (i = 0; i < slides.length; i += 1) {
                if (i == targetIndex) {
                    slides[i].className = "slide selected";
                    slides[i].setAttribute("aria-hidden", false);
                    assignLeft = false;
                } else {
                    if (assignLeft) {
                        slides[i].className = "slide left";
                    } else {
                        slides[i].className = "slide right";
                    }
                    slides[i].setAttribute("aria-hidden", true);
                }
            }
            carousel.querySelector(".navDots .current").className = "";
            carousel.querySelectorAll(".navDots button")[targetIndex].className = "current";
            setCarouselHeight();
        } catch (ex) {
            console.log(ex.name + ": " + ex.message);
        }
    }

    /****************************************
        Overlay
    ****************************************/
    // Any overlays by default will be at the bottom of the page. This function intializes them so that they are hidden until their trigger is clicked/selected. 
    function initImageOverlay() {
        "use strict";
        try {
            var triggers = document.querySelectorAll(".triggerOverlay, .imgViewer"),
                overlays,
                closingX = '<a class="closingX" href="#" aria-label="Return to main content">&#10005</a>',
                backdrop = '<div id="overlayBackdrop"></div>',
                imgViewerOverlay = "<div id='imgViewer' class='overlay'><div class='zoom'><img src='' alt=''><button class='zoomBtn' aria-label='zoom in'>+</button><button class='zoomBtn' aria-label='zoom out'>-</button><button class='moveBtn' data-direction='up' aria-label='move image up'>&#8593;</button><button class='moveBtn' data-direction='left' aria-label='move image left'>&#8592;</button><button class='moveBtn' data-direction='right' aria-label='move image right'>&#8594</button><button class='moveBtn' data-direction='down' aria-label='move image down'>&#8595;</button></div></div>",
                insertImgViewerOverlay = false,
                i;
            for (i = 0; i < triggers.length; i++) {
                if (triggers[i].classList.contains("imgViewer")) {
                    triggers[i].insertAdjacentHTML("beforeend", "<p></p>");
                    insertImgViewerOverlay = true;
                }
                triggers[i].onclick = displayOverlay;
                triggers[i].onkeydown = displayOverlay;
            }
            if (insertImgViewerOverlay) {
                document.getElementById("main").insertAdjacentHTML("afterend", imgViewerOverlay);
            }
            overlays = document.querySelectorAll(".overlay")
            for (i = 0; i < overlays.length; i++) {
                overlays[i].tabIndex = "-1";
                overlays[i].style.position = "absolute";
                overlays[i].style.display = "none";
                overlays[i].insertAdjacentHTML("beforeend", closingX);
            }
            closingX = document.querySelectorAll(".overlay .closingX");
            for (i = 0; i < closingX.length; i++) {
                closingX[i].onclick = closeOverlay;
                closingX[i].onkeydown = closeOverlay;
            }
            document.body.insertAdjacentHTML("beforeend", backdrop);
            /* If backdrop is clicked, close the overlay */
            document.querySelector("#overlayBackdrop").addEventListener("click", function() {
               document.querySelector(".activeOverlay .closingX").click(); 
            });
            window.addEventListener("resize", setOverlaySize);
        } catch (ex) {
            console.log(ex.name + ": " + ex.message);
        }
    }

    var triggerClicked;
    function displayOverlay(e) {
        "use strict";
        try {
            // Only allow enter or spacebar to display overlay on a keydown event.
            if (e.type === "keydown" && !(e.keyCode === 32 || e.keyCode === 13)) {
                return;
            }
            e.preventDefault();
            var overlaySelector,
                overlay,
                main = document.getElementById("main"),
                backdrop = document.getElementById("overlayBackdrop"),
                imgViewer = this.classList.contains("imgViewer"),
                iframe = window.parent.document.getElementsByTagName('iframe')[0];
            if (imgViewer) {
                overlaySelector = "#imgViewer";
            } else {
                overlaySelector = this.href.slice(this.href.indexOf("#"));
            }
            // Find the overlay to show
            overlay = document.querySelector(overlaySelector);
            overlay.classList.add("activeOverlay");
            mainKeyboardFocus("disable");
            
            var iframe_rects = iframe.getClientRects();
            // Set top position
            if (typeof iframe != "undefined" && iframe_rects.length > 0 && !iframe.classList.contains('d2l-iframe-fullscreen') && iframe_rects[0].top < 0) {
                overlay.style.top = Math.abs(iframe_rects[0].top) + 25 + "px";
            } else if (window.scrollY != 0) {
                overlay.style.top = window.scrollY + 25 + "px";
            } else {
                overlay.style.top = "50px";
            }

            setOverlaySize();

            backdrop.style.display = "block";
            overlay.style.display = "block";
            if (overlay.querySelector(".carousel")) {
                setCarouselHeight();
            }
            overlay.focus();
            main.setAttribute("aria-hidden", true);
            if (imgViewer) {
                activateImg(this.querySelector("img"));
            }
            triggerClicked = this;
        } catch (ex) {
            console.error(ex);
          
        }
    }

    function closeOverlay(e) {
        "use strict";
        try{
            // Only allow enter or spacebar to close overlay on a keydown event.
            if (e.type === 'keydown' && !(e.keyCode === 32 || e.keyCode === 13)) {
                return;
            }
            e.preventDefault();
            var mainDiv = document.getElementById("main"),
                backdrop = backdrop = document.getElementById("overlayBackdrop");
            backdrop.style.display = "none";
            this.parentElement.style.display = "none";
            this.parentElement.classList.remove('activeOverlay');
            mainDiv.setAttribute("aria-hidden", false);
            mainKeyboardFocus("enable");
            // Return focus to trigger if using a keyboard
            if (e.type === 'keydown') {
                triggerClicked.focus();
            }
        } catch (ex) {
            console.log(ex.name + ": " + ex.message);
        }
    }

    // If #main is at its max width the overlay is sized to be the same width as #main but if #main is less then its max then the overlay is #main's width - 10px and set 5px to the right so it is centered.
    function setOverlaySize() {
        "use strict";
        try {
            var main = document.getElementById("main"),
                overlay = document.querySelector(".activeOverlay");
            if (overlay == null) {return;}
            // Set width and left position
            if (main.offsetLeft === 0) {
                overlay.style.left = "5px";
                overlay.style.width = main.offsetWidth - 10 + "px";
            } else {
                overlay.style.left = main.offsetLeft + "px";
                overlay.style.width = main.offsetWidth + "px";
            }
        } catch (ex) {
            console.log(ex.name + ": " + ex.message);
        }
    }

    // When the overlay is active you don't want users to be able to tab out of the overlay because they may get loss track of where focus is. Since the overlay is just outside of #main, this disables focus for all #main elements until they close the overlay.
    function mainKeyboardFocus(action) {
        "use strict";
        try {
             var focusElements,
                 i;
            switch (action) {
                case "disable":
                    focusElements = document.querySelectorAll("#main a, #main [tabIndex='0'], #main button, #main input, #main select");
                    for (i = 0; i < focusElements.length; i++) {
                        focusElements[i].tabIndex = "-1";
                    }
                    break;
                case "enable":
                    focusElements = document.querySelectorAll("#main a, #main [tabIndex='-1'], #main button, #main input, #main select");
                    for (i = 0; i < focusElements.length; i++) {
                        focusElements[i].tabIndex = "0";
                    }
                    break;
            }
        } catch (ex) {
            console.log(ex.name + ": " + ex.message);
        }
    }

    /****************************************
        IMAGE VIEWER
    ****************************************/
    var imageViewerWidth,
        previousX = "",
        previousY = "";
    function activateImg(clickedImage) {
        "use strict";
        try {
            var zoomDiv = document.querySelector('#imgViewer .zoom'),
                controls = zoomDiv.querySelectorAll("button"),
                img = zoomDiv.querySelector('img'),
                i;
            img.src = clickedImage.src;
            img.alt = clickedImage.alt;
            for (i = 0; i < controls.length; i += 1) {
                if (controls[i].classList.contains("moveBtn")) {
                    controls[i].addEventListener("click", moveImg);
                } else {
                    controls[i].addEventListener("click", zoom);
                }
            }
            img.addEventListener('mousedown', 
              function(e) {
                e.preventDefault();
                img.addEventListener('mousemove', moveImg);
            });
            window.document.addEventListener('mouseup', removeMoveImgListener);
            window.document.addEventListener('mouseleave', removeMoveImgListener);
            imageViewerWidth = document.querySelector("#imgViewer").clientWidth;
            document.querySelector('#imgViewer .closingX').addEventListener('click', resetZoomDiv);
            window.parent.addEventListener("resize", resetZoomDiv);
        } catch (ex) {
            console.log(ex.name + ": " + ex.message);
        }
    }

    function removeMoveImgListener() {
        "use strict";
        try {
            document.querySelector("#imgViewer .zoom img").removeEventListener('mousemove', moveImg);
            previousX = "";
            previousY = "";
        } catch (ex) {
            console.log(ex.name + ": " + ex.message);
        }
    }

    function resetZoomDiv(e) {
        "use strict";
        try {
            if (e.type === "click" || (e.type === "resize" && imageViewerWidth != document.querySelector("#imgViewer").clientWidth)) {
                var zoomDiv = document.querySelector('#imgViewer .zoom'),
                    img = zoomDiv.querySelector('img');
                zoomDiv.style.width = "";
                zoomDiv.style.height = "";
                img.style.top = "";
                img.style.left = "";
                img.style.width = "";
                img.style.height = "";
                img.style.cursor = "default";
            }
        } catch (ex) {
            console.log(ex.name + ": " + ex.message);
        }
    }

    function setInitialSize(zoomDiv, img) {
        "use strict";
        try {
            zoomDiv.style.height = zoomDiv.offsetHeight + "px";
            img.style.width = zoomDiv.offsetWidth + "px";
            img.style.height = zoomDiv.offsetHeight + "px";
            img.style.top = "0px";
            img.style.left = "0px";
        } catch (ex) {
            console.log(ex.name + ": " + ex.message);
        }
    }

    function zoom(e) {
        "use strict";
        try {
            var button = e.target,
                zoomDiv = button.parentElement,
                img = zoomDiv.querySelector('img'),
                top,
                left,
                width,
                height,
                adj,
                ratio,
                zoomAmt;
            if (zoomDiv.style.height === "") { setInitialSize(zoomDiv, img); }
            top = parseInt(img.style.top.split("p")[0]);
            left = parseInt(img.style.left.split("p")[0]);
            width = parseInt(img.style.width.split("p")[0]);
            height = parseInt(img.style.height.split("p")[0]);
            img.style.cursor = "move";
            if (width > height) {
                ratio = width / height;
            } else {
                ratio = height / width;
            }
            zoomAmt = Math.round(width * .2);
            if (width > height && button.innerHTML === "+") {
                height = height + zoomAmt;
                width = Math.round(width + (zoomAmt * ratio));
                top = top - (zoomAmt / 2);
                left = left - zoomAmt * ratio / 2;
            } else if (width > height) {
                height = height - zoomAmt;
                width = Math.round(width - (zoomAmt * ratio));
                top = top + (zoomAmt / 2);
                left = left + zoomAmt * ratio / 2;
            } else if (height >= width && button.innerHTML === "+") {
                height = Math.round(height + (zoomAmt * ratio));
                width = width + zoomAmt;
                top = top - zoomAmt * ratio / 2;
                left = left - (zoomAmt / 2);
            } else {
                height = Math.round(height - (zoomAmt * ratio));
                width = width - zoomAmt;
                top = top + zoomAmt * ratio / 2;
                left = left + (zoomAmt / 2);
            }
            // Check new positions and if needed adjust values
            if (width - Math.abs(left) < zoomDiv.offsetWidth) {
                left = zoomDiv.offsetWidth - width;
            }
            if (left > 0) {
                left = 0;
            }
            if (height - Math.abs(top) < zoomDiv.offsetHeight) {
                top = zoomDiv.offsetHeight - height;
            }
            if (top > 0) {
                top = 0;
            }
            if (width < zoomDiv.offsetWidth) {
                width = zoomDiv.offsetWidth;
                height = zoomDiv.offsetHeight;
                img.style.cursor = "default";
            }
            // Set new values
            img.style.top = top + "px";
            img.style.left = left + "px";
            img.style.width = width + "px";
            img.style.height = height + "px";
        } catch (ex) {
            console.log(ex.name + ": " + ex.message);
        }
    }

    function moveImg(e) {
        "use strict";
        try {
            var img,
                xMove,
                yMove;
            if (e.target.nodeName === "BUTTON") {
                img = e.target.parentElement.querySelector('img');
                switch(e.target.dataset.direction) {
                    case "up":
                        yMove = 75;
                        break;
                    case "left":
                        xMove = 75;
                        break;
                    case "right":
                        xMove = -75;
                        break;
                    case "down":
                        yMove = -75;
                        break;
                }
            } else if (previousX === "") {
                previousX = e.pageX;
                previousY = e.pageY;
                return;
            } else {
                img = e.target;
                xMove = e.pageX - previousX;
                yMove = e.pageY - previousY;
                previousX = e.pageX;
                previousY = e.pageY;
            }
            var divWidth = parseInt(img.parentElement.offsetWidth),
                divHeight = parseInt(img.parentElement.style.height.split("p")[0]),
                left = parseInt(img.style.left.split("p")[0]),
                top = parseInt(img.style.top.split("p")[0]),
                width = parseInt(img.style.width.split("p")[0]),
                height = parseInt(img.style.height.split("p")[0]);

            if (xMove < 0) {
                // movement left moves image left
                if (Math.abs(left + xMove) < (width - divWidth)) {
                    img.style.left = left + xMove + "px";
                } else {
                    img.style.left = divWidth - width + "px";
                } 
            } else if (xMove > 0) {
                // movement right moves image right
                if (left + xMove < 0) {
                    img.style.left = left + xMove + "px";
                } else {
                    img.style.left = 0 + "px";
                }
            }
            if (yMove < 0) {
                // movement up moves image down
                if (Math.abs(top + yMove) < (height - divHeight)) {
                    img.style.top = top + yMove + "px";
                } else {
                    img.style.top = divHeight - height + "px";
                }
            } else if (yMove > 0) {
                // movement down moves image up
                if (top + yMove < 0) {
                    img.style.top = top + yMove + "px";
                } else {
                    img.style.top = 0 + "px";
                }
            }
        } catch (ex) {
            console.log(ex.name + ": " + ex.message);
        }
    }

    /****************************************
        Mouseover pop-ups
    ****************************************/

    // Function to reposition mouseover popups if they overflow off #article
    function positionPopups() {
        "use strict";
        try {
            var popupSpans = document.querySelectorAll(".popup"),
                articleWidth = document.getElementById("article").offsetWidth,
                span,
                spanWidth,
                spanLeft,
                offsetParent,
                popup,
                popupWidth,
                popupWordCount,
                overflowLeft,
                overflowRight,
                i;
            // This loop goes through each popup and adjusts the width and position of popups so they don't ever overflow off the #article div
            for (i = 0; i < popupSpans.length; i++) {
                span = popupSpans[i];
                spanWidth = span.offsetWidth;
                popup = popupSpans[i].firstElementChild;
                popupWidth = 200;
                popupWordCount = popup.textContent.split(" ").length;
                // This will make popups accessiable with the TAB key
                popupSpans[i].tabIndex = 0;
                // This makes popups with more than 10 words wider
                if (popupWordCount > 10) {
                    popup.style.width = "400px";
                    popup.style.left = "calc(50% - 200px)";
                    popupWidth = 400;
                }
                // There was an inconsistancy with the position of popups when the containing span was broken over two lines and this fixes that
                if (span.getClientRects().length > 1) {
                    popup.style.left = spanWidth / 2 - popupWidth / 2 + "px";
                }
                spanLeft = span.offsetLeft;
                offsetParent = span.offsetParent;
                // This loop determins the distance between the left article edge and the span containing the popup
                while (offsetParent.id !== "article" && offsetParent.tagName !== "BODY") {
                    spanLeft += offsetParent.offsetLeft;
                    offsetParent = offsetParent.offsetParent;
                }
                // Here calculations are made to determine if popups will overflow #article. If so corrections are made. The 20's and the 40's are to componsate for the 20px of padding on each side of #article
                overflowLeft = popupWidth / 2 - spanWidth / 2 - spanLeft + 20;
                overflowRight = (spanLeft + spanWidth / 2 + popupWidth / 2) - articleWidth + 20;
                if (popupWidth > articleWidth - 40) {
                    popup.style.width = articleWidth - 40 + "px";
                    popup.style.left = 20 - spanLeft + "px";
                } else if (overflowLeft > 0) {
                    popup.style.left = 20 - spanLeft + "px";
                } else if (overflowRight > 0) {
                    popup.style.left = -popupWidth + articleWidth - spanLeft - 20 + "px";
                }
            }
        } catch (ex) {
            console.log(ex.name + ": " + ex.message);
        }
    }
    window.addEventListener("resize", positionPopups);

    /****************************************
        D2L Fixes
    ****************************************/

    // Fix D2L issue with the bottom of the content in the iframe being cut off when the window is resized. This is set to run only if the width of #main changes.
    var mainWidth,
        fooNum = -1;
    function triggerIframeResize() {
        "use strict";
        try {
            if (mainWidth == null) {
                mainWidth = document.getElementById("main").offsetWidth
            }
            var main = document.getElementById("main");
            if (main.offsetWidth != mainWidth) {
                mainWidth = main.offsetWidth;
                if (fooNum === -1) {
                    fooNum = 0;
                    main.classList.add("foo-" + fooNum);
                } else {
                    main.classList.remove("foo-" + fooNum);
                    fooNum += 1;
                    main.classList.add("foo-" + fooNum);
                }
            }
        } catch (ex) {
            console.log(ex.name + ": " + ex.message);
        }
    }
    window.addEventListener("resize", triggerIframeResize);

    // Enable fullscreen for videos in D2L
    function enableFullScreen () {
        "use strict";
        try {
            window.parent.document.querySelector("iframe").setAttribute("allowfullscreen",true);
        } catch (ex) {
            console.log(ex.name + ": " + ex.message);  
        }
    }

    // Since tab-index is being set on different elements for accessibility they show a outline when clicked but it really is only needed for those using a keyboard to navigate the page. This hides that outline unless TAB is actually being used, then it enables the outline.
    function disableFocusOutlines() {
        "use strict";
        try {
            var tabElements = document.querySelectorAll("*[tabIndex='0'], button, label, select, a"),
                i;
            for (i = 0; i < tabElements.length; i += 1) {
                tabElements[i].style.outline = "none";
            }
            window.addEventListener("keydown", enableFocusOutlines);
        } catch (ex) {
            console.log(ex.name + ": " + ex.message);
        }
    }

    // Re-enable tab outlines
    function enableFocusOutlines(e) {
        "use strict";
        try {
            if (e.type === "keydown" && e.keyCode === 9) {
                var tabElements = document.querySelectorAll("*[tabIndex='0'], button, label, select, a"),
                i;
                for (i = 0; i < tabElements.length; i += 1) {
                    tabElements[i].style.outline = "";
                }
                window.removeEventListener("keydown", enableFocusOutlines);
            }
        } catch (ex) {
            console.log(ex.name + ": " + ex.message);
        }
    }

    /* Google Analytics */
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

      ga('create', 'UA-39293379-5', 'auto', {'siteSpeedSampleRate': 100});
      ga('send', 'pageview');

    window.onload = function () {
        insertFooter();
        positionPopups();
        dropDownFix();
        initDropDowns();
        initImageOverlay();
        initCarousel();
        enableFullScreen();
        disableFocusOutlines();
    };
    
    // In case you every dynamically insert drop-downs you can intialize them after inserting them.
    return {
        initDropDowns: initDropDowns
    }
    
}());