const swExample = {};


const swEXVars = {
    smallScreenCategories : ['ss', 'ms'],
    largeScreenCategories : ['ls', 'xl', 'xxl', 'massive'],
    isSmallScreen: false,
    flickityOpts : { "wrapAround": true }
};


swExample.start = {

    init () {

        this.setUpGallery();
    },
    setUpGallery () {


    }
};


window.addEventListener('DOMContentLoaded', () => {

    // dom is loaded!
    swExample.start.init();


});
