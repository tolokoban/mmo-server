"use strict";

var OS = require( "os" );
var FS = require( "fs" );
var HTTP = require( "http" );
var Path = require( "path" );


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
    var method = request.method.toUpperCase();
    if ( method === 'GET' ) processGet( args, request, response );
    else if ( method === 'POST' ) processPost( args, request, response );
    else {
      response.statusCode = 500;
      console.log( "A" );
      response.setHeader( 'Content-Type', 'text/plain' );
      response.end( JSON.stringify( {
        headers: request.headers,
        httpVersion: request.httpVersion,
        method: request.method,
        url: request.url,
        content: request.read()
      }, null, '  ' ) );
    }
  } );

  server.listen( args.port, () => {
    var addr = server.address();
    var networkInterfaces = OS.networkInterfaces();
    var name, interfaces;
    for ( name in networkInterfaces ) {
      interfaces = networkInterfaces[ name ];
      interfaces.forEach( function ( itf ) {
        if ( itf.internal !== false ) return;
        if ( itf.family !== 'IPv4' ) return;
        addr.address = itf.address;
        addr.family = 'IPv4';
      } );
    }
    args.onSuccess( addr );
  } );
}




function fatal( err ) {
  console.error( err );
  process.exit( 1 );
}


function processPost( args, request, response ) {
  var data = '';
  request.on( 'data', function ( chunk ) {
    data += chunk;
  } );
  request.on( 'end', function () {
    try {
      try {
        data = JSON.parse( data );
      } catch ( ex ) {
        throw "Input is not a valid JSON!";
      }
      var serviceName = request.url.substr( 1 );
      args.onRequest(
        serviceName,
        data,
        function ( result ) {
          if ( response.finished ) {
            console.error(
              "### ERROR! Service '", serviceName,
              "' attempted to respond more than once!\n",
              data
            );
            return;
          }
          response.statusCode = 200;
          response.setHeader( 'Content-Type', 'text/plain' );
          response.end( JSON.stringify( result ) );
        },
        function ( err ) {
          if ( response.finished ) {
            console.error(
              "### ERROR! Service '", serviceName,
              "' attempted to respond more than once!\n",
              data
            );
            return;
          }
          console.error( "### Error from services manager: ", JSON.stringify( err ) );
          response.statusCode = 500;
          response.setHeader( 'Content-Type', 'text/plain' );
          response.end( JSON.stringify( err ) );
        }
      );
    } catch ( ex ) {
      console.error( "Exception: ", ex );
      response.statusCode = 500;
      response.setHeader( 'Content-Type', 'text/plain' );
      response.end( JSON.stringify( ex ) );
    }
  } );
}

function processGet( args, request, response ) {
  var path = Path.join( args.root, request.url );

  if ( FS.existsSync( path ) ) {
    response.statusCode = 200;
    response.setHeader( 'Content-Type', getContentType( Path.extname( path ).toLowerCase() ) );
    response.end( FS.readFileSync( path ) );
  } else {
    response.statusCode = 404;
    response.end( "File not found: " + path );
  }
}


var EXTENSIONS = {
  '.html': 'text/html',
  '.gif': 'image/gif',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.css': 'text/css',
  '.js': 'application/javascript'
}

function getContentType( ext ) {
  var ext = EXTENSIONS[ ext ];
  return ext || 'text/plain';
}