const eitbp = {};

// NOTE - vars need to be required here as referenced / manipulated throughout
const { eitbVars } = require('./appVars');

// any imports here
import homeIntroControl from './modules/homeIntroControl.js';
import introControl from './modules/introControl.js';
import tacklingChallengesControl from './modules/tacklingChallengesControl.js';
import eitHealthRoleControl from './modules/eitHealthsRoleControl.js';
import in2020Control from './modules/in2020Control.js';
import sixFocusAreasControl from './modules/sixFocusAreasControl.js';
import digitalTransformationControl from './modules/digitalTransformationControl.js';
import tacklingCancerControl from './modules/tacklingCancerControl.js';
import fightCovidControl from './modules/fightCovidControl.js';
import globalImpactControl from './modules/globalImpactControl.js';
import inNumbersControl from './modules/inNumbersControl.js';
import footerControl from './modules/_footerControl.js';


eitbp.start = {

    'config': {
        // can be used for any config options that might be required
        // // i'm setting what i see as 'fixed' parameters here for things like
        // scroll animation duration and easing properties
        navAnimationSpeed : 0.4,
        navEasing: 'circ.inOut',
        navActiveClass : 'is-nav-active',
        navMoveToText : 'Move To',
        sectionScrollSpeed: 1.85,
        currentNavClass : 'is-current-section',
        navSectionCurrentText : 'Current',
        homeSvgFillColour: 'rgb(255,255,255)',
        introductionShapeColours : {
            slideAColour:   'rgb(62,255,136)',
            slideBColour :  'rgb(2,121,255)',
            slideCColour :  'rgb(255,51,208)',
            slideDColour :  'rgb(158,46,255)',
            slideEColour :  'rgb(255,255,255)',
            slideFColour :  'rgb(205,205,205)',
            slideGColour :  'rgb(78,255,235)'
        },
        eit2020ShapeColour: 'rgb(255,255,255)',
        siteScrollSensitivity: 500,
        contentScrollDuration: 0.65,
        contentScrollEase : 'circ.out',
        lightElsClassName : 'is-light-els',
        focusAreasSlideDelay : 0.9
    },
    init(settings) {
        // loop through any settings passed in, and overwrite the default config with those settings
        if (settings && typeof (settings) === 'object') {
            for (let prop in settings) {
                if (settings.hasOwnProperty(prop)) {
                    this.config[prop] = settings[prop];
                }
            }
        }

       // this starts the process, calling the various functions required as the dom is ready to go

        this.resizeEvents();
        this.setSectionSizes();
        this.lazyLoadImg();
        this.sectionHeroIconOffsets();
        this.canHover();
        this.sectionNextPrevScroll();
        this.runNavigation();
        this.navItemActions();
        this.activeSectionIdentification('section-homepage');

    },
    resizeEvents () {

        const docEl = document.documentElement;
        
        const _self = this;

        eitbVars.currentWindowHeight = window.innerHeight;

        function determineScreenSize () {
            let screenSizeTest = currScreenSize();


            eitbVars.isSmallScreen = eitbVars.smallScreenCategories.includes(screenSizeTest);

            if(eitbVars.isSmallScreen) {
                addClass(docEl, 'is-small-screen');
            } else {
                removeClass(docEl, 'is-small-screen');
                // this may have to be forced as scrollMagic controller update is not great at picking up these changes
            }

        }

        // this is called on first pass to initially set screen size
        determineScreenSize();

        // function to initialise any resizing events that may need to take place
        // most likely these will be used with debouncing to prevent any event thrashing taking place

        // the section sizes need to be set on resize, so that the pseudo scroll works properly
        // trigger after a the final resize has taken place by user
        const resetSectionSizes = debounce( () => {
            this.setSectionSizes();
            determineScreenSize();
            this.sectionHeroIconOffsets();

            eitbVars.currentWindowHeight = window.innerHeight;

            //eitbVars.scrollController.update();
            removeClass(docEl, 'is-resizing');


        }, 200);

        const reloadLargeScreen = debounce( () => {

            if(eitbVars.isSmallScreen) {
                return;
            } else {

                location.reload();
            }
        }, 700);

        // reloading window on orientation change here to cater for
        // possible ipad scenarion of landscape back ot portrait
        window.addEventListener('orientationchange', function () {
            location.reload();
        });


        window.addEventListener('resize', function () {
            addClass(docEl, 'is-resizing');
        });

        // fire the resetSectionSizes on window resize
       // window.addEventListener('resize', resetSectionSizes);

        // check for large screen & reload if needed
        window.addEventListener('resize', reloadLargeScreen);

    },
    lazyLoadImg() {
        const imgObserver = lozad();
        imgObserver.observe();
    },
    setSectionSizes() {


        // helper function to set the sizes of each function
        const sectionWrapper = $1('#js-section-container');
        const sections = $all('.eit-section');
        let smallScreen = false;

        // test for small screen here - we need the style properties to be cleared from the dom elements
        // and set the smallScreen bool to true, so that the heights / transforms are only applied where required for the desired pseudo scroll behaviour

        if (eitbVars.isSmallScreen) {
            smallScreen = true;
            sectionWrapper.style = '';

            for (let i = 0; i < sections.length; i++) {
                sections[i].style = '';
            }

        }

        eitbVars.sectionOffsets = [];

        let ih = window.innerHeight;
        if(!smallScreen) {
            gsap.set(sectionWrapper, {height: sections.length * ih});
            gsap.set(sections, {height: ih,});
        }

        for (let i = 0; i < sections.length; i++) {
            let sectionOffset = -sections[i].offsetTop;
            sections[i].dataset.offset = sectionOffset;
            sections[i].dataset.sectionIndex = i;
            eitbVars.sectionOffsets.push(sectionOffset);
        }
        if(!smallScreen) {
            gsap.set(sectionWrapper, {y: eitbVars.sectionOffsets[eitbVars.activeSection]});
        }


    },
    sectionNextPrevScroll () {

        // function used to control user scrolling via mouse / tracxkpad etc
        // and navigating via global nav arrows
        // not used for the primary navigation

        // dom els and vars required for function
        const sectionWrapper = $1('#js-section-container');
        const sections = $all('.eit-section');
        const _self = this;
        const cfg = this.config;
        const scrollNextBtn = $1('.eit-navigation-arrow-next');
        const scrollPrevBtn = $1('.eit-navigation-arrow-prev');

        // ref to scrollComplete function for gsap
        const scrollComplete = this.slideScrollComplete;


        // ensure we have support for the max wheel events in required browserscape
        let wheelEvt = "onwheel" in document.createElement("div") ? "wheel" : //     Modern browsers support "wheel"
            document.onmousewheel !== undefined ? "mousewheel" : // Webkit and IE support at least "mousewheel"
                "DOMMouseScroll"; // let's assume that remaining browsers are older Firefox

        // function to control the slideToEachSection based on scroll movement
        function slideSection (e, isBtnEvent = false, scrollDirection = 'next') {

            addClass(document.documentElement, 'is-scrolling');

            if(eitbVars.activeSection > sections.length - 1) {
                scrollComplete();
                return;
            }

            if (eitbVars.isAnimating) {
                return;
            }

            eitbVars.isAnimating = true;

            eitbVars.previousSection = eitbVars.activeSection;

            if(isBtnEvent) {

                if(scrollDirection === 'next') {

                    eitbVars.activeSection += 1;
                } else if(scrollDirection === 'prev') {

                    eitbVars.activeSection -= 1;
                }

            } else {

                eitbVars.activeSection = e.deltaY > 0 ? (eitbVars.activeSection += 1) : (eitbVars.activeSection -= 1);
            }

            // make sure we're not past the end or beginning slide
            eitbVars.activeSection = eitbVars.activeSection < 0 ? 0 : eitbVars.activeSection;
            eitbVars.activeSection = eitbVars.activeSection > sections.length - 1 ? sections.length - 1 : eitbVars.activeSection;

            if (eitbVars.previousSection === eitbVars.activeSection) {
                _self.clearAnimationVar();
                return;
            }

            // probably need to check on the easing preferences here a bit, and duration
            gsap.to(sectionWrapper, cfg.sectionScrollSpeed, { y: eitbVars.sectionOffsets[eitbVars.activeSection], ease:"expo.inOut", onComplete: scrollComplete, callbackScope : _self});
        }


        // event listener for scrolling an mousewheel events
        window.addEventListener(wheelEvt, (evt) => {

            if (eitbVars.isSmallScreen) {
                _self.slideScrollComplete();
            } else {
                slideSection(evt);
            }

        });

        scrollPrevBtn.addEventListener('click', (e) => {
            slideSection(e, true, 'prev');
        })

        scrollNextBtn.addEventListener('click', (e) => {
            slideSection(e, true, );
        })



    },
    clearAnimationVar () {
        // using a timeout here so that the scroll pane doesnt scroll multiple sections at a time
        // while still allowing a user to scroll reasonably fluidly if they so wish
        setTimeout(() => {
            eitbVars.isAnimating = false;

        }, this.config.siteScrollSensitivity);
    },
    canHover () {
        // if we have proper hover
        eitbVars.canHover = window.matchMedia('(hover: hover)').matches;

    },
    slideScrollComplete () {

        let sections = $all('.eit-section');
        let activeSection = eitbVars.activeSection;
        let newActiveSectionId;
        let parentSection;

        // clear the animation variable
        this.clearAnimationVar();


        for (let i = 0; i < sections.length; i++) {
            let currentSection = sections[i];
            if(i === parseInt(activeSection,10)) {
                newActiveSectionId = currentSection.getAttribute('id');
                parentSection = currentSection.dataset.sectionTitle;
            }
        }

        // call the function to set the active section class
        this.activeSectionIdentification(newActiveSectionId);

        this.setActiveNav(parentSection);

        removeClass(document.documentElement, 'is-scrolling');

    },
    setActiveNav(sectionId) {

        // function is called upon scroll end to set the navigation item to the currently active section

        const cfg = this.config;
        let navItems = $all('.eitb-primary-nav-item');
        const navStatusEl = '.eitb-primary-nav-item-status';

        let sectionIdStrip = null;

        if(sectionId) {
            sectionIdStrip = sectionId.replace("-", " ");
        }

        for(let i = 0; i < navItems.length; i ++) {
            let el = navItems[i];

            let sectionIdent = el.dataset.section;
            let statusEl = $1(navStatusEl, el);

            if(sectionIdent.includes(sectionIdStrip)) {
                addClass(el, cfg.currentNavClass);
                statusEl.innerText = cfg.navSectionCurrentText;
            } else {
                removeClass(el, cfg.currentNavClass);
                statusEl.innerText = '';
            }
        }


    },
    runNavigation () {
        const cfg = this.config;
        const bodyEl = $1('body');
        const primaryNavTrigger = $1('.hamburger');
        const primaryNavWrapper = $1('.eitb-primary-nav');
        const navTl = gsap.timeline({paused: true});
        const navItems = $all('.eitb-primary-nav-item');
        const navLast = $1('.is-nav-last');

        // this behaviour for the navigation trigger is based on hover
        // for touch devices, hover is not a reliable state due to the tap once type implementation
        // so, a check is made in the canHover function based on match media
        // if the device has proper hover, we can add these event listeners
        // if not, will skip this behaviour to keep the UX good for a user
        if(eitbVars.canHover) {

            primaryNavTrigger.onmouseenter = () => {
                if (!hasClass(primaryNavWrapper, cfg.navActiveClass)) {
                    gsap.to(primaryNavWrapper, {x: '95%', duration: cfg.navAnimationSpeed, ease: cfg.navEasing});
                }

            };

            primaryNavTrigger.onmouseleave = () => {
                if (!hasClass(primaryNavWrapper, cfg.navActiveClass)) {
                    gsap.to(primaryNavWrapper, {x: '100%', duration: cfg.navAnimationSpeed, ease: cfg.navEasing});
                }
            };
        }

       primaryNavTrigger.addEventListener('click', () => {
           togglePrimaryNavigation();

       });


       function addActiveNav () {
           addClass(primaryNavWrapper,cfg.navActiveClass);
            primaryNavWrapper.setAttribute('aria-expanded', 'true');
            addClass(primaryNavTrigger, cfg.navActiveClass);
       }

        function removeActiveNav () {
            removeClass(primaryNavWrapper, cfg.navActiveClass);
            primaryNavWrapper.setAttribute('aria-expanded', 'false');
            removeClass(primaryNavTrigger,cfg.navActiveClass);
        }

        // function here controls the navigation visibility and animation
        // we check if the nav is open, and also if the nav is animating
        // the timeline events are then triggered accordingly, ads well as triggering the menu button state, and accessibility features
        // have added the ability to close nav with escape key for accessiblity's sake
        // for this purpose, a 'close' boolean arg can be passed
        function togglePrimaryNavigation (close = false) {

           // if nav is already open
           if (hasClass(primaryNavWrapper, cfg.navActiveClass) || close) {

               // and if the nav is not Animating already
               if (!navTl.isActive()) {
                   navTl.to(navItems, {left: '-100px', opacity: 0, duration: 0.15, ease: cfg.navEasing});
                   navTl.to(primaryNavWrapper, {x: '100%', duration: cfg.navAnimationSpeed , ease: cfg.navEasing});
                   navTl.to(primaryNavWrapper, {opacity: 0.5, duration: 0.3 , ease: cfg.navEasing});
                   removeActiveNav();

               }
           } else {
               // if the nav is closed
               // and if the nav is not Animating already
               if (!navTl.isActive()) {

                   addActiveNav();
                   navTl.to(primaryNavWrapper, {x: '0%', duration: cfg.navAnimationSpeed , ease: cfg.navEasing});
                   navTl.to(primaryNavWrapper, {opacity: 1, duration: 0.3 , ease: cfg.navEasing});
                   navTl.to(navItems, {left: 0, opacity: 1, duration: 0.25, stagger: 0.10, ease: cfg.navEasing}, ">-0.4");
                   navTl.play();
               }
           }
       }

       //dealing with the click events for navigation items here
       const navItemLinks = $all('.eitb-primary-nav-item a');

       function currentNavClasses (clickedParentEl) {
         for(let i =0; i < navItemLinks.length; i ++) {

             let el = navItemLinks[i];
             let elParent = el.parentNode;
             let currentSpan = el.firstElementChild;

             removeClass(elParent,cfg.currentNavClass);
             currentSpan.innerText = '';
           }

         addClass(clickedParentEl, cfg.currentNavClass);

       }


       // for each nav item
       for(let i = 0; i < navItemLinks.length; i ++) {
            let el = navItemLinks[i];

            // set up the event listener
            el.addEventListener('click', (e) => {

                let navParent = el.parentNode;

                currentNavClasses(navParent);

                e.preventDefault();
                // get the href which will be the scroll target
                let scrolltarget = el.getAttribute('href');
                // deal with the navigation
                togglePrimaryNavigation();


                // and scroll to the appropriate section
                this.slideToSection(scrolltarget);

            });

        }

       // here am listening for clicks outside of primary nav
        // if that happens, close the navigation
        document.addEventListener('click',  (e) => {

            // If the click happened inside the the container, bail
            if (e.target.closest('.eitb-primary-nav') || e.target.closest('.eitb-nav-trigger') ){
                // do nothing
            } else {
                togglePrimaryNavigation(true);
            }

        }, false);

       // escape key to be able to shut window

        window.addEventListener('keyup', (e) =>{
            if(e.key === 'Escape' || e.which === 27) {
                togglePrimaryNavigation(true);
            }
        });


        // accessibility trap to provide circular tabbing for menu via keyboard when open
        function accessTrap () {

            navLast.addEventListener('blur', function(e) {
                if(hasClass(primaryNavWrapper, cfg.navActiveClass)){
                    primaryNavTrigger.focus();
                }
            });
        }

        // access trap function called
        accessTrap();

    },
    backToHome () {

        let homeTrigger = $1('.eit-home-trigger');

        homeTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            let scrolltarget = e.currentTarget.getAttribute('href');

            this.slideToSection(scrolltarget);
        });

    },
    slideToSection (scrollTarget) {


        // function used by primary navigation
        // to scroll to the correct section in the application based upon click event

        // scrollTarget is passed to function based on the href of the anchor being clicked
        // may also use a data attr for this

        // the required scroll position is then taken from the data-offset value of the section
        // added by setSectionSizes upon init and resize
        // we then use gsap to animate the scroll container to the required place, and call
        // the function to update the active section, and class on the body accordingly

        const cfg = this.config;


        eitbVars.previousSection = eitbVars.activeSection;

        let scrollPosition = parseInt($1(scrollTarget).dataset.offset, 10);
        let scrollTargetSectionIndex = parseInt($1(scrollTarget).dataset.sectionIndex, 10);

        let sectionWrapper = $1('#js-section-container');

        // ref to function in wider object literal
        const activeSectionIdentification = this.activeSectionIdentification;



        function updateActiveSection () {

            eitbVars.activeSection = scrollTargetSectionIndex;
            activeSectionIdentification(scrollTarget);

        }

        // the navigation and scrolling are assuming completely different behaviours for small and large screen
        // small screen is a native scroll while large screen is a scroll hijack to slide to the next window
        // as this function is called, the screen size is assessed, and if we are in the small screen categories
        // the sectionWrapper needs to be the window, and the scrollTo plugin is used to scroll the window
        // we then return out of the function prior to the large screen scroll action taking place.
        if(eitbVars.isSmallScreen) {
            scrollPosition = $1(scrollTarget).offsetTop;

            sectionWrapper = window;

            gsap.to(window, {duration: cfg.sectionScrollSpeed, scrollTo: {y: scrollTarget, autoKill: false}, ease: "expo.inOut", onComplete : updateActiveSection});

            return;

        }

        gsap.to(sectionWrapper, cfg.sectionScrollSpeed, { y: scrollPosition, ease:"expo.inOut", onComplete : updateActiveSection});

    },
    // note the function scope here -
    // gsaps default callback scope is the tween object, so as this function is called
    // as a callback for the section scroll, the scope needs to be passed on occasions
    activeSectionIdentification(sectionId, functionScope=this) {

        // for each section, we need a class added to body for the menu variations etc
        // sectionId is the id in the dom derived from the active section within the application and passed into this function
        //  the body class is first cleared, and then the correct section class is added
        const bodyWrap = $1('body');
        const siteLocationVal = $1('.eit-site-location-indicator-val');
        let strippedSectionId = sectionId.replace(/^#/, '');

        let classToAdd = strippedSectionId + '-is-active';
        bodyWrap.className = '';

        addClass(bodyWrap, classToAdd);

        // we also need to inject the current section into the site location indicator in bottom right hand corner of the site
        // to achieve this, a data attribute is added to the main sections like this : data-section-title="Introduction"
        // if that value exists, we will use it to populate the site location indicator for the user

        const currentSection = $1(`#${strippedSectionId}`);
        let currentSectionTitle = currentSection.dataset.sectionTitle;
        let leftPositionLocation = '100px';
        let opacityLocation = 0;

        // if there's a section title, we need to check if it matches the previous one, if not, make a change
        if(currentSectionTitle) {

            if(currentSectionTitle ===  siteLocationVal.innerText) {
                leftPositionLocation = 0;
                opacityLocation = 1;
            }

                gsap.to(siteLocationVal, 0.5, {
                    opacity: opacityLocation, left: leftPositionLocation, ease: "expo.inOut", onComplete: function () {
                        siteLocationVal.innerText = currentSectionTitle;
                        gsap.to(siteLocationVal, 0.3, {opacity: 1.0, left: 0, ease: "expo.inOut"});
                    }
                });

        } else {
            // if there is no section title ( which happens at home section - we want to move the location indicator text across to avoid double animation
            gsap.to(siteLocationVal, 0.5, { opacity: 0, left: '100px'});
        }

    },
    navItemActions () {
        // this function is used to set the text of the nav item being hovered
        const cfg = this.config;
        let navItems = $all('.eitb-primary-nav-item');
        const navStatusEl = '.eitb-primary-nav-item-status';

        for(let i = 0; i < navItems.length; i ++) {
         let el = navItems[i];

            const elItemStatus = $1(navStatusEl, el);

            el.onmouseenter = () => {

                elItemStatus.innerText = cfg.navMoveToText;
            };

            el.onmouseleave = () => {

                if(hasClass(el, cfg.currentNavClass)) {
                    elItemStatus.innerText = cfg.navSectionCurrentText;
                } else {
                    elItemStatus.innerText = ' ';
                }

            }

        }

    },
    svgHeroShapeMorph (shapeFrom, shapeTo, fillColour) {

        // utlity function for animating hero shape

        const morphTl = gsap.timeline();

        //morphTl.to(shapeFrom, {duration: 0.7, morphSVG: shapeTo});
        morphTl.to(shapeFrom, {duration: 1.5, fill: fillColour}, '0.3');

    },
    sectionHeroIconOffsets () {
        // utility function to add a data attribute to each of the svg hero icons, so that the value
        // can be used as for scroll position calcuation by the heroIconAnimation function;

        const heroIconWrapper = $1('.eit-svg-shape-icon-inner');
        let heroIcons = $all('img', heroIconWrapper);

        for(let i =0; i< heroIcons.length; i ++) {
            let currentIcon = heroIcons[i];

            if(i <1) {
                currentIcon.dataset.positionOffset = 0;
            } else {
                currentIcon.dataset.positionOffset = `-${elementOuterHeight(currentIcon) * i}`;
            }

        }
    },
    heroIconAnimation (iconTarget) {

        const iconTl = gsap.timeline({paused: true});

        if(!iconTarget) {
            return;
        }

        let topPosition = iconTarget.dataset.positionOffset;

        // get dom ref for scroll wrapper
        const iconScrollWrapper = $1('.eit-svg-shape-icon-inner');

        // need to do a little work on opacity animation here

        let prevIcon = iconTarget.previousElementSibling;
        let nextIcon = iconTarget.nextElementSibling;

        gsap.to(iconTarget, 0.5, { opacity: 1, ease:"expo.out"});

        // no we are good to scroll the icon wrapper to the make the correct icon visible
        //gsap.to(prevIcon, 0.5, { opacity: 0, delay: 0.3, ease:"expo.out"});
        iconTl.to(iconScrollWrapper, 1.0, { top: topPosition, ease:"expo.inOut"});

        //iconTl.to(nextIcon, 0.5, { opacity: 0, ease:"expo.out"},"-=0.5");

        iconTl.play();

    },
    addLightClassToDoc () {
        addClass(document.documentElement, 'is-light-els');
    },
    removeLightClassFromDoc () {

        removeClass(document.documentElement, 'is-light-els');
    },
    manageSvgShape (delay = '0.75') {
        //utility function to hide svg shape wrapper
        // if used various times so makes sense to keep in one place
        const svgShapeWrapper = $1('.eit-svg-shape-container');
        const svgTimeline = gsap.timeline();

        svgTimeline.to(svgShapeWrapper, 0.4, {autoAlpha: 0, delay: delay, ease: 'circ.out'});
    },
    // reference to module imports for calling on window load
    homeIntroControl,
    introControl,
    tacklingChallengesControl,
    eitHealthRoleControl,
    in2020Control,
    sixFocusAreasControl,
    digitalTransformationControl,
    tacklingCancerControl,
    fightCovidControl,
    globalImpactControl,
    inNumbersControl,
    footerControl

};


window.addEventListener('DOMContentLoaded', () => {

    // gsap plugins need to be registered before are called in the object literal
    gsap.registerPlugin(ScrollToPlugin);
    gsap.registerPlugin(MorphSVGPlugin);

    // dom is loaded!
    eitbp.start.init();


});


window.addEventListener('load', () => {

    // functionality here is called after all assets are completely loaded
    eitbp.start.homeIntroControl();
    eitbp.start.backToHome();
    eitbp.start.introControl();
    eitbp.start.tacklingChallengesControl();
    eitbp.start.eitHealthRoleControl();
    eitbp.start.in2020Control();
    eitbp.start.sixFocusAreasControl();
    eitbp.start.digitalTransformationControl();
    eitbp.start.tacklingCancerControl();
    eitbp.start.fightCovidControl();
    eitbp.start.globalImpactControl();
    eitbp.start.inNumbersControl();
    eitbp.start.footerControl();


});