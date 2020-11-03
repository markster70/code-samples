// load workbox
importScripts('/dist/js/workbox-sw.js');
importScripts('/dist/js/siteCacheValues.js');


// // output successful message
if (workbox) {
    console.info('Yay! Workbox is loaded 🎉');
} else {
    console.info('Boo! Workbox didn\'t load 😬');

}

let prefix = EXAMPlE_SITE_CACHE_OBJECT.precachePrefix;
let suffix = EXAMPlE_SITE_CACHE_OBJECT.precacheSuffix;


// if you want to see workbox in action through the console, uncomment this line - as you navigate around the app
// you will see the library serving the assets

//workbox.setConfig({ debug: true })

workbox.core.setCacheNameDetails({
    prefix: prefix,
    /// this suffix should be changed to force a service worker update
    // or when the sw is generated, if the file manifest has changed, that should also do
    suffix: suffix,
    precache: 'precache',
    runtime: 'runtime',
});

workbox.core.skipWaiting();

workbox.core.clientsClaim();

workbox.precaching.cleanupOutdatedCaches();

workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);


// Serve all html files with StaleWhileRevalidate strategy
workbox.routing.registerRoute(
    /\.html$/,
    new workbox.strategies.StaleWhileRevalidate({
        cacheName: 'sw-example-html-cache',
        plugins: [
            new workbox.expiration.ExpirationPlugin({
                maxEntries: 30,
                maxAgeSeconds: 60 * 60,
            }),
            new workbox.broadcastUpdate.BroadcastUpdatePlugin({
                channelName: 'html-updates',
            }),
        ],
    }),
);


// Serve all js files with StaleWhileRevalidate strategy
workbox.routing.registerRoute(
    /\.js$/,
    new workbox.strategies.StaleWhileRevalidate({
        cacheName: 'sw-example-js-cache',
        plugins: [
            new workbox.expiration.ExpirationPlugin({
                maxEntries: 10,
                maxAgeSeconds: 24 * 60 * 60,
            }),
            new workbox.broadcastUpdate.BroadcastUpdatePlugin({
                channelName: 'sw-example-js-updates',
            }),
        ],
    }),
);

// Serve all css files with StaleWhileRevalidate strategy
workbox.routing.registerRoute(
    /\.css$/,
    new workbox.strategies.StaleWhileRevalidate({
        cacheName: 'sw-example-css-cache',
        plugins: [
            new workbox.expiration.ExpirationPlugin({
                maxEntries: 10,
                maxAgeSeconds: 24 * 60 * 60,
            }),
            new workbox.broadcastUpdate.BroadcastUpdatePlugin({
                channelName: 'sw-example-css-updates',
            }),
        ],
    }),
);

// Serve all other assets with CacheFirst strategy
workbox.routing.registerRoute(
    /\.(?:png|jpg|jpeg|svg|gif|webp|ico|webmanifest|eot,ttf,woff,woff2)$/,
    new workbox.strategies.CacheFirst({
        cacheName: 'sw-example-asset-cache',
        plugins: [
            new workbox.expiration.ExpirationPlugin({
                maxEntries: 250,
                maxAgeSeconds: 30 * 24 * 60 * 60,
            }),
            new workbox.broadcastUpdate.BroadcastUpdatePlugin({
                channelName: 'sw-example-asset-updates',
            }),
        ],
    }),
);

// Cache the Google Fonts stylesheets with a stale-while-revalidate strategy.

workbox.routing.registerRoute(
    ({url}) => url.origin === 'https://fonts.googleapis.com',
    new workbox.strategies.StaleWhileRevalidate({
        cacheName: 'google-fonts-stylesheets',
    })
);

// Cache the underlying font files with a cache-first strategy for 1 year.
workbox.routing.registerRoute(
    ({url}) => url.origin === 'https://fonts.gstatic.com',
    new workbox.strategies.CacheFirst({
        cacheName: 'google-fonts-webfonts',
        plugins: [
            new workbox.cacheableResponse.CacheableResponsePlugin({
                statuses: [0, 200],
            }),
            new workbox.expiration.ExpirationPlugin({
                maxAgeSeconds: 60 * 60 * 24 * 365,
                maxEntries: 30,
            }),
        ],
    })
);

