# mmo-server
Simple NodeJS Massive-Multiplayers-Online game server

```
var Server = require("mmo-server").server;
Server.start({
  root: "./www",
  onSuccess: function( args ) {
    console.log( "Server started on IP ", args.ip, " and port ", args.port );
  },
  onFailure: function( err ) {
    console.error( "Server failed to start due to the following error:\n", err );
  },
  onRequest: function( serviceName, data, resolve, reject ) {
    // Just echoes the data.
    resolve( data );
  }
});
```
