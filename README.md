# mmo-server
Simple NodeJS Massive-Multiplayers-Online game server

```
var Server = require("mmo-server");
Server.start({
  root: "./www",
  onSuccess: function( args ) {
    console.log( "Server started on IP ", args.ip, " and port ", args.port );
  },
  onFailure: function( err ) {
    console.error( "Server failed to start due to the following error:\n", err );
  },
  onRequest: function( serviceName, data ) {
    // Just echoes the data.
    return data;
  }
});
```
