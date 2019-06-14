"use strict";

// userhome
// Copyright (c) 2014 Kyle Robinson Young
// Licensed under the MIT license.
// https://github.com/shama/userhome

var path = require( 'path' );

module.exports = function () {
  var home = process.env[ ( process.platform === 'win32' ) ? 'USERPROFILE' : 'HOME' ];
  if ( !home ) {
    throw new Error( 'Could not find a valid user home path.' );
  }
  return path.resolve.apply( path.resolve, [ home ]
    .concat( Array.prototype.slice.call( arguments, 0 ) ) );
};