/**
 * Grunt Fontastical
 * https://github.com/averta-ltd/grunt-fontastical
 *
 * Copyright © 2016 averta
 * Licensed under the MIT license.
 *
 */

'use strict';

module.exports = function( grunt ) {

    var request       = require( 'request' ),
        fontFilesRx   = /http.*\.\w{3,4}/g,
        fontFamilyRx  = /(font-family:)\s?"(.*)"/,
        iconsRx       = /(\.\w+-)(.*):before\s?{\n\s*content:\s*"(\\?.*)";/g,
        fonts         = [],
        fontName      = '',
        doneStacks    = 0;

    grunt.registerMultiTask( 'fontastical', 'Fetch and parse icon fonts to json from Fontastic.me', function() {

        var done = this.async(),
            startTime = Date.now(),
            options = this.options( {
                host: 'file.myfontastic.com',
                sassVar: 'icons-path'
            });

        /**
         * Check for done the task
         */
        var doneCheck = function() {
            if ( --doneStacks === 0 ) {
                grunt.log.writeln( 'Task completed in ' + Math.round( (Date.now() - startTime) / 100 ) / 10 + 's' );
                done();
            }
        };

        /**
         * Downloads file
         * @param  {String}     download uri
         * @param  {Function}   callback
         */
        var download = function ( uri, binary, callback ) {
            // the request header
            var requestData = {
                uri     : uri,
                gzip    : true,
                headers : {
                    'User-Agent' : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.97 Safari/537.36'
                }
            };

            if ( binary ) {
                requestData.encoding = 'binary';
            }

            // send the request
            request ( requestData, function ( error, response, content ) {
                if ( error ) {
                    grunt.log.writeln( 'Error while fetching file from ' + requestData.uri + error );
                } else if ( response && response.statusCode === 200 ) {
                    return callback( content );
                }
            });
        };

        /**
         * write the file in detestation
         * @param  {String} content
         * @param  {String} type
         * @param  {String} uri
         */
        var writeFile = function( content, type, uri ) {

            var path;

            switch( type ) {
                case 'font':
                    path = options.fontsDir + '/' + fontName + uri.slice( uri.lastIndexOf('.') );
                    break;
                case 'json':
                    path = options.jsonDir + '/' + fontName + '.json';
                    break;
                case 'scss':
                    path = options.scssDir + '/' + fontName + '.scss';
                    break;
            }

            grunt.file.write( path, content );
            doneCheck();
        };

        /**
         * Downloads icon fonts and renames them
         * @param  {String} fonts  the user id in fontastic
         */
        var downloadFonts = function( fonts ) {
            fonts.forEach( function( font ) {
                download( font, true, function( data ) {
                    writeFile( data, 'font', font );
                });
            });
        };

        /**
         * Generates the JSON file containing icons
         * @param  {String} data CSS file content
         */
        var generateJSON = function ( data ) {
            var icons = [],
                match;

            // json format
            /**
             *          [
             *              {
             *                  "name": icon name,
             *                  "classname": icon class name
             *                  "content": icon code,
             *              },
             *              ...
             *          ]
             *
             */

            while ( ( match = iconsRx.exec(data) ) !== null ) {
                if (match.index === iconsRx.lastIndex) {
                    iconsRx.lastIndex++;
                }

                // create name
                var name = match[2].replace( /-/g, ' ' );
                name = name.charAt(0).toUpperCase() + name.slice(1);

                icons.push( '{'+
                                '"name":"' + name + '",' +
                                '"classname":"' + match[1] + match[2] + '",' +
                                '"content":"' + match[3].replace( /\\/g, '\\\\' ).replace( /"/g, '\\\"' )  + '"' +
                            '}');
            }

            writeFile( '[' + icons.join(',\n') + ']', 'json' );
        };

        /**
         * converts the css to sass
         * @param  {String} cssContent
         */
        var cssToSass = function ( cssContent ) {
            cssContent = cssContent.replace( /http.*\./g, '#{$' + options.sassVar + '}/' + fontName + '.' );

            // replace svg id
            cssContent = cssContent.replace( /.svg#\d+/g, '.svg#' + fontName );

            writeFile( cssContent, 'scss' );
            doneCheck();
        };

        /* ------------------------------------------------------------------------------ */

        /**
         * Generates the font css URL
        */
        var getURI = ( function() {
            return 'https://' + options.host + '/' + options.fontKey + '/' + 'icons.css';
        })();

        // start
        download( getURI, false, function( fontData ) {

            // read the font family, this will be used for naming the font files.
            fontName = fontData.match( fontFamilyRx )[2];

            // read fonts
            fonts = fontData.match( fontFilesRx );

            // set done stack, 2 is for json and sass file.
            doneStacks = fonts.length + 2;

            // start downloading fonts
            downloadFonts( fonts.slice(1) );

            // generate the JSON file
            generateJSON( fontData );

            // convert the css file to sass
            cssToSass( fontData );

        });
        /* ------------------------------------------------------------------------------ */
    });
};
