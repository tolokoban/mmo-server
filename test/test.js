"use strict";

var Path = require( "path" );
var MMO = require( "../bin/index.js" );

MMO.server.start( {
  port: 8000,
  root: Path.join( Path.dirname( __filename ), "www" ),
  onSuccess: function ( args ) {
    console.log( "Server started on IP ", args.ip, " and port ", args.port );
  },
  onFailure: function ( err ) {
    console.error( "Server failed to start due to the following error:\n", err );
  },
  onRequest: function ( serviceName, data, resolve, reject ) {

  }
} );