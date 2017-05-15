"use strict";

var FS = require( "fs" );
var HTTP = require( "http" );


exports.start = function ( args ) {
  // Define default arguments.
  if ( !args || typeof args !== 'object' ) args = {};
  if ( typeof args.root === 'undefined' ) args.root = 'www';
  if ( typeof args.port !== "number" || isNaN( args.port ) ) args.port = 0;
  if ( typeof args.onFailure === "undefined" ) args.onFailure = function ( err ) {
    fatal( "Server failed to start due to the following error:\n" + err );
  };
  if ( typeof args.onSuccess === "undefined" ) args.onSuccess = function ( args ) {
    console.log( "Server started on hostname", args.hostname, "and port", args.port );
  };
  if ( typeof args.onRequest === "undefined" ) args.onRequest = function (
    serviceName, data, resolve, reject
  ) {
    throw "Unknown service \"" + serviceName + "\"!";
  };

  // Check arguments.


  // Start web server.
  var server = HTTP.createServer( ( request, response ) => {
    response.statusCode = 200;
    response.setHeader( 'Content-Type', 'text/plain' );
    response.end( JSON.stringify( {
      headers: request.headers,
      httpVersion: request.httpVersion,
      method: request.method,
      url: request.url,
      content: request.read()
    }, null, '  ' ) );
  } );

  server.listen( args.port, () => {
    var addr = server.address();
    args.onSuccess( {
      port: addr.port,
      hostname: addr.address
    } );
  } );
}




function fatal( err ) {
  console.error( err );
  process.exit( 1 );
}