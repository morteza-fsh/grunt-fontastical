# grunt-fontastical

> Download, fetch and parse icon fonts to json from Fontastic.me.

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-fontastical --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-fontastical');
```

## The "fontastic" task

### Overview
In your project's Gruntfile, add a section named `fontastical` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
    fontastical: {
        fontasticIcons: {
            options: {
                fontKey : '[Font/User id here]', // Font id
                fontsDir: 'output', // Export fonts destination
                scssDir : 'output', // Export SASS destination
                jsonDir : 'output'  // Export JSON destination
            }
        }
    },
});
```

### Options
Soon!

## Release History
_(Nothing yet)_
