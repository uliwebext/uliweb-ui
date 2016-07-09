# Uliweb UI

## What's it

uliweb-ui is used to collection ui components, such as css and js.

## Compile utils and tags

First install node.js, npm，then install gulp and dependencies:

```
npm install gulp
npm install gulp gulp-riot gulp-minify-css gulp-jshint gulp-uglify gulp-concat gulp-rename gulp-notify del riot uglify-js error jshint
```

Run:

```
gulp default
```

to compile `uliweb-ui.css` and `uliweb-ui.js` to `uliweb_ui/static/modules`, also
compile tags to `uliweb_ui/static/modules/tags`
