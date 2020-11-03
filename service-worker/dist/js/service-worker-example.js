var swExample = {};
var swEXVars = {
  smallScreenCategories: ['ss', 'ms'],
  largeScreenCategories: ['ls', 'xl', 'xxl', 'massive'],
  isSmallScreen: false,
  flickityOpts: {
    "wrapAround": true
  }
};
swExample.start = {
  init: function init() {
    this.setUpGallery();
  },
  setUpGallery: function setUpGallery() {}
};
window.addEventListener('DOMContentLoaded', function () {
  // dom is loaded!
  swExample.start.init();
});