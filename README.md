# Uliweb UI

## What's it

uliweb-ui is used to collection ui components, such as css and js.

## Compile utils and tags

First install node.js, npm，then install gulp and dependencies:

```
npm install gulp
npm install gulp gulp-riot gulp-clean-css gulp-jshint gulp-uglify gulp-concat gulp-rename gulp-notify del riot uglify-js error jshint
```

Run:

```
gulp default
```

to compile `uliweb-ui.css` and `uliweb-ui.js` to `uliweb_ui/static/modules`, also
compile tags to `uliweb_ui/static/modules/tags`

## make jsmodules.js

`jsmodules.js` is used to combine js modules defined in `settings.ini` into a javascript
file, so that `head.load` can load them via `load(["module1", "module2"], function(){})`.
You can get it through command line `uliweb jsmodule -a uliweb_ui` to recreate it and save
it to `uliweb_ui/static/jsmodules.js`. Because uliweb_ui is just an app, but not an application,
so you should run `jsmodule` command in a project directory, so you can make a simple
project, and just add `uliweb_ui` to `INSTALLED_APPS`, and run the command.

Uliweb_ui is already create `jsmodule.js` for you. But if you want to add more ui components
to settings.ini, and also want to use `load` to process them, you should recreate `jsmodules.js`
yourself.

## Concat plugins
Step.1 Write some configuration in 'settings.ini' of your uliweb project. like that:

```
[TEMPLATE_GULP]
you_want_name = [ "plugin name", ... ]
```

Step.2 Enter a command in CLI of your uliweb project

```
uliweb gulpplugins -d app_name
```

Then you will find some files in the folder(you_want_name.js && you_want_name.css)

```
.../your_project/apps/app_name/static/
```

Step.3 In the template file, use plugin with command "{{use 'plugin name'}}" , you_want_name.js and you_want_name.css will loaded
