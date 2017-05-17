"use strict";

var Path = require( "path" );
var MMO = require( "../bin/index.js" );

MMO.start( {
  port: 8000,
  root: Path.join( Path.dirname( __filename ), "www" ),
  onSuccess: function ( args ) {
    start( args );
  },
  onFailure: function ( err ) {
    console.error( "Server failed to start due to the following error:\n", err );
  },
  onRequest: function ( serviceName, data, resolve, reject ) {
    if ( serviceName === 'sum' ) processSum( data, resolve, reject );
    else reject( "Unknown service: " + JSON.stringify( serviceName ) );
  }
} );


function processSum( data, resolve, reject ) {
  if ( !Array.isArray( data ) ) {
    throw "Argument must be an array!";
  }
  var total = 0;
  var val;
  for ( var i = 0; i < data.length; i++ ) {
    val = data[ i ];
    if ( typeof val !== 'number' ) {
      throw "Element #" + i + " must be a number!";
    }
    total += val;
  }
  resolve( total );
}


function start( args ) {
  var location = require( "./lib/firefox-location" );
  var command = location + " " + "http://" + args.address + ":" + args.port + "/index.html";
  console.info( "args=", JSON.stringify( args, null, '  ' ) );
  console.log( "Spawning ", command );
  require( "child_process" ).exec( command );
}