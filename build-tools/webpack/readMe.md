### Bespoke Webpack Config for Vue JS app

This is a custom webpack config for creating a Vue js application 
that sits within a larger server based site architecture

For the purposes of this I've used an .ejs compiler as a method for
rendering HTML partials client side - could also be done with an Express app,
or any other server instance with some config tweaking and middleware etc

Any html and Vue Templates are watched and compiled, assets are copied to 'dist on build

Also has hot reloading, and scss compilation, as well as transpiling ES6 via babel

Built this as the standard Vue CLI spin up is too driven towards a 
complete SPA scenario, but there are often instances where a small sub-section of 
the DOM might be the Vue app - this works nicely for that.