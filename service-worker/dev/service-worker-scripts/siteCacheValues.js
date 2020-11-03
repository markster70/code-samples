// This objecr is purely for the purpose of naming service worker caches
// and retrieving them when the app is offline

// if you change the content in the views, or and of the css
// i'd recommend changing viewsCacheName, and precacheSuffix

// used by :

// registerServiceWorker.js
// serviceWorker.js
// main.js

const EXAMPlE_SITE_CACHE_OBJECT = {
    viewsCacheName : "sw-example-views-cache-v1.0",
    precachePrefix: "swExampleE",
    precacheSuffix: "1.01"
};
