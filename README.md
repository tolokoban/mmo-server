# mmo-server
_Simple NodeJS Massive-Multiplayers-Online game server_.

This is an HTTP server, more suited for HTML5 games.
It responds to the following methods:
* __GET__: deliver a static file (see `root` config attribute) with the appropriate content-type.
* __POST__: call a Javascript function and return the result in JSON format.

Here is an example of how to use this module to create your own server:  

```js
var Server = require("mmo-server");

Server.start({
  // Path of static files.
  root: "./www",
  // Port to listen on. If not defined (or defined to zero), the first free port
  // will be automatically selected.
  port: 8000,
  // Function called as soon as the server starts successfully.
  // `args` is an object with the following attributes:
  // * `address`: hostname or IP address.
  // * `port`: port on which the server is listening.
  onSuccess: function( args ) {
    console.log( "Server started on ", args.hostname, ":", args.port );
  },
  // Function called if the server failed to start.
  // `err` is the error message.
  onFailure: function( err ) {
    console.error( "Server failed to start due to the following error:\n", err );
  },
  // Function call on each POST request.
  // * `serviceName`: name of the service to execute.
  // * `data`: argument to pass to the service.
  // * `resolve`: function to call to send the result of the service.
  // * `reject`: function to use to send an error back.
  onRequest: function( serviceName, data, resolve, reject ) {
    if ( serviceName === 'sum' ) {
      if ( !Array.isArray( data ) ) {
        reject( "Argument for `sum` must be an Array!" );
      }
      else {
        var sum = data.reduce(function(acc, val) {
          acc += val;
        });
        resolve({
          input: data,
          sum: sum,
          average: sum / data.length
        });
      }
    }
    else {
      reject( "Unknown service: " + serviceName );
    }
  }
});
```

## Client

Here is an example of a browser client using the _summation_ service described in the previous example:

```js
window.addEventListener( "DOMContentLoaded", function () {
  svc( "sum", [3,7] ).then( function ( result ) {
    alert( "3+7=" + result );
  } );
} );

// You can use this function as is to send queries to a specific service.
// The return is a Promise.
function svc( name, data ) {
  return new Promise( function ( resolve, reject ) {
    fetch( name, {
      method: "POST",
      body: JSON.stringify( data )
    } ).then(
      function ( response ) {
        if ( response.ok ) {
          response.text().then( function ( text ) {
            try {
              resolve( JSON.parse( text ) );
            } catch ( ex ) {
              reject( "Invalid JSON: " + text );
            }
          } );
        } else {
          response.text().then( function ( text ) {
            reject( "Error " + response.status + ": " + text );
          } )
        }
      }
    ).catch( reject );
  } );
}
```