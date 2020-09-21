
const m9Vars = {
    smallScreenCategories : ['ss', 'ms'],
    largeScreenCategories : ['ls', 'xl', 'xxl', 'massive'],
    isSmallScreen: false,
    flickityOpts : { "wrapAround": true }
};


const mNineDScript = {};


mNineDScript.start = {

    'config': {},
    init(settings) {
        // loop through any settings passed in, and overwrite the default config with those settings
        if (settings && typeof (settings) === 'object') {
            for (let prop in settings) {
                if (settings.hasOwnProperty(prop)) {
                    this.config[prop] = settings[prop];
                }
            }
        }

        this.canHover();

        let currSS = currScreenSize();

        if (currSS === 'xls' || currSS ==='xxl' || currSS ==='massive') {
            this.cursorSetup();
        }

        this.resizeActions();
        this.runNav();
        this.runScrollAnimations();
        this.scrollToSection();
        this.activeSectionClasses();
        this.siteBtt();
        this.formValidation();

        this.projectGridActions();
        this.projectCaseStudyControl();

    },
    cursorSetup() {
        let cursor = {
            delay: 8,
            _x: 0,
            _y: 0,
            endX: (window.innerWidth / 2),
            endY: (window.innerHeight / 2),
            cursorVisible: true,
            cursorEnlarged: false,
            $dot: $1('.cursor-dot'),
            $outline: $1('.cursor-dot-outline'),

            init: function () {
                // Set up element sizes
                this.dotSize = this.$dot.offsetWidth;
                this.outlineSize = this.$outline.offsetWidth;

                this.setupEventListeners();
                this.animateDotOutline();
            },


            setupEventListeners: function () {
                const self = this;

                // Anchor hovering
                $('a, button').forEach(function (el) {
                    el.addEventListener('mouseover', function () {
                        self.cursorEnlarged = true;
                        self.toggleCursorSize();
                        addClass(self.$outline, 'elementHover');
                    });
                    el.addEventListener('mouseout', function () {
                        self.cursorEnlarged = false;
                        self.toggleCursorSize();
                        removeClass(self.$outline, 'elementHover');
                    });
                });

                // Anchor hovering
                $('.hover-cursor-effect').forEach(function (el) {
                    el.addEventListener('mouseover', function () {

                        addClass(self.$outline, 'imgHover');
                    });
                    el.addEventListener('mouseout', function () {

                        removeClass(self.$outline, 'imgHover');
                    });
                });

                // Click events
                document.addEventListener('mousedown', function () {
                    self.cursorEnlarged = true;
                    self.toggleCursorSize();
                });
                document.addEventListener('mouseup', function () {
                    self.cursorEnlarged = false;
                    self.toggleCursorSize();
                });


                document.addEventListener('mousemove', function (e) {
                    // Show the cursor
                    self.cursorVisible = true;
                    self.toggleCursorVisibility();

                    // Position the dot
                    self.endX = e.pageX;
                    self.endY = e.pageY;
                    self.$dot.style.top = self.endY + 'px';
                    self.$dot.style.left = self.endX + 'px';
                });

                // Hide/show cursor
                document.addEventListener('mouseenter', function (e) {
                    self.cursorVisible = true;
                    self.toggleCursorVisibility();
                    self.$dot.style.opacity = 1;
                    self.$outline.style.opacity = 1;
                });

                document.addEventListener('mouseleave', function (e) {
                    self.cursorVisible = true;
                    self.toggleCursorVisibility();
                    self.$dot.style.opacity = 0;
                    self.$outline.style.opacity = 0;
                });
            },

            animateDotOutline: function () {
                const self = this;

                self._x += (self.endX - self._x) / self.delay;
                self._y += (self.endY - self._y) / self.delay;
                self.$outline.style.top = self._y + 'px';
                self.$outline.style.left = self._x + 'px';

                requestAnimationFrame(this.animateDotOutline.bind(self));
            },

            toggleCursorSize: function () {
                const self = this;

                if (self.cursorEnlarged) {
                    self.$dot.style.transform = 'translate(-50%, -50%) scale(0.5)';
                    self.$outline.style.transform = 'translate(-50%, -50%) scale(1.8)';
                } else {
                    self.$dot.style.transform = 'translate(-50%, -50%) scale(1)';
                    self.$outline.style.transform = 'translate(-50%, -50%) scale(1)';
                }
            },

            toggleCursorVisibility: function () {
                const self = this;

                if (self.cursorVisible && !hasClass(self.$outline, 'elementHover')) {
                    self.$dot.style.opacity = 1;
                    self.$outline.style.opacity = 1;

                } else if (self.cursorVisible && hasClass(self.$outline, 'elementHover')) {
                    self.$outline.style.opacity = 0.5;
                } else {
                    self.$dot.style.opacity = 0;
                    self.$outline.style.opacity = 0;
                }
            }
        };

        cursor.init();
    },
    canHover () {
        // if we have proper hover

        const docEl = document.documentElement;

        if(window.matchMedia('(hover: hover)').matches) {
            addClass(docEl, 'is-hover-device');
        }

    },
    runNav() {
        const navTrigger = $1('.hamburger');
        const navWrapper = $1('.mn-site-nav');
        const navItems = $('.mn-site-nav-link-item');
        const bodyEl = $1('body');
        const navVideoWrap = $1('.mn-site-nav-video-bg');
        const navStrapLine = $1('.mn-section-nav-strapline');
        const navLinks = $('.mn-site-nav-contact-link');
        const video = $1('#mn-site-nav-vid');
        const navLast = $1('.is-nav-last');

        const tl = gsap.timeline();

        function toggleNavTriggerClass() {
            toggleClass(navTrigger, 'is-active');
            toggleClass(bodyEl, 'is-nav-active');
        }

        function addNavClass() {

            addClass(navWrapper, 'is-active');
            navWrapper.setAttribute('aria-expanded', 'true');
        }

        function startVideo() {

            if(hasClass(video, 'has-video') && hasClass(video, 'video-ready' )) {

                    video.play();
            }
        }

        function stopVideo() {

            if(hasClass(video, 'has-video')) {

                video.pause();
            }
        }

        function addVisibleNavItemClass() {

            let delay = 0;

            for (let i = 0; i < navItems.length; i++) {
                let el = navItems[i];
                delay += 250;

                setTimeout(() => {
                    addClass(el, 'is-visible');
                }, 100 + delay);

            }
        }

        function removeVisibleNavItemClass() {
            navItems.forEach((el) => {
                removeClass(el, 'is-visible');
            });
        }

        function removeNavClass() {
            removeClass(navWrapper, 'is-active');
            navWrapper.setAttribute('aria-expanded', 'false')
        }

        navTrigger.addEventListener('click', () => {
            animationNavigation();

        });

        function animationNavigation() {
            if (hasClass(navWrapper, 'is-active')) {

                if (!tl.isActive()) {

                    tl.call(toggleNavTriggerClass);
                    tl.to(navStrapLine, {opacity: 0, duration: 0.7, ease: "circ.out"});
                    if(hasClass(video, 'has-video')) {
                        tl.to(navVideoWrap, {opacity: 0, duration: 0.5, ease: "circ.inOut"});
                    }
                    tl.to(navLinks, {opacity: 0, duration: 0.3});
                    tl.to(navItems, {left: 200, opacity: 0, duration: 0.15, stagger: 0.15, ease: "circ.Out", onComplete: removeVisibleNavItemClass}, ">-0.4");
                    tl.to(navWrapper, {
                        x: '100%', duration: 1, ease: "circ.inOut", onComplete: function () {
                            removeNavClass();
                            stopVideo();
                        }
                    });

                }

            } else {

                if (!tl.isActive()) {

                    tl.call(toggleNavTriggerClass);
                    tl.to(navWrapper, {x: 0, duration: 1, ease: "circ.inOut", onComplete: addNavClass});
                    tl.to(navItems, {left: 0, opacity: 1, duration: 0.35, stagger: 0.35, ease: "circ.Out", onStart: addVisibleNavItemClass}, ">-0.4");
                    tl.to(navLinks, {opacity: 1, duration: 0.5});
                    if(hasClass(video, 'has-video')) {
                        tl.to(navVideoWrap, {opacity: 1, duration: 2, ease: "circ.inOut", onComplete: startVideo});
                    }
                    tl.to(navStrapLine, {opacity: 1, duration: 0.5, ease: "circ.out"}, "<-1.0");

                }
            }
        }


        navItems.forEach((el) => {
            el.addEventListener('click', (e) => {
                e.preventDefault();

                // detection for screen size here to determine what the position of the strapline should be

                if (!tl.isActive()) {

                    let sectionTarget = el.getAttribute('href');
                    animationNavigation();

                    setTimeout(() => {
                        this.doPageScroll(sectionTarget);
                    }, 3000);
                }
            });

        });


        // accessibility trap to provide circular tabbing for menu via keyboard when open
        function accessTrap () {

            navLast.addEventListener('blur', function(e) {
                if(hasClass(navWrapper, 'is-active')){
                    navTrigger.focus();
                }
            });
        }

        accessTrap();

    },
    runScrollAnimations() {

        const aboutTitleHd = $1('.mn-section-about-hd-lg');
        const aboutTitleEls = $('.mn-section-about-hd-anim');

        const scrollController = new ScrollMagic.Controller();

        // about section animation logic

        let aboutTl = gsap.timeline({paused: true});

        let aboutTitleTween = aboutTl.to(aboutTitleHd, {duration: 0.7, opacity: 1, left: 0, '-webkit-filter': " blur(0px)", ease: "circ.inOut(0.5)"}, 0.5);
        let aboutElsTween = aboutTl.to(aboutTitleEls, {duration: 0.8, stagger: 0.25, opacity: 1, top: 0, '-webkit-filter': " blur(0px)", ease: "circ.inOut(0.5)"}, ">-0.3");


        let aboutScene = new ScrollMagic.Scene({
            triggerElement: '#js-about-top',
            offset: -100

        })
            .on("enter", function () {
                aboutTl.play();
        })
            .on("leave", function () {
                aboutTl.reverse();
        })
            .addTo(scrollController);

        // services section animation logic

        const servicesTl = gsap.timeline({paused: true});

        const serviceHeadings = $('.mn-section-services-item-hd');
        const serviceItems = $('.mn-section-services-item-list');

         servicesTl.to(serviceHeadings, {duration: 0.2, opacity: 1, stagger: 0.2, scaleX: 1, scaleY: 1, '-webkit-filter': " blur(0px)", ease: "circ.inOut(0.3)"}, ">-1.8");
         servicesTl.to(serviceItems, {duration: 0.4, stagger: 0.17, opacity: 1, top: 0, ease: "circ.out(0.4)"}, ">0.2");


        let servicesScene = new ScrollMagic.Scene({
            triggerElement: '#js-services-top',

        })
            .on("enter", function () {
                servicesTl.play();
        })
            .on("leave", function () {
                servicesTl.reverse();
            })
            .addTo(scrollController);


    },
    scrollToSection() {

        let self = this;

        let scrollTriggers = $('.mn-scroll-trig');

        for (let i = 0; i < scrollTriggers.length; i++) {
            scrollTriggers[i].addEventListener('click', function (e) {

                e.preventDefault();

                let target = this.getAttribute("href");

                self.doPageScroll(target);

            });
        }
    },
    doPageScroll(scrollTarget, scrollDuration = 1.3) {

        gsap.to(window, {duration: scrollDuration, scrollTo: {y: scrollTarget, autoKill: false}, ease: "circ.inOut"});
    },
    projectsSummaryControl() {

        // function to control the project summaries, and their animation with GSAP

        const projectSummaryTriggers = $('.mn-section-project-summary-trigger');
        const projectsTl = gsap.timeline();
        const projectWrappers = $('.mn-section-project-summary-item');
        const itemHeight = 65;
        const projectsSummaryContainer = $1('#js-projects-summary-container');
        const bodyEl = $1('body');
        const docEl = document.documentElement;
        const projectSummaryClose = $1('.mn-projects-summary-detail-close');
        const projectsSection = $1('#js-projects-top');
        const fadeSections = $('.mn-section-fade');
        const projectContainerClass = '.mn-projects-summary-detail-wrapper';
        const _self = this;
        const projectSummaryBg = $1('.mn-section-projects-summary-bg ');

        // 2 possible values for resetting the project items
        const resetItemValues = ['20px', '80px'];
        let currItemResetValue = resetItemValues[0];


        for (let i = 0; i < projectWrappers.length; i++) {
            let el = projectWrappers[i];

            addClass(el, 'is-inactive');
            el.dataset.originalPosition = el.style.top = (i * itemHeight);
            el.dataset.originalIndex = i;

            if (i > 0) {
                el.style.top = (i * itemHeight) + 'px';
                el.style.zIndex = i;
            }
        }


        projectSummaryTriggers.forEach((el) => {

            el.addEventListener('click', (e) => {

                e.preventDefault();


                let contentToLoad = el.dataset.content;
                let elParent = el.parentNode.parentNode;
                let projectContainer = $1(projectContainerClass, elParent);

                if(hasClass(elParent, 'is-inactive')) {

                    partialLoader(projectContainer, contentToLoad)
                        .then(function () {
                            setTimeout(function () {

                                // need to look at pre-loader here

                                removeClass(elParent, 'is-inactive');
                                addClass(elParent, 'is-animating');
                                openProject(el);

                            }, 500);

                        })
                        .catch(function () {
                            // need to do something here with the error handler
                        });

                } // end if

            });
        });


        function openProject(element) {

            let parentEl = element.parentNode.parentNode;
            let inactiveSiblings = $('li.is-inactive');

            projectsTl.to(element, {duration: 0.9, backgroundColor: '#000000'});
            projectsTl.to(inactiveSiblings, {duration: 0.3, opacity: 0.5});
            projectsTl.to(fadeSections, {
                duration: 0.5, opacity: 0, onComplete: function () {
                    gsap.to(window, {
                        duration: 1.1,
                        scrollTo: {y: projectsSummaryContainer, autoKill: false},
                        ease: "circ.inOut",
                        onComplete: function () {
                            projectOpenActions();
                        }
                    });
                }
            });


            function projectOpenActions() {

                projectsTl.to(element, {duration: 0.6, className: "+=is-active", ease: "circ.inOut(0.5)"});
                projectsTl.to(parentEl, {duration: 0.7, top: 0, opacity: 1, ease: "expo.inOut(0.5)"});
                projectsTl.to(parentEl, {duration: 0.7, height: '100vh', ease: "expo.inOut(0.5)"});
                projectsTl.to(inactiveSiblings, {duration: 0.3, opacity: 0});
                projectsTl.to(projectSummaryBg, {duration: 0.5, opacity: 0});
                projectsTl.to(parentEl, {duration: 0.7, zIndex: '1000', backgroundColor: 'rgba(32,32,32,1.0)', opacity: 1, ease: "circ.inOut(0.3)", onComplete: function () {

                        openDetail(parentEl);
                        addClass(parentEl, 'is-active-wrapper');

                    }
                });

                // these will run as the timeline is running
                addClass(projectsSummaryContainer, 'is-active');
                addClass(docEl, 'is-projects-active');
            }

        }


        function openDetail(element) {

            let detailEl = $1('.mn-projects-summary-detail-wrapper', element);


            gsap.to(detailEl, {duration: 0.1, display: 'block'});
            gsap.to(detailEl, {
                duration: 0.7, top: 0, opacity: 1, height: '100%', ease: "circ.inOut(0.5)", onComplete: function () {

                    _self.projectDetailControl();

                }
            });
        }

        function resetProjectsWindow() {

            gsap.to(window, {duration: 0.9, scrollTo: {y: projectsSection, autoKill: false}, ease: "expo.inOut(0.6)"});
            projectsTl.to(fadeSections, {duration: 0.5, opacity: 1});

            // remove container class, and body class to remove fixed positioning etc
            removeClass(projectsSummaryContainer, 'is-active');

        }


        function resetProjects() {

            let activeWrapper = $1('.is-active-wrapper');
            let activeDetail = $1('.mn-projects-summary-detail-wrapper', activeWrapper);
            let activeAnchor = $1('.is-active', activeWrapper);
            let activeWrapperOriginalPos = activeWrapper.dataset.originalPosition;
            let activeWrapperOriginalIndex = activeWrapper.dataset.originalIndex;
            let inactiveSiblings = $('li.is-inactive');
            const projectCloseBtn = $1('.mn-projects-summary-detail-close');
            const resetTl = gsap.timeline();

            // need to hide content first here

            // hiding content here
            resetTl.to(projectCloseBtn, {duration: 0.5, opacity: 0, ease: "circ.inOut(0.5)"});

            resetTl.to(activeDetail, {
                duration: 0.7, opacity: 0, ease: "circ.inOut(0.5)", onComplete: function () {

                    activeDetail.style = '';
                    activeWrapper.style.overflowY = 'hidden';

                }
            });

            // set the summary item back to 65 px height
            resetTl.to(activeWrapper, {duration: 0.9, height: itemHeight + 'px', ease: "circ.inOut(0.5)"});
            // make the siblings visible again
            resetTl.to(inactiveSiblings, {duration: 0.7, opacity: 1});
            // rest opacity of section bg
            resetTl.to(projectSummaryBg, {duration: 0.5, opacity: 1});
            // move the summary item back to it's original position
            resetTl.to(activeWrapper, {duration: 0.65, top: activeWrapperOriginalPos + 'px', ease: "expo.inOut(0.4)"});
            // move the anchor back to the left of the list
            resetTl.to(activeAnchor, {duration: 0.7, translateX: currItemResetValue, className: "-=is-active", ease: "circ.inOut(0.4)", onComplete: function () {

                    // take the inline style for bg color off
                    activeWrapper.style.removeProperty('background-color');
                    // reset the z index for the element
                    activeWrapper.style.zIndex = activeWrapperOriginalIndex;
                    // take the background color off the anchor as well
                    activeAnchor.style.removeProperty('background-color');
                    activeWrapper.style.removeProperty('overflow-y');
                    // remove the class from the active wrapper
                    removeClass(activeWrapper, 'is-active-wrapper');
                    removeClass(activeWrapper, 'is-animating');

                    removeClass(docEl, 'is-projects-active');
                    // add the default class back to previously added element
                    addClass(activeWrapper, 'is-inactive');


                    // move the window back to top of projects
                    resetProjectsWindow();


                }
            });


        }

        // when close button for project is clicked, need screen size to evaluate the transform
        // position to tween to - it's one of 2 values in array at top of function
        // so get the screen size, if largest screens, pick that value from array
        // if not, assign th other one for gsap to use

        function getResetValue () {

            let currSS = currScreenSize();

            if(currSS === 'xls' || currSS === 'xxl' || currSS === 'massive') {
                currItemResetValue = resetItemValues[1];
            } else {
                currItemResetValue = resetItemValues[0];
            }

        }

        projectSummaryClose.addEventListener('click', () => {

           getResetValue();

            // triggering the reset of projects here
            resetProjects();

        });

        // reset on escape
        window.addEventListener('keydown', (evt) => {

            getResetValue();


            if (evt.key === 'Escape') {

                resetProjects();
            }
        });


    },
    activeSectionClasses() {

        // for each section, we need a class added to body for the menu variations etc
        // this is done via waypoints js

        // also in this function, when we hit the top of the page, we want to clear the variation classes

        let sections = $('.mn-section-main');
        let bodyWrap = $1('body');
        let _self = this;

        for (let i = 0; i < sections.length; i++) {
            let el = sections[i];
            let elIndex = i;
            let elId = el.id;
            let classToAdd = elId + '-is-active';
            let element = document.getElementById(elId);

            let waypointDown = new Waypoint({
                element: element,
                handler: function (direction) {
                    bodyWrap.className = '';
                    addClass(bodyWrap, classToAdd);
                    _self.manageSliderClasses(elIndex);
                },
                offset: '15%'
            });

            let waypointUp = new Waypoint({
                element: element,
                handler: function (direction) {
                    bodyWrap.className = '';
                    addClass(bodyWrap, classToAdd);
                    _self.manageSliderClasses(elIndex);
                },
                offset: '-15%'
            });

        }

        _self.manageSliderClasses(0);

        window.onscroll = function () {
            if (window.pageYOffset === 0) {
                bodyWrap.className = '';
                addClass(bodyWrap, 'js-section-home-is-active');
                _self.manageSliderClasses();
            }
        };
    },
    siteBtt() {

        const siteBtt = $1('.mn-site-footer-btt');

        // back to top button for each wrapper
        siteBtt.addEventListener('click', () => {

            gsap.to(document.documentElement, {duration: 1.2, scrollTo: {y: 0, autoKill: false}, ease: "circ.inOut",});

        });
    },
    'formValidation'() {


        const formFeedbackWrap = $1('.mn-contact-feedback');
        const form = $1('.mn-contact-frm');

        new JustValidate('.mn-contact-frm', {
            rules: {
                cmrName: {
                    required: true,
                },
                cmrEmail: {
                    required: true,
                    email: true,
                },
                cmrNumber: {
                    required: true,
                },
                cmrMessage: {
                    required: true,
                }
            },
            messages: {
                cmrName: 'Please Enter Your Name',
                cmrEmail: 'An Email Address Is Required',
                cmrNumber: 'Please Add Your Phone Number ',
                cmrMessage: 'A Message Is Required'
            },
            submitHandler: function (form, values, ajax) {

                ajax({
                    url: '/site-partials/form-handler.php',
                    method: 'POST',
                    data: values,
                    async: true,
                    callback: function (response) {
                        formFeedbackWrap.innerHTML = response;
                        form.reset();

                    },
                    error: function () {
                        formFeedbackWrap.innerHTML = ' There was a problem with your submission, please try again';
                    }
                });
            }
        });

    },
    triggerVideos() {

        let ss = currScreenSize();

        if (ss === 'ss' || ss === 'ms' || ss === 'ls' || ss ==='xls') {
            return;
        }

        let mediaWrappers = $('.mn-site-nav-video-bg');
        let videoFormats = [{type: 'mp4'}, {type: 'webm'}]; //, {type : 'webm'}

        for (let i = 0; i < mediaWrappers.length; i++) {
            let wrapperEl = mediaWrappers[i];
            let videoEl = wrapperEl.querySelector('video');
            let videoUrl = wrapperEl.dataset.videoId;

            for (let j = 0; j < videoFormats.length; j++) {

                let videoSourceType = videoUrl + '.' + videoFormats[j].type;
                let videoTag = '<source src="' + videoSourceType + '" type="video/' + videoFormats[j].type + '">';
                videoEl.innerHTML += videoTag;
                addClass(videoEl, 'has-video');
            }

            videoEl.addEventListener('loadeddata', function() {

                if ( videoEl.readyState >=3)  {


                    addClass(videoEl, 'video-ready');

                }


            });

        }
    },
    manageSliderClasses (elIndex) {


        let slideListElements = $('.mpp-slide-list li');

        slideListElements.forEach(function (el) {
            removeClass(el, 'is-current');
        });

        if(elIndex) {


            for( let i = 0; i < slideListElements.length; i ++) {

                let currentEl = slideListElements[i];
                if (i === elIndex) {
                    addClass(currentEl, 'is-current');
                }
            }
        } else {
            addClass(slideListElements[0], 'is-current');
        }

    },
    homeSquaresAnimation () {


        // probably only want to run this for larger screens
        let currSS = currScreenSize();

        if(currSS === 'ss' || currSS === 'ms') {
            return;
        }

        let bgB = $1('.mn-home-grad-bg.is-bg-b');
        let bgC = $1('.mn-home-grad-bg.is-bg-c');
        let bgD = $1('.mn-home-grad-bg.is-bg-d');
        let gradGridBg = $1('.mn-home-grad-grid-bg');
        let bodyEl = $1('.body');
        let siteNav = $1('.mn-site-nav');

        // tween is repeated infinitely here
        const homeSqTl = gsap.timeline({repeat: -1});


        let opacityDuration = gsap.utils.random(1.0, 6.0);
        let staggerStart =   gsap.utils.random(-2, 1.5);


        // gsap timeline to cycle through the background on a random basis
        // start of each tween is also randomised in places to give the overall animation an organic feel


        homeSqTl.to(bgB, {duration: opacityDuration, opacity: 1}, staggerStart);
        homeSqTl.to(bgB, {duration: 1.2, opacity: 0});
        homeSqTl.to(bgC, {duration: 1.0, opacity: 0.5});
        homeSqTl.to(gradGridBg, {duration: 4.0, opacity: 0});
        homeSqTl.to(bgC, {duration: 0.65, opacity: 0});
        homeSqTl.to(bgD, {duration: opacityDuration, opacity: 0.5},staggerStart);
        homeSqTl.to(gradGridBg, {duration: 3.0, opacity: 1});
        homeSqTl.to(bgD, {duration: 1.2, opacity: 0});


        // only really want this animation underway when a visitor is at the top of the page
        // so some functionality to control the play pause, based on the offset of the window, and debounced for performance
        function pauseTl () {
            homeSqTl.pause();
        }

        function resumeTl () {
            homeSqTl.play();
        }


        window.onscroll = function () {
           toggleAnimation();
        };


        // resetting the position here for the triggers in case they shift across screen sizes
        let toggleAnimation = debounce(function() {

            if (window.pageYOffset < 200) {
                resumeTl();
            } else {
                pauseTl();

            }

        }, 300);

        // adding a mutationObserver here for the navigation and the video to take the
        //strain off the gpu / cpu

        if ("MutationObserver" in window) {

            const navMutationObserver = new MutationObserver(animStateToggle);

            navMutationObserver.observe(
                siteNav,
                {attributes: true}
            );

            function animStateToggle(mutationsList) {
                mutationsList.forEach(mutation => {
                    if (mutation.attributeName === 'class') {
                        if (hasClass(siteNav, 'is-active')) {
                            pauseTl();
                        } else {
                            resumeTl();
                        }
                    }
                })
            }
        }

    },
    projectGridActions () {
        const pGridItems = $('.mn-project-grid-item-content');

        console.log('ps =' + pGridItems);

        for(let i =0; i < pGridItems.length; i ++) {
            let el = pGridItems[i];

            el.addEventListener('mouseenter', (e) =>{

                for(let j = 0; j < pGridItems.length; j ++) {

                    let el = pGridItems[j];
                    let elParent = el.parentNode;

                   if(el !== e.currentTarget) {
                       addClass(elParent, 'items-active')
                   } else {

                        addClass(elParent, 'is-current-grid-item');
                    }
               }
             });

            el.addEventListener('mouseleave', () =>{

                for(let j = 0; j < pGridItems.length; j ++) {

                    let el = pGridItems[j];
                    let elParent = el.parentNode;

                    removeClass(elParent, 'items-active');
                    removeClass(elParent, 'is-current-grid-item');
                }
            })

        }

    },
    projectCaseStudyControl() {
        const csTriggers = $('.mn-project-grid-item-trigger');
        const csWrapper = $1('.mn-project-grid-item-cs-wrap');
;
        for(let i = 0; i< csTriggers.length; i ++) {

            let el = csTriggers[i];

            el.addEventListener('click', (e) => {

                e.preventDefault();
                addClass(csWrapper, 'is-active');
                addClass(el, 'is-active');
                addClass(el.parentNode, 'is-active');

;               this.loadProjectPartial(el);
            });

        }

    },
    csWrapperAnimation (direction) {

        let csWrapper = $1('.mn-project-grid-item-cs-wrap');
        const wrapperTl = gsap.timeline();

        const projectContainer = $1('.mn-project-grid-item-cs-wrap-inner');
        const docEl = document.documentElement;
        const projectCloseBtn = $1('.mn-projects-summary-detail-close');
        const projectItems = $('.mn-project-grid-item');

        const csTriggers = $('.mn-project-grid-item-trigger');

        const _self = this;


        if(direction === 'go') {

            wrapperTl.to(csWrapper, {duration: 0.3, height: '100vh', ease: 'circ.inOut'});

            if (!m9Vars.isSmallScreen) {

                wrapperTl.to(projectItems, {
                    duration: 0.1, stagger: { // wrap advanced options in an object
                        each: 0.1,
                        from: "center",
                    }, opacity: 0, top: '250px', ease: 'circ.inOut'
                });
            }
            wrapperTl.to(csWrapper, {duration: 0.2, opacity: 1.0, ease: 'circ.inOut'},'<1');
            wrapperTl.to(projectContainer, {duration: 0.6, top: 0, opacity: 1, ease: "circ.inOut(0.5)", onComplete: function () {
                    addClass(docEl, 'is-projects-active');
                    _self.projectDetailControl();

                    csWrapper.setAttribute('aria-expanded', 'true');

                }},'<');
            wrapperTl.to(projectCloseBtn, {duration: 0.6, opacity: 0.8, ease: "circ.inOut(0.5)"});

        } else {

            wrapperTl.to(projectCloseBtn, {duration: 0.6, opacity: 0, ease: "circ.inOut(0.5)"});
            wrapperTl.to(projectContainer, {duration: 0.7, top: '20rem', opacity: 0, ease: "circ.inOut(0.5)"});
            wrapperTl.to(csWrapper, {duration: 0.5, opacity: 0, ease: 'circ.in', onComplete: function () {

                    for(let i = 0; i< csTriggers.length; i ++) {

                        let el = csTriggers[i];

                        removeClass(el, 'is-active');
                        removeClass(el.parentNode, 'is-active');
                    }
                    removeClass(csWrapper, 'is-active');
                    removeClass(docEl, 'is-projects-active');

                    csWrapper.setAttribute('aria-expanded', 'false');

            }});

            if (!m9Vars.isSmallScreen) {

                wrapperTl.to(projectItems, {
                    duration: 0.3, stagger: { // wrap advanced options in an object
                        each: 0.15,
                        from: "end",
                    }, opacity: 1, top: 0, ease: 'expo.out'
                });
            }
            wrapperTl.to(csWrapper, {duration: 0.1, height: 0, ease: 'circ.in', onComplete : function () {
                    projectContainer.innerHTML = '';
            }});

        }

    },
    loadProjectPartial(el) {


        let contentToLoad = el.dataset.content;
        //let elParent = el.parentNode.parentNode;
        let projectContainer = $1('.mn-project-grid-item-cs-wrap-inner');

        const _self = this;

            partialLoader(projectContainer, contentToLoad)
                .then(function () {
                    _self.csWrapperAnimation('go');
                })
                .catch(function () {
                    // need to do something here with the error handler
                });
    },
    projectDetailControl() {

        const bttButtons = $('.mn-project-summary-btt');
        const detailWrapper = $1('.mn-project-grid-item-cs-wrap');
        const projectCloseBtn = $1('.mn-projects-summary-detail-close');

        // back to top button for each wrapper

        bttButtons.forEach((el) => {

            el.addEventListener('click', () => {

                gsap.to(detailWrapper, {duration: 1.3, scrollTo: {y: 0, autoKill: false}, ease: "circ.inOut",});

            });
        });

        projectCloseBtn.addEventListener('click', () => {

            this.csWrapperAnimation();

        });

    },
    resizeActions () {

        const docEl = document.documentElement;

        function determineScreenSize () {
            let screenSizeTest = currScreenSize();


            m9Vars.isSmallScreen = m9Vars.smallScreenCategories.includes(screenSizeTest);

            if (m9Vars.isSmallScreen) {
                addClass(docEl, 'is-small-screen');

            } else {
                removeClass(docEl, 'is-small-screen');
                // this may have to be forced as scrollMagic controller update is not great at picking up these changes

            }
        }

        determineScreenSize();

        const assessScreenSize = debounce( () => {
            determineScreenSize();

        }, 500);

        // check for large screen & reload if needed
        window.addEventListener('resize', assessScreenSize );

    },
    setUpCarousel () {


        function initCarousel () {

            if(m9Vars.isSmallScreen) {

                //console.log('setup carousel');

                m9Vars.flkty = new Flickity('.carousel', m9Vars.flickityOpts);

            } else {

                if(m9Vars.flkty) {
                    m9Vars.flkty.destroy();
                }

            }

        }

        initCarousel();

        const resetCarousel = debounce( () => {
            initCarousel();

        }, 500);


        window.addEventListener('resize', resetCarousel );

    }

};


window.addEventListener('DOMContentLoaded', () => {

    gsap.registerPlugin(ScrollToPlugin);
    gsap.registerPlugin(CSSRulePlugin);

    // dom is loaded!
    mNineDScript.start.init();


});


window.addEventListener('load', () => {

    mNineDScript.start.triggerVideos();
    mNineDScript.start.homeSquaresAnimation();
    mNineDScript.start.setUpCarousel();

});